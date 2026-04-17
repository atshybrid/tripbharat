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

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User registration, login and profile management
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, phone]
 *             properties:
 *               name: { type: string, example: "Ravi Kumar" }
 *               email: { type: string, format: email, example: "ravi@example.com" }
 *               password: { type: string, example: "StrongPass@123" }
 *               phone: { type: string, example: "9876543210" }
 *               referralCode: { type: string, example: "ABC123" }
 *     responses:
 *       201:
 *         description: User registered successfully, returns JWT token
 *       400:
 *         description: Validation error or email already exists
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with email & password
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "admin@sktours.com" }
 *               password: { type: string, example: "Admin@12345" }
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token and user data
 *       401:
 *         description: Invalid credentials or account locked
 */

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Login or register with Google OAuth
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [idToken]
 *             properties:
 *               idToken: { type: string, description: "Google ID token from client SDK" }
 *     responses:
 *       200:
 *         description: Login/register successful, returns JWT token
 *       400:
 *         description: Invalid Google token
 */

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset email
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email, example: "user@example.com" }
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /auth/reset-password/{token}:
 *   post:
 *     summary: Reset password using email token
 *     tags: [Authentication]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema: { type: string }
 *         description: Reset token received via email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               password: { type: string, example: "NewPass@123" }
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 */

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current logged-in user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /auth/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: "Ravi Kumar" }
 *               phone: { type: string, example: "9876543210" }
 *               profileImage: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Profile updated
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Change password (while logged in)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword: { type: string }
 *               newPassword: { type: string, example: "NewPass@123" }
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       401:
 *         description: Current password incorrect
 */

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

// Google OAuth login / register
router.post(
  '/google',
  authLimiter,
  authController.googleLogin
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
