const { User, Booking, TourPackage } = require('../models');
const AppError = require('../utils/appError');

const dbType = process.env.DB_TYPE || 'mongodb';

// GET /api/admin/dashboard  AND  GET /api/admin/stats
exports.getDashboardStats = async (req, res, next) => {
  try {
    let totalUsers, totalBookings, activePackages, pendingBookings, totalRevenue, todayBookings;

    if (dbType === 'postgresql') {
      const { Op } = require('sequelize');
      const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);

      totalUsers      = await User.count({ where: { role: 'user' } });
      totalBookings   = await Booking.count();
      activePackages  = await TourPackage.count({ where: { isActive: true } });
      pendingBookings = await Booking.count({ where: { bookingStatus: 'pending' } });
      todayBookings   = await Booking.count({ where: { createdAt: { [Op.gte]: todayStart } } });

      const revenueResult = await Booking.sum('finalAmount', {
        where: { paymentStatus: 'completed' }
      });
      totalRevenue = revenueResult || 0;
    } else {
      const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
      totalUsers      = await User.countDocuments({ role: 'user' });
      totalBookings   = await Booking.countDocuments();
      activePackages  = await TourPackage.countDocuments({ isActive: true });
      pendingBookings = await Booking.countDocuments({ status: 'pending' });
      todayBookings   = await Booking.countDocuments({ createdAt: { $gte: todayStart } });
      const rev = await Booking.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]);
      totalRevenue = rev[0]?.total || 0;
    }

    res.status(200).json({
      success: true,
      data: { totalUsers, totalBookings, totalRevenue, activePackages, pendingBookings, todayBookings }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/users
exports.getAllUsers = async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 20;

    let users, total;
    if (dbType === 'postgresql') {
      const result = await User.findAndCountAll({
        attributes: { exclude: ['password', 'passwordResetToken', 'passwordResetExpires'] },
        order: [['createdAt', 'DESC']],
        limit,
        offset: (page - 1) * limit
      });
      users = result.rows; total = result.count;
    } else {
      users = await User.find().select('-password -resetPasswordToken').sort('-createdAt')
        .skip((page - 1) * limit).limit(limit);
      total = await User.countDocuments();
    }

    res.status(200).json({
      success: true,
      data: users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/bookings
exports.getAllBookings = async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 20;

    let bookings, total;
    if (dbType === 'postgresql') {
      const result = await Booking.findAndCountAll({
        order: [['createdAt', 'DESC']],
        limit,
        offset: (page - 1) * limit
      });
      bookings = result.rows; total = result.count;
    } else {
      bookings = await Booking.find().sort('-createdAt')
        .populate('userId', 'name email').populate('packageId', 'name destination')
        .skip((page - 1) * limit).limit(limit);
      total = await Booking.countDocuments();
    }

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/bookings/:id/status
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) return next(new AppError('Invalid status', 400));

    let booking;
    if (dbType === 'postgresql') {
      booking = await Booking.findByPk(req.params.id);
      if (!booking) return next(new AppError('Booking not found', 404));
      await booking.update({ bookingStatus: status });
      await booking.reload();
    } else {
      booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
      if (!booking) return next(new AppError('Booking not found', 404));
    }

    res.status(200).json({ success: true, message: 'Booking status updated', data: booking });
  } catch (error) {
    next(error);
  }
};
