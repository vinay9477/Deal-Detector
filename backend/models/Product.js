/**
 * Product Model
 * Represents a tracked product with price history and metadata
 */

const mongoose = require('mongoose');

const priceHistorySchema = new mongoose.Schema(
  {
    price: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    source: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    url: {
      type: String,
      required: [true, 'Product URL is required'],
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    currentPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    lowestPrice: {
      type: Number,
      min: 0,
    },
    highestPrice: {
      type: Number,
      min: 0,
    },
    priceHistory: [priceHistorySchema],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    source: {
      type: String,
      required: true,
      enum: ['amazon', 'flipkart', 'ebay', 'walmart', 'bestbuy', 'other'],
      default: 'other',
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'INR', 'EUR', 'GBP'],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    tags: [{ type: String, trim: true }],
    lastScrapedAt: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: calculate discount percentage
productSchema.virtual('discountPercentage').get(function () {
  if (!this.originalPrice || this.originalPrice === 0) return 0;
  return Math.round(((this.originalPrice - this.currentPrice) / this.originalPrice) * 100);
});

// Index for efficient querying
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ currentPrice: 1 });
productSchema.index({ source: 1 });
productSchema.index({ category: 1 });

// Pre-save hook: update lowest/highest price
productSchema.pre('save', function (next) {
  if (this.isModified('currentPrice')) {
    if (!this.lowestPrice || this.currentPrice < this.lowestPrice) {
      this.lowestPrice = this.currentPrice;
    }
    if (!this.highestPrice || this.currentPrice > this.highestPrice) {
      this.highestPrice = this.currentPrice;
    }
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
