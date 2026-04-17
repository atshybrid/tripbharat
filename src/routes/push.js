const express = require('express');
const router = express.Router();
const pushController = require('../controllers/pushController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');

// Public
router.get('/vapid-public-key', pushController.getVapidKey);
router.post('/subscribe', pushController.subscribe);
router.post('/unsubscribe', pushController.unsubscribe);

// Admin only — send broadcast test
router.post('/send-test', protect, isAdmin, pushController.sendTest);

module.exports = router;
