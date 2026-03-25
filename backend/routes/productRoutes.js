/**
 * Product Routes
 * Defines all product-related API endpoints
 */

const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getPriceHistory,
  getTopDeals,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getProducts);
router.get('/deals/top', getTopDeals);
router.get('/:id', getProductById);
router.get('/:id/price-history', getPriceHistory);

// Protected routes
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;
