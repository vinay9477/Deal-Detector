"""
Deal Detector — Web Scraper Module
===================================
Scrapes product prices from multiple e-commerce websites
using BeautifulSoup (for static pages) and Selenium (for dynamic/JS-rendered pages).

Workflow:
    1. Accept a list of product URLs or search queries
    2. Determine the source website and select the appropriate scraper
    3. Fetch the page (requests for static, Selenium for dynamic)
    4. Parse HTML with BeautifulSoup to extract product data
    5. Return structured data (name, price, image, availability)
    6. Optionally push scraped data to the backend API

Requirements:
    pip install -r requirements.txt

Usage:
    python scraper.py
"""

import time
import json
import re
import logging
from datetime import datetime

import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# ─── Configuration ─────────────────────────────────────────────
BACKEND_API_URL = "http://localhost:5000/api"
REQUEST_TIMEOUT = 15  # seconds
SELENIUM_WAIT = 10  # seconds

# Request headers to mimic a real browser
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("DealDetector")


# ─── Selenium WebDriver Setup ─────────────────────────────────
def create_driver():
    """
    Create a headless Chrome WebDriver instance.
    Used for JavaScript-rendered pages (e.g., dynamic pricing).
    """
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run in headless mode (no GUI)
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument(f"user-agent={HEADERS['User-Agent']}")

    # Initialize the Chrome driver
    driver = webdriver.Chrome(options=chrome_options)
    return driver


# ─── Price Parsing Utility ─────────────────────────────────────
def parse_price(price_text):
    """
    Extract a numeric price from a string like '$29.99' or '₹1,499.00'.

    Args:
        price_text (str): Raw price string from the page

    Returns:
        float: Parsed price value, or 0.0 if parsing fails
    """
    if not price_text:
        return 0.0

    # Remove currency symbols, commas, and whitespace
    cleaned = re.sub(r"[^\d.]", "", price_text.strip())

    try:
        return float(cleaned)
    except ValueError:
        logger.warning(f"Could not parse price: '{price_text}'")
        return 0.0


# ─── Static Page Scraper (BeautifulSoup) ───────────────────────
def scrape_static_page(url, selectors):
    """
    Scrape a static HTML page using requests + BeautifulSoup.
    Best for pages that don't require JavaScript execution.

    Args:
        url (str): Product page URL
        selectors (dict): CSS selectors for extracting data
            - name: selector for product name
            - price: selector for current price
            - original_price: selector for original/list price
            - image: selector for product image
            - rating: selector for product rating
            - availability: selector for stock status

    Returns:
        dict: Extracted product data
    """
    logger.info(f"Scraping (static): {url}")

    try:
        response = requests.get(url, headers=HEADERS, timeout=REQUEST_TIMEOUT)
        response.raise_for_status()
    except requests.RequestException as e:
        logger.error(f"Request failed: {e}")
        return None

    soup = BeautifulSoup(response.text, "html.parser")

    # Extract data using provided CSS selectors
    product_data = {
        "name": _extract_text(soup, selectors.get("name")),
        "currentPrice": parse_price(_extract_text(soup, selectors.get("price"))),
        "originalPrice": parse_price(_extract_text(soup, selectors.get("original_price"))),
        "imageUrl": _extract_attr(soup, selectors.get("image"), "src"),
        "rating": _extract_rating(soup, selectors.get("rating")),
        "url": url,
        "source": _detect_source(url),
        "isAvailable": True,
        "lastScrapedAt": datetime.utcnow().isoformat(),
    }

    logger.info(f"Scraped: {product_data['name']} — ${product_data['currentPrice']}")
    return product_data


# ─── Dynamic Page Scraper (Selenium) ──────────────────────────
def scrape_dynamic_page(url, selectors):
    """
    Scrape a JavaScript-rendered page using Selenium WebDriver.
    Use this when the page content is loaded dynamically via JS.

    Args:
        url (str): Product page URL
        selectors (dict): CSS selectors for extracting data

    Returns:
        dict: Extracted product data
    """
    logger.info(f"Scraping (dynamic): {url}")
    driver = None

    try:
        driver = create_driver()
        driver.get(url)

        # Wait for the price element to appear (ensures page is loaded)
        WebDriverWait(driver, SELENIUM_WAIT).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, selectors.get("price", "body")))
        )

        # Brief pause for any remaining JS execution
        time.sleep(2)

        # Get the rendered page source
        page_source = driver.page_source
        soup = BeautifulSoup(page_source, "html.parser")

        product_data = {
            "name": _extract_text(soup, selectors.get("name")),
            "currentPrice": parse_price(_extract_text(soup, selectors.get("price"))),
            "originalPrice": parse_price(_extract_text(soup, selectors.get("original_price"))),
            "imageUrl": _extract_attr(soup, selectors.get("image"), "src"),
            "rating": _extract_rating(soup, selectors.get("rating")),
            "url": url,
            "source": _detect_source(url),
            "isAvailable": True,
            "lastScrapedAt": datetime.utcnow().isoformat(),
        }

        logger.info(f"Scraped: {product_data['name']} — ${product_data['currentPrice']}")
        return product_data

    except Exception as e:
        logger.error(f"Selenium scraping failed: {e}")
        return None

    finally:
        if driver:
            driver.quit()


