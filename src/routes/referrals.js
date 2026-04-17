const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referralController');
const { protect } = require('../middleware/auth');

router.get('/', protect, referralController.getReferralInfo);
router.post('/apply', protect, referralController.applyReferralCode);

module.exports = router;
