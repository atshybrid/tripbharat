const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');
const { validateMongoId, paginationValidation, validate } = require('../middleware/validation');

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-only management endpoints (requires admin role)
 */

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats (users, bookings, revenue, etc.)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalUsers: { type: integer }
 *                     totalBookings: { type: integer }
 *                     totalRevenue: { type: number }
 *                     activePackages: { type: integer }
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users (paginated)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: List of all users
 */

/**
 * @swagger
 * /admin/bookings:
 *   get:
 *     summary: Get all bookings (paginated)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [confirmed, pending, cancelled, completed] }
 *     responses:
 *       200:
 *         description: List of all bookings
 */

/**
 * @swagger
 * /admin/bookings/{id}/status:
 *   put:
 *     summary: Update booking status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [confirmed, pending, cancelled, completed] }
 *     responses:
 *       200:
 *         description: Booking status updated
 */

// All admin routes require authentication and admin role
router.use(protect);
router.use(isAdmin);

router.get('/dashboard', adminController.getDashboardStats);
router.get('/stats', adminController.getDashboardStats); // alias
router.get('/users', paginationValidation, validate, adminController.getAllUsers);
router.get('/bookings', paginationValidation, validate, adminController.getAllBookings);
router.put('/bookings/:id/status', validateMongoId, validate, adminController.updateBookingStatus);

module.exports = router;
