const { Booking, TourPackage } = require('../models');
const AppError = require('../utils/appError');

const dbType = process.env.DB_TYPE || 'mongodb';

function genBookingNumber() {
  const year = new Date().getFullYear();
  const rand = String(Date.now()).slice(-8);
  return `TRV${year}${rand}`;
}

// POST /api/bookings
exports.createBooking = async (req, res, next) => {
  try {
    const {
      packageId, packageName, travelDate, numberOfTravelers,
      travelers, contactDetails, totalAmount, paymentMethod
    } = req.body;

    let pkg;
    if (dbType === 'postgresql') {
      pkg = await TourPackage.findByPk(packageId);
    } else {
      pkg = await TourPackage.findById(packageId);
    }
    if (!pkg) return next(new AppError('Package not found', 404));

    const price = parseFloat(pkg.price || pkg.discountedPrice || 0);
    const finalAmount = totalAmount || price * (numberOfTravelers || 1);
    const gstAmount = parseFloat((finalAmount * 0.05).toFixed(2));

    let booking;
    if (dbType === 'postgresql') {
      booking = await Booking.create({
        userId: req.user.id,
        packageId,
        packageName: packageName || pkg.name,
        packagePrice: price,
        numberOfTravelers: numberOfTravelers || 1,
        travelers: travelers || [],
        startDate: travelDate,
        endDate: travelDate,
        totalAmount: finalAmount,
        gstAmount,
        finalAmount: parseFloat((finalAmount + gstAmount).toFixed(2)),
        paymentMethod: paymentMethod || 'razorpay',
        paymentStatus: 'pending',
        bookingStatus: 'pending',
        bookingNumber: genBookingNumber()
      });
    } else {
      booking = await Booking.create({
        userId: req.user.id,
        packageId,
        packageName: packageName || pkg.name,
        travelDate,
        numberOfTravelers,
        travelers,
        contactDetails,
        totalAmount: finalAmount,
        paymentMethod: paymentMethod || 'razorpay',
        paymentStatus: 'pending',
        status: 'pending',
        bookingNumber: genBookingNumber()
      });
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        id: booking.id || booking._id,
        bookingNumber: booking.bookingNumber,
        status: booking.bookingStatus || booking.status,
        paymentStatus: booking.paymentStatus,
        totalAmount: booking.finalAmount || booking.totalAmount,
        createdAt: booking.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/bookings
exports.getUserBookings = async (req, res, next) => {
  try {
    let bookings;
    if (dbType === 'postgresql') {
      bookings = await Booking.findAll({
        where: { userId: req.user.id },
        order: [['createdAt', 'DESC']]
      });
    } else {
      bookings = await Booking.find({ userId: req.user.id }).sort('-createdAt');
    }

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

// GET /api/bookings/:id
exports.getBookingById = async (req, res, next) => {
  try {
    let booking;
    if (dbType === 'postgresql') {
      booking = await Booking.findOne({ where: { id: req.params.id, userId: req.user.id } });
    } else {
      booking = await Booking.findOne({ _id: req.params.id, userId: req.user.id });
    }

    if (!booking) return next(new AppError('Booking not found', 404));

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

// POST /api/bookings/:id/cancel
exports.cancelBooking = async (req, res, next) => {
  try {
    const { reason } = req.body;
    let booking;

    if (dbType === 'postgresql') {
      booking = await Booking.findOne({ where: { id: req.params.id, userId: req.user.id } });
    } else {
      booking = await Booking.findOne({ _id: req.params.id, userId: req.user.id });
    }

    if (!booking) return next(new AppError('Booking not found', 404));

    const cancelable = ['pending', 'confirmed'];
    const currentStatus = booking.bookingStatus || booking.status;
    if (!cancelable.includes(currentStatus)) {
      return next(new AppError('This booking cannot be cancelled', 400));
    }

    if (dbType === 'postgresql') {
      await booking.update({
        bookingStatus: 'cancelled',
        paymentStatus: booking.paymentStatus === 'completed' ? 'refunded' : booking.paymentStatus,
        cancellationReason: reason || '',
        cancelledAt: new Date()
      });
      await booking.reload();
    } else {
      booking.status = 'cancelled';
      booking.paymentStatus = booking.paymentStatus === 'paid' ? 'refunded' : booking.paymentStatus;
      booking.cancellationReason = reason || '';
      booking.cancelledAt = new Date();
      await booking.save();
    }

    res.status(200).json({ success: true, message: 'Booking cancelled successfully', data: booking });
  } catch (error) {
    next(error);
  }
};
