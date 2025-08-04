import requests
from bs4 import BeautifulSoup

def scrape_deal(url):
    headers = {
        'User-Agent': 'Mozilla/5.0'
    }
    try:
        res = requests.get(url, headers=headers)
        soup = BeautifulSoup(res.text, 'html.parser')

        title = soup.find('span', {'id': 'productTitle'})
        price = soup.find('span', {'class': 'a-price-whole'})

        if title and price:
            return {
                'title': title.text.strip(),
                'price': price.text.strip(),
                'url': url
            }
        else:
            return None
    except Exception as e:
        print("Error scraping:", e)
        return None
