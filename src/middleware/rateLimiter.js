const rateLimit = require('express-rate-limit');

// General API rate limiter
exports.apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 100 requests per window
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false }
});

// Stricter rate limiter for authentication routes
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  skipSuccessfulRequests: true, // Don't count successful requests
  validate: { xForwardedForHeader: false },
  message: {
    success: false,
    error: 'Too many login attempts from this IP, please try again after 15 minutes.'
  }
});

// Payment route limiter
exports.paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 payment attempts per hour
  validate: { xForwardedForHeader: false },
  message: {
    success: false,
    error: 'Too many payment attempts, please try again later.'
  }
});

// Wallet add money limiter
exports.walletLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 add money requests per hour
  validate: { xForwardedForHeader: false },
  message: {
    success: false,
    error: 'Too many wallet transactions, please try again later.'
  }
});
