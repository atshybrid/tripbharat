const crypto = require('crypto');

// Generate random string
exports.generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Generate referral code
exports.generateReferralCode = (name) => {
  const prefix = name.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, '');
  const randomNum = Math.floor(100 + Math.random() * 900);
  return `${prefix}${randomNum}`;
};

// Generate booking number
exports.generateBookingNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(10000000 + Math.random() * 90000000);
  return `TRV${year}${random}`;
};

// Generate transaction ID
exports.generateTransactionId = () => {
  const timestamp = Date.now();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `TXN${timestamp}${random}`;
};

// Calculate pagination
exports.getPagination = (page = 1, limit = 10) => {
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  
  const skip = (pageNum - 1) * limitNum;
  
  return {
    page: pageNum,
    limit: limitNum,
    skip
  };
};

// Format pagination response
exports.formatPaginationResponse = (data, total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    data,
    pagination: {
      currentPage: parseInt(page),
      totalPages,
      totalItems: total,
      itemsPerPage: parseInt(limit),
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
};

// Calculate refund amount based on cancellation policy
exports.calculateRefund = (totalAmount, travelDate) => {
  const now = new Date();
  const travel = new Date(travelDate);
  const hoursUntilTravel = (travel - now) / (1000 * 60 * 60);
  
  const fullRefundHours = parseInt(process.env.BOOKING_FULL_REFUND_HOURS) || 168; // 7 days
  const partialRefundHours = parseInt(process.env.BOOKING_PARTIAL_REFUND_HOURS) || 72; // 3 days
  const partialRefundPercent = parseInt(process.env.BOOKING_PARTIAL_REFUND_PERCENT) || 50;
  
  if (hoursUntilTravel >= fullRefundHours) {
    return {
      refundAmount: totalAmount,
      refundPercentage: 100,
      cancellationFee: 0
    };
  } else if (hoursUntilTravel >= partialRefundHours) {
    const refundAmount = Math.round((totalAmount * partialRefundPercent) / 100);
    return {
      refundAmount,
      refundPercentage: partialRefundPercent,
      cancellationFee: totalAmount - refundAmount
    };
  } else {
    return {
      refundAmount: 0,
      refundPercentage: 0,
      cancellationFee: totalAmount
    };
  }
};

// Calculate taxes
exports.calculateTaxes = (amount) => {
  const gstPercentage = parseFloat(process.env.GST_PERCENTAGE) || 12;
  return Math.round((amount * gstPercentage) / 100);
};

// Format currency
exports.formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Format date
exports.formatDate = (date, format = 'long') => {
  const options = format === 'long' 
    ? { year: 'numeric', month: 'long', day: 'numeric' }
    : { year: 'numeric', month: '2-digit', day: '2-digit' };
    
  return new Date(date).toLocaleDateString('en-IN', options);
};

// Sanitize user input
exports.sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }
  return input;
};

// Check if date is in future
exports.isFutureDate = (date) => {
  return new Date(date) > new Date();
};

// Calculate days between dates
exports.daysBetween = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((new Date(date1) - new Date(date2)) / oneDay));
};

// Verify Razorpay signature
exports.verifyRazorpaySignature = (orderId, paymentId, signature) => {
  const crypto = require('crypto');
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
    
  return generatedSignature === signature;
};

// Create success response
exports.successResponse = (res, statusCode = 200, message, data = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

// Create error response
exports.errorResponse = (res, statusCode = 500, message, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    error: message,
    errors
  });
};
