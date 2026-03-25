/**
 * Product Controller
 * Handles all product-related business logic
 */

const Product = require('../models/Product');

/**
 * @desc    Get all products with pagination, search, and filtering
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      source,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    // Build filter object
    const filter = {};

    if (search) {
      filter.$text = { $search: search };
    }

    if (category) {
      filter.category = category;
    }

    if (source) {
      filter.source = source;
    }

    if (minPrice || maxPrice) {
      filter.currentPrice = {};
      if (minPrice) filter.currentPrice.$gte = Number(minPrice);
      if (maxPrice) filter.currentPrice.$lte = Number(maxPrice);
    }

    // Execute query with pagination
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug icon')
      .populate('createdBy', 'name email');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private
 */
const createProduct = async (req, res, next) => {
  try {
    // Attach the authenticated user as the creator
    req.body.createdBy = req.user._id;

    // Initialize price history with the first entry
    req.body.priceHistory = [
      {
        price: req.body.currentPrice,
        date: new Date(),
        source: req.body.source || 'manual',
      },
    ];

    const product = await Product.create(req.body);

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private
 */
const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // If price changed, add to price history
    if (req.body.currentPrice && req.body.currentPrice !== product.currentPrice) {
      req.body.$push = {
        priceHistory: {
          price: req.body.currentPrice,
          date: new Date(),
          source: req.body.source || 'manual',
        },
      };
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private (Admin)
 */
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get price history for a product
 * @route   GET /api/products/:id/price-history
 * @access  Public
 */
const getPriceHistory = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).select('name priceHistory');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        productName: product.name,
        history: product.priceHistory,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get top deals (biggest discounts)
 * @route   GET /api/products/deals/top
 * @access  Public
 */
const getTopDeals = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const products = await Product.aggregate([
      {
        $match: {
          originalPrice: { $gt: 0 },
          isAvailable: true,
        },
      },
      {
        $addFields: {
          discount: {
            $multiply: [
              { $divide: [{ $subtract: ['$originalPrice', '$currentPrice'] }, '$originalPrice'] },
              100,
            ],
          },
        },
      },
      { $sort: { discount: -1 } },
      { $limit: Number(limit) },
    ]);

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getPriceHistory,
  getTopDeals,
};