# ─── Helper Functions ──────────────────────────────────────────
def _extract_text(soup, selector):
    """Safely extract text content from a CSS selector."""
    if not selector:
        return ""
    element = soup.select_one(selector)
    return element.get_text(strip=True) if element else ""


def _extract_attr(soup, selector, attribute):
    """Safely extract an attribute value from a CSS selector."""
    if not selector:
        return ""
    element = soup.select_one(selector)
    return element.get(attribute, "") if element else ""


def _extract_rating(soup, selector):
    """Extract a numeric rating value."""
    text = _extract_text(soup, selector)
    if not text:
        return 0
    match = re.search(r"(\d+\.?\d*)", text)
    return float(match.group(1)) if match else 0


def _detect_source(url):
    """Determine the e-commerce source from the URL."""
    url_lower = url.lower()
    sources = {
        "amazon": "amazon",
        "flipkart": "flipkart",
        "ebay": "ebay",
        "walmart": "walmart",
        "bestbuy": "bestbuy",
    }
    for keyword, source in sources.items():
        if keyword in url_lower:
            return source
    return "other"


# ─── Backend API Integration ──────────────────────────────────
def push_to_backend(product_data, auth_token=None):
    """
    Send scraped product data to the Deal Detector backend API.

    Args:
        product_data (dict): Product data to send
        auth_token (str): JWT token for authenticated API calls
    """
    if not product_data:
        return

    headers = {"Content-Type": "application/json"}
    if auth_token:
        headers["Authorization"] = f"Bearer {auth_token}"

    try:
        response = requests.post(
            f"{BACKEND_API_URL}/products",
            json=product_data,
            headers=headers,
            timeout=REQUEST_TIMEOUT,
        )
        if response.ok:
            logger.info(f"✅ Product pushed to backend: {product_data['name']}")
        else:
            logger.warning(f"⚠️ Backend responded with {response.status_code}")
    except requests.RequestException as e:
        logger.error(f"Failed to push to backend: {e}")


# ─── Site-Specific Scraper Configurations ─────────────────────
# Each site has its own CSS selectors for extracting product data.
# These would need to be updated if the site layout changes.

SITE_CONFIGS = {
    "amazon": {
        "name": "#productTitle",
        "price": "span.a-price-whole",
        "original_price": "span.a-text-price span.a-offscreen",
        "image": "#landingImage",
        "rating": "span.a-icon-alt",
        "availability": "#availability span",
        "dynamic": False,  # Amazon renders most data server-side
    },
    "flipkart": {
        "name": "span.B_NuCI",
        "price": "div._30jeq3._16Jk6d",
        "original_price": "div._3I9_wc._2p6lqe",
        "image": "img._396cs4._2amPTt._3qGmMb",
        "rating": "div._3LWZlK",
        "availability": "div._16FRp0",
        "dynamic": True,  # Flipkart uses heavy JS rendering
    },
    "ebay": {
        "name": "h1.x-item-title__mainTitle span",
        "price": "div.x-price-primary span",
        "original_price": "span.ux-textspans--STRIKETHROUGH",
        "image": "img.ux-image-carousel-item",
        "rating": "span.ux-seller-section__item--seller-rating",
        "availability": "div.d-quantity__availability",
        "dynamic": False,
    },
}


# ─── Main Scraping Orchestrator ───────────────────────────────
def scrape_product(url):
    """
    Main entry point: scrape a product from any supported URL.
    Automatically detects the source and applies the correct config.

    Args:
        url (str): Product page URL

    Returns:
        dict: Scraped product data, or None if scraping fails
    """
    source = _detect_source(url)
    config = SITE_CONFIGS.get(source)

    if not config:
        logger.warning(f"No scraper config for source '{source}'. Using generic scraper.")
        # Fallback: attempt a generic static scrape
        return scrape_static_page(url, {
            "name": "h1",
            "price": "[class*='price']",
        })

    # Choose scraping method based on site config
    if config.get("dynamic"):
        return scrape_dynamic_page(url, config)
    else:
        return scrape_static_page(url, config)


def scrape_multiple(urls):
    """
    Scrape multiple product URLs.

    Args:
        urls (list): List of product URLs

    Returns:
        list: List of scraped product data dicts
    """
    results = []
    total = len(urls)

    for i, url in enumerate(urls, 1):
        logger.info(f"[{i}/{total}] Scraping: {url}")
        data = scrape_product(url)

        if data:
            results.append(data)

        # Polite delay between requests to avoid rate limiting
        if i < total:
            time.sleep(3)

    logger.info(f"Scraping complete: {len(results)}/{total} products scraped successfully.")
    return results


# ─── Entry Point ──────────────────────────────────────────────
if __name__ == "__main__":
    # Example usage — replace with real product URLs
    sample_urls = [
        "https://www.amazon.com/dp/B0EXAMPLE1",
        "https://www.flipkart.com/product-example",
        "https://www.ebay.com/itm/example-item",
    ]

    logger.info("=" * 60)
    logger.info("  Deal Detector — Web Scraper")
    logger.info("=" * 60)

    # Scrape all products
    products = scrape_multiple(sample_urls)

    # Print results
    print("\n📦 Scraped Products:")
    print(json.dumps(products, indent=2, default=str))

    # Optionally push to backend
    # for product in products:
    #     push_to_backend(product, auth_token="your-jwt-token-here")
