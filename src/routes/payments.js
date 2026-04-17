const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');
const { paymentLimiter } = require('../middleware/rateLimiter');

router.post('/create-order', protect, paymentLimiter, paymentController.createOrder);
router.post('/verify', protect, paymentController.verifyPayment);
router.post('/webhook', paymentController.handleWebhook);

module.exports = router;
