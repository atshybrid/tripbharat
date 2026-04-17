const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const { createBookingValidation, validateMongoId, paginationValidation, validate } = require('../middleware/validation');

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Tour booking management
 */

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [packageId, numberOfTravelers, startDate, travelers, paymentMethod]
 *             properties:
 *               packageId: { type: string, format: uuid, example: "uuid-of-package" }
 *               numberOfTravelers: { type: integer, example: 2 }
 *               startDate: { type: string, format: date, example: "2026-06-15" }
 *               travelers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name: { type: string }
 *                     age: { type: integer }
 *                     idType: { type: string, enum: [aadhaar, passport, pan] }
 *                     idNumber: { type: string }
 *               paymentMethod: { type: string, enum: [wallet, razorpay, partial] }
 *               specialRequests: { type: string }
 *     responses:
 *       201:
 *         description: Booking created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *   get:
 *     summary: Get all bookings for the logged-in user
 *     tags: [Bookings]
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
 *         description: List of user bookings
 */

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Get a booking by ID
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Booking details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /bookings/{id}/cancel:
 *   post:
 *     summary: Cancel a booking (refund goes to wallet)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason: { type: string, example: "Change of plans" }
 *     responses:
 *       200:
 *         description: Booking cancelled, refund processed
 *       400:
 *         description: Cannot cancel (too close to travel date or already cancelled)
 */

router.post(
  '/',
  protect,
  createBookingValidation,
  validate,
  bookingController.createBooking
);

router.get(
  '/',
  protect,
  paginationValidation,
  validate,
  bookingController.getUserBookings
);

router.get(
  '/:id',
  protect,
  validateMongoId,
  validate,
  bookingController.getBookingById
);

router.post(
  '/:id/cancel',
  protect,
  validateMongoId,
  validate,
  bookingController.cancelBooking
);

module.exports = router;
