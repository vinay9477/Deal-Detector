/**
 * Deal Detector — Backend Server
 *
 * Express.js server with MongoDB connection, JWT auth,
 * rate limiting, and RESTful API routes.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { port, clientURL } = require('./config/keys');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

// Route imports
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const alertRoutes = require('./routes/alertRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

// Initialize Express app
const app = express();

// ─── Connect to Database ──────────────────────────────────────────────
connectDB();

// ─── Global Middleware ────────────────────────────────────────────────
app.use(helmet()); // Security headers
app.use(cors({ origin: clientURL, credentials: true })); // CORS
app.use(express.json({ limit: '10mb' })); // JSON body parser
app.use(express.urlencoded({ extended: true })); // URL-encoded bodies
app.use(morgan('dev')); // Request logging
app.use('/api', apiLimiter); // Rate limiting on all /api routes

// ─── API Routes ───────────────────────────────────────────────────────
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/categories', categoryRoutes);

// ─── Health Check ─────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Deal Detector API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ─── 404 Handler ──────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────
const PORT = port;

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║       🔍  Deal Detector API  🔍         ║
  ║                                          ║
  ║   Server running on port ${PORT}            ║
  ║   Environment: ${process.env.NODE_ENV || 'development'}            ║
  ╚══════════════════════════════════════════╝
  `);
});

module.exports = app;
