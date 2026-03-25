/**
 * Alert Controller
 * Handles price alert CRUD and alert checking logic
 */

const PriceAlert = require('../models/PriceAlert');
const Product = require('../models/Product');

/**
 * @desc    Get all alerts for the authenticated user
 * @route   GET /api/alerts
 * @access  Private
 */
const getUserAlerts = async (req, res, next) => {
  try {
    const { isActive, isTriggered } = req.query;
    const filter = { user: req.user._id };

    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (isTriggered !== undefined) filter.isTriggered = isTriggered === 'true';

    const alerts = await PriceAlert.find(filter)
      .populate('product', 'name currentPrice imageUrl url')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: alerts });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new price alert
 * @route   POST /api/alerts
 * @access  Private
 */
const createAlert = async (req, res, next) => {
  try {
    const { product, targetPrice, alertType, percentageDrop, notificationMethod, notes } = req.body;

    // Verify product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check for duplicate alert
    const existingAlert = await PriceAlert.findOne({
      user: req.user._id,
      product,
      isActive: true,
    });

    if (existingAlert) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active alert for this product',
      });
    }

    const alert = await PriceAlert.create({
      user: req.user._id,
      product,
      targetPrice,
      alertType: alertType || 'price_below',
      percentageDrop,
      notificationMethod,
      notes,
    });

    res.status(201).json({ success: true, data: alert });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an alert
 * @route   PUT /api/alerts/:id
 * @access  Private
 */
const updateAlert = async (req, res, next) => {
  try {
    let alert = await PriceAlert.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found',
      });
    }

    alert = await PriceAlert.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: alert });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an alert
 * @route   DELETE /api/alerts/:id
 * @access  Private
 */
const deleteAlert = async (req, res, next) => {
  try {
    const alert = await PriceAlert.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found',
      });
    }

    await alert.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Alert deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Check and trigger alerts based on current prices
 * @route   POST /api/alerts/check
 * @access  Private (Admin)
 *
 * This would typically run as a scheduled job (cron)
 */
const checkAlerts = async (req, res, next) => {
  try {
    // Fetch all active, untriggered alerts with product data
    const alerts = await PriceAlert.find({
      isActive: true,
      isTriggered: false,
    }).populate('product', 'currentPrice originalPrice name');

    const triggeredAlerts = [];

    for (const alert of alerts) {
      let shouldTrigger = false;

      switch (alert.alertType) {
        case 'price_below':
          shouldTrigger = alert.product.currentPrice <= alert.targetPrice;
          break;

        case 'price_drop':
          shouldTrigger = alert.product.currentPrice < alert.targetPrice;
          break;

        case 'percentage_drop':
          if (alert.product.originalPrice > 0) {
            const dropPercent =
              ((alert.product.originalPrice - alert.product.currentPrice) /
                alert.product.originalPrice) *
              100;
            shouldTrigger = dropPercent >= (alert.percentageDrop || 10);
          }
          break;

        case 'back_in_stock':
          // Would require availability tracking logic
          shouldTrigger = false;
          break;
      }

      if (shouldTrigger) {
        alert.isTriggered = true;
        alert.triggeredAt = new Date();
        await alert.save();
        triggeredAlerts.push(alert);

        // TODO: Send notification (email, push, etc.)
        console.log(`🔔 Alert triggered for "${alert.product.name}" — target: $${alert.targetPrice}`);
      }
    }

    res.status(200).json({
      success: true,
      message: `Checked ${alerts.length} alerts, triggered ${triggeredAlerts.length}`,
      data: triggeredAlerts,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserAlerts,
  createAlert,
  updateAlert,
  deleteAlert,
  checkAlerts,
};
