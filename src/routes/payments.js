const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');
const { paymentLimiter } = require('../middleware/rateLimiter');

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Razorpay payment processing
 */

/**
 * @swagger
 * /payments/create-order:
 *   post:
 *     summary: Create a Razorpay order for booking payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bookingId]
 *             properties:
 *               bookingId: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Razorpay order created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     orderId: { type: string }
 *                     amount: { type: number }
 *                     currency: { type: string, example: INR }
 *                     key: { type: string }
 */

/**
 * @swagger
 * /payments/verify:
 *   post:
 *     summary: Verify Razorpay payment signature and confirm booking
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [razorpay_order_id, razorpay_payment_id, razorpay_signature]
 *             properties:
 *               razorpay_order_id: { type: string }
 *               razorpay_payment_id: { type: string }
 *               razorpay_signature: { type: string }
 *     responses:
 *       200:
 *         description: Payment verified, booking confirmed
 */

/**
 * @swagger
 * /payments/webhook:
 *   post:
 *     summary: Razorpay webhook handler (called by Razorpay server)
 *     tags: [Payments]
 *     security: []
 *     description: This endpoint is called by Razorpay to notify payment status. Do not call manually.
 *     responses:
 *       200:
 *         description: Webhook processed
 */

router.post('/create-order', protect, paymentLimiter, paymentController.createOrder);
router.post('/verify', protect, paymentController.verifyPayment);
router.post('/webhook', paymentController.handleWebhook);

module.exports = router;
