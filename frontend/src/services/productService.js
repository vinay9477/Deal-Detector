/**
 * Product Service — API calls for product-related operations
 */

import api from './api';

const productService = {
  /**
   * Get all products with optional filters
   * @param {object} params - { page, limit, search, category, source, minPrice, maxPrice, sortBy, order }
   */
  getProducts: (params = {}) => api.get('/products', { params }),

  /**
   * Get a single product by ID
   */
  getProductById: (id) => api.get(`/products/${id}`),

  /**
   * Get top deals
   * @param {number} limit - Number of deals to fetch
   */
  getTopDeals: (limit = 10) => api.get('/products/deals/top', { params: { limit } }),

  /**
   * Get price history for a product
   */
  getPriceHistory: (id) => api.get(`/products/${id}/price-history`),

  /**
   * Create a new product (requires auth)
   */
  createProduct: (productData) => api.post('/products', productData),

  /**
   * Update a product (requires auth)
   */
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),

  /**
   * Delete a product (requires admin)
   */
  deleteProduct: (id) => api.delete(`/products/${id}`),

  /**
   * Track a product (add to user's tracking list)
   */
  trackProduct: (productId) => api.post(`/users/track/${productId}`),

  /**
   * Untrack a product
   */
  untrackProduct: (productId) => api.delete(`/users/track/${productId}`),

  /**
   * Get user alerts
   */
  getAlerts: (params = {}) => api.get('/alerts', { params }),

  /**
   * Create a price alert
   */
  createAlert: (alertData) => api.post('/alerts', alertData),

  /**
   * Delete an alert
   */
  deleteAlert: (id) => api.delete(`/alerts/${id}`),
};

export default productService;
