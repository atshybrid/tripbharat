const Razorpay = require('razorpay');
const logger = require('../utils/logger');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Test connection
const testConnection = () => {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    logger.info('Razorpay configured successfully');
  } else {
    logger.warn('Razorpay credentials not found in environment variables');
  }
};

testConnection();

module.exports = razorpay;
