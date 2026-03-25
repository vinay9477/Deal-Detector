/**
 * Utility Helpers
 * Shared helper functions used across the application
 */

/**
 * Format a price value with currency symbol
 * @param {number} price - The price value
 * @param {string} currency - Currency code (USD, INR, EUR, GBP)
 * @returns {string} Formatted price string
 */
const formatPrice = (price, currency = 'USD') => {
  const symbols = {
    USD: '$',
    INR: '₹',
    EUR: '€',
    GBP: '£',
  };

  const symbol = symbols[currency] || '$';
  return `${symbol}${price.toFixed(2)}`;
};

/**
 * Calculate percentage change between two values
 * @param {number} oldValue - Original value
 * @param {number} newValue - New value
 * @returns {number} Percentage change (negative = decrease)
 */
const calculatePercentageChange = (oldValue, newValue) => {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
};

/**
 * Sanitize a search query string
 * @param {string} query - Raw search query
 * @returns {string} Sanitized query
 */
const sanitizeQuery = (query) => {
  return query.replace(/[^\w\s-]/g, '').trim();
};

/**
 * Build a pagination response object
 * @param {number} total - Total number of items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {object} Pagination metadata
 */
const buildPaginationMeta = (total, page, limit) => {
  return {
    total,
    page: Number(page),
    limit: Number(limit),
    pages: Math.ceil(total / limit),
    hasNextPage: page * limit < total,
    hasPrevPage: page > 1,
  };
};

/**
 * Generate a slug from a string
 * @param {string} text - Input text
 * @returns {string} URL-friendly slug
 */
const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

module.exports = {
  formatPrice,
  calculatePercentageChange,
  sanitizeQuery,
  buildPaginationMeta,
  slugify,
};
