const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { uploadSingle, handleUploadError } = require('../middleware/upload');
const { 
  signupValidation, 
  loginValidation, 
  updateProfileValidation,
  changePasswordValidation,
  validate 
} = require('../middleware/validation');
const { authLimiter } = require('../middleware/rateLimiter');

// Public routes
router.post(
  '/signup',
  authLimiter,
  signupValidation,
  validate,
  authController.signup
);

router.post(
  '/login',
  authLimiter,
  loginValidation,
  validate,
  authController.login
);

router.post(
  '/forgot-password',
  authLimiter,
  authController.forgotPassword
);

router.post(
  '/reset-password/:token',
  authLimiter,
  authController.resetPassword
);

// Protected routes
router.get(
  '/me',
  protect,
  authController.getMe
);

router.put(
  '/profile',
  protect,
  uploadSingle('profileImage'),
  handleUploadError,
  updateProfileValidation,
  validate,
  authController.updateProfile
);

router.post(
  '/change-password',
  protect,
  changePasswordValidation,
  validate,
  authController.changePassword
);

module.exports = router;
