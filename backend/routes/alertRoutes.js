/**
 * Alert Routes
 * Defines all price alert-related API endpoints
 */

const express = require('express');
const router = express.Router();
const {
  getUserAlerts,
  createAlert,
  updateAlert,
  deleteAlert,
  checkAlerts,
} = require('../controllers/alertController');
const { protect, authorize } = require('../middleware/auth');

// All alert routes are protected
router.use(protect);

router.get('/', getUserAlerts);
router.post('/', createAlert);
router.put('/:id', updateAlert);
router.delete('/:id', deleteAlert);

// Admin-only: trigger alert check (normally a cron job)
router.post('/check', authorize('admin'), checkAlerts);

module.exports = router;
