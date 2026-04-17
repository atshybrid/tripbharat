const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referralController');
const { protect } = require('../middleware/auth');

router.get('/', protect, referralController.getReferralInfo);
router.get('/stats', protect, referralController.getReferralStats);
router.post('/apply', protect, referralController.applyReferralCode);

module.exports = router;
