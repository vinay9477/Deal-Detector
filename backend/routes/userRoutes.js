/**
 * User Routes
 * Defines authentication and user management endpoints
 */

const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  trackProduct,
  untrackProduct,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

// Public — authentication
router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);

// Protected — profile management
router.get('/me', protect, getProfile);
router.put('/me', protect, updateProfile);

// Protected — product tracking
router.post('/track/:productId', protect, trackProduct);
router.delete('/track/:productId', protect, untrackProduct);

module.exports = router;
