/**
 * Application Configuration Keys
 * Centralizes environment variable access with sensible defaults
 */

require('dotenv').config();

module.exports = {
  // MongoDB connection string
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/deal-detector',

  // JWT secret for token signing
  jwtSecret: process.env.JWT_SECRET || 'deal-detector-secret-key-change-in-production',

  // JWT token expiration
  jwtExpiration: process.env.JWT_EXPIRATION || '7d',

  // Server port
  port: process.env.PORT || 5000,

  // Client URL for CORS
  clientURL: process.env.CLIENT_URL || 'http://localhost:3000',

  // Scraper service URL
  scraperServiceURL: process.env.SCRAPER_URL || 'http://localhost:8000',

  // Price drop threshold (percentage) to trigger alerts
  priceDropThreshold: process.env.PRICE_DROP_THRESHOLD || 10,

  // Maximum number of price history entries per product
  maxPriceHistory: process.env.MAX_PRICE_HISTORY || 365,
};
