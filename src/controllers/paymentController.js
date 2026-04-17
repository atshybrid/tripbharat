const crypto = require('crypto');
const razorpay = require('../config/razorpay');
const { Booking, User, WalletTransaction } = require('../models');
const AppError = require('../utils/appError');

const dbType = process.env.DB_TYPE || 'mongodb';

// POST /api/payment/create-order  (also /api/payments/create-order)
exports.createOrder = async (req, res, next) => {
  try {
    const { amount, bookingId } = req.body;
    if (!amount || amount <= 0) return next(new AppError('Invalid amount', 400));

    const order = await razorpay.orders.create({
      amount: Math.round(parseFloat(amount) * 100), // paise
      currency: 'INR',
      receipt: `receipt_${bookingId || Date.now()}`,
      notes: { bookingId, userId: req.user.id }
    });

    res.status(200).json({
      success: true,
      data: {
        orderId: order.id,
        amount: parseFloat(amount),
        currency: 'INR',
        receipt: order.receipt,
        keyId: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/payment/verify  (also /api/payments/verify)
exports.verifyPayment = async (req, res, next) => {
  try {
    const { orderId, paymentId, signature, bookingId } = req.body;

    const expectedSig = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (expectedSig !== signature) return next(new AppError('Invalid payment signature', 400));

    // Update booking payment status
    if (bookingId) {
      if (dbType === 'postgresql') {
        const booking = await Booking.findByPk(bookingId);
        if (booking) {
          await booking.update({
            paymentStatus: 'completed',
            bookingStatus: 'confirmed',
            razorpayOrderId: orderId,
            razorpayPaymentId: paymentId
          });
        }
      } else {
        await Booking.findByIdAndUpdate(bookingId, {
          paymentStatus: 'paid',
          status: 'confirmed',
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: { paymentId, orderId, bookingId }
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/payments/webhook  — Razorpay webhook
exports.handleWebhook = async (req, res, next) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (webhookSecret) {
      const sig = req.headers['x-razorpay-signature'];
      const body = JSON.stringify(req.body);
      const expectedSig = crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('hex');
      if (sig !== expectedSig) return res.status(400).json({ success: false });
    }

    const { event, payload } = req.body;

    if (event === 'payment.captured') {
      const payment = payload?.payment?.entity;
      const bookingId = payment?.notes?.bookingId;
      if (bookingId) {
        if (dbType === 'postgresql') {
          const booking = await Booking.findByPk(bookingId);
          if (booking) await booking.update({ paymentStatus: 'completed', bookingStatus: 'confirmed' });
        } else {
          await Booking.findByIdAndUpdate(bookingId, { paymentStatus: 'paid', status: 'confirmed' });
        }
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
