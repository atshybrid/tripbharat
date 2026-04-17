const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const { createBookingValidation, validateMongoId, paginationValidation, validate } = require('../middleware/validation');

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
