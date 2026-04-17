const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referralController');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Referrals
 *   description: Referral system — share code, earn wallet rewards
 */

/**
 * @swagger
 * /referrals:
 *   get:
 *     summary: Get own referral code and list of referred users
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Referral info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     referralCode: { type: string, example: "RAVI123" }
 *                     referredUsers: { type: array, items: { type: object } }
 *                     totalEarned: { type: number, example: 1500 }
 */

/**
 * @swagger
 * /referrals/stats:
 *   get:
 *     summary: Get referral statistics (count, earnings)
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Referral stats
 */

/**
 * @swagger
 * /referrals/apply:
 *   post:
 *     summary: Apply a referral code (during or after signup)
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [referralCode]
 *             properties:
 *               referralCode: { type: string, example: "FRIEND123" }
 *     responses:
 *       200:
 *         description: Referral code applied, reward credited
 *       400:
 *         description: Invalid or already used referral code
 */

router.get('/', protect, referralController.getReferralInfo);
router.get('/stats', protect, referralController.getReferralStats);
router.post('/apply', protect, referralController.applyReferralCode);

module.exports = router;
