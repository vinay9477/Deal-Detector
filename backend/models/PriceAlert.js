/**
 * PriceAlert Model
 * Represents a user-defined alert for price drops on a product
 */

const mongoose = require('mongoose');

const priceAlertSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    targetPrice: {
      type: Number,
      required: [true, 'Target price is required'],
      min: 0,
    },
    alertType: {
      type: String,
      enum: ['price_drop', 'price_below', 'back_in_stock', 'percentage_drop'],
      default: 'price_below',
    },
    percentageDrop: {
      type: Number,
      min: 1,
      max: 99,
    },
    isTriggered: {
      type: Boolean,
      default: false,
    },
    triggeredAt: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    notificationMethod: {
      type: String,
      enum: ['email', 'push', 'both'],
      default: 'email',
    },
    notes: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient lookups
priceAlertSchema.index({ user: 1, product: 1 });
priceAlertSchema.index({ isActive: 1, isTriggered: 1 });

module.exports = mongoose.model('PriceAlert', priceAlertSchema);
