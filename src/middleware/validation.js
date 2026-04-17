const { body, param, query, validationResult } = require('express-validator');
const AppError = require('../utils/appError');

// Middleware to check validation results
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg
    }));
    
    return next(new AppError('Validation failed', 422, errorMessages));
  }
  
  next();
};

// User validation rules
exports.signupValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('confirmPassword')
    .notEmpty().withMessage('Confirm password is required')
    .custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match'),
  
  body('phone')
    .optional()
    .matches(/^[+]?[\d\s\-()]+$/).withMessage('Please provide a valid phone number'),
  
  body('referralCode')
    .optional()
    .isLength({ min: 6, max: 10 }).withMessage('Invalid referral code')
];

exports.loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
];

exports.updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  
  body('phone')
    .optional()
    .matches(/^[+]?[\d\s\-()]+$/).withMessage('Please provide a valid phone number')
];

exports.changePasswordValidation = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),
  
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('confirmPassword')
    .notEmpty().withMessage('Confirm password is required')
    .custom((value, { req }) => value === req.body.newPassword).withMessage('Passwords do not match')
];

// Package validation rules
exports.createPackageValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Package name is required')
    .isLength({ min: 5, max: 100 }).withMessage('Package name must be between 5 and 100 characters'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 20, max: 2000 }).withMessage('Description must be between 20 and 2000 characters'),
  
  body('destination')
    .trim()
    .notEmpty().withMessage('Destination is required'),
  
  body('duration')
    .notEmpty().withMessage('Duration is required')
    .isInt({ min: 1 }).withMessage('Duration must be at least 1 day'),
  
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  
  body('discountedPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Discounted price must be a positive number')
    .custom((value, { req }) => !value || value < req.body.price).withMessage('Discounted price must be less than original price'),
  
  body('availableSeats')
    .notEmpty().withMessage('Available seats is required')
    .isInt({ min: 0 }).withMessage('Available seats cannot be negative'),
  
  body('category')
    .optional()
    .isIn(['adventure', 'relaxation', 'cultural', 'family', 'romantic', 'other']).withMessage('Invalid category')
];

// Booking validation rules
exports.createBookingValidation = [
  body('packageId')
    .notEmpty().withMessage('Package ID is required')
    .isMongoId().withMessage('Invalid package ID'),
  
  body('travelDate')
    .notEmpty().withMessage('Travel date is required')
    .isISO8601().withMessage('Invalid date format')
    .custom((value) => new Date(value) >= new Date()).withMessage('Travel date must be in the future'),
  
  body('numberOfTravelers')
    .notEmpty().withMessage('Number of travelers is required')
    .isInt({ min: 1 }).withMessage('Must have at least 1 traveler'),
  
  body('travelers')
    .isArray({ min: 1 }).withMessage('Travelers information is required'),
  
  body('travelers.*.name')
    .trim()
    .notEmpty().withMessage('Traveler name is required'),
  
  body('travelers.*.age')
    .isInt({ min: 1, max: 120 }).withMessage('Invalid age'),
  
  body('travelers.*.gender')
    .isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
  
  body('contactDetails.name')
    .trim()
    .notEmpty().withMessage('Contact name is required'),
  
  body('contactDetails.email')
    .trim()
    .notEmpty().withMessage('Contact email is required')
    .isEmail().withMessage('Invalid email'),
  
  body('contactDetails.phone')
    .trim()
    .notEmpty().withMessage('Contact phone is required'),
  
  body('paymentMethod')
    .notEmpty().withMessage('Payment method is required')
    .isIn(['wallet', 'razorpay', 'card', 'upi']).withMessage('Invalid payment method')
];

// Get-Together validation rules
exports.createGetTogetherValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  
  body('totalBudget')
    .optional()
    .isFloat({ min: 0 }).withMessage('Budget must be a positive number'),
  
  body('destination')
    .optional()
    .trim()
];

// Wallet validation rules
exports.addMoneyValidation = [
  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isFloat({ min: 100 }).withMessage('Minimum amount is ₹100')
    .isFloat({ max: 50000 }).withMessage('Maximum amount is ₹50,000 per transaction'),
  
  body('paymentMethod')
    .optional()
    .isIn(['razorpay', 'card', 'upi']).withMessage('Invalid payment method')
];

// Review validation rules
exports.createReviewValidation = [
  body('packageId')
    .notEmpty().withMessage('Package ID is required')
    .isMongoId().withMessage('Invalid package ID'),
  
  body('rating')
    .notEmpty().withMessage('Rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Comment cannot exceed 500 characters')
];

// ID parameter validation — supports both MongoDB ObjectId and PostgreSQL UUID
exports.validateMongoId = [
  param('id')
    .custom((value) => {
      const isMongoId = /^[0-9a-fA-F]{24}$/.test(value);
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
      if (!isMongoId && !isUUID) {
        throw new Error('Invalid ID format');
      }
      return true;
    })
];

// Pagination validation
exports.paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];
