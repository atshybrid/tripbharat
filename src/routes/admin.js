const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');
const { validateMongoId, paginationValidation, validate } = require('../middleware/validation');

// All admin routes require authentication and admin role
router.use(protect);
router.use(isAdmin);

router.get('/dashboard', adminController.getDashboardStats);
router.get('/users', paginationValidation, validate, adminController.getAllUsers);
router.get('/bookings', paginationValidation, validate, adminController.getAllBookings);
router.put('/bookings/:id/status', validateMongoId, validate, adminController.updateBookingStatus);

module.exports = router;
