const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const { protect } = require('../middleware/auth');
const { addMoneyValidation, paginationValidation, validate } = require('../middleware/validation');
const { walletLimiter } = require('../middleware/rateLimiter');

/**
 * @swagger
 * tags:
 *   name: Wallet
 *   description: Wallet balance and transactions
 */

/**
 * @swagger
 * /wallet:
 *   get:
 *     summary: Get wallet balance of logged-in user
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet balance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     balance: { type: number, example: 2500.00 }
 */

/**
 * @swagger
 * /wallet/transactions:
 *   get:
 *     summary: Get wallet transaction history
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: List of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/WalletTransaction' }
 */

/**
 * @swagger
 * /wallet/add-money:
 *   post:
 *     summary: Add money to wallet (creates Razorpay order)
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount]
 *             properties:
 *               amount: { type: number, example: 1000, description: "Amount in INR (min 100)" }
 *     responses:
 *       200:
 *         description: Razorpay order created — use order_id in frontend checkout
 */

/**
 * @swagger
 * /wallet/verify-payment:
 *   post:
 *     summary: Verify Razorpay payment and credit wallet
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [razorpay_order_id, razorpay_payment_id, razorpay_signature]
 *             properties:
 *               razorpay_order_id: { type: string }
 *               razorpay_payment_id: { type: string }
 *               razorpay_signature: { type: string }
 *     responses:
 *       200:
 *         description: Payment verified, wallet credited
 */

/**
 * @swagger
 * /wallet/withdraw:
 *   post:
 *     summary: Withdraw money from wallet (bank transfer)
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, bankDetails]
 *             properties:
 *               amount: { type: number, example: 500 }
 *               bankDetails:
 *                 type: object
 *                 properties:
 *                   accountNumber: { type: string }
 *                   ifsc: { type: string }
 *                   accountName: { type: string }
 *     responses:
 *       200:
 *         description: Withdrawal request submitted
 */

router.get('/', protect, walletController.getWalletBalance);

router.get(
  '/transactions',
  protect,
  paginationValidation,
  validate,
  walletController.getWalletTransactions
);

router.post(
  '/add-money',
  protect,
  walletLimiter,
  addMoneyValidation,
  validate,
  walletController.addMoney
);

router.post(
  '/verify-payment',
  protect,
  walletController.verifyPayment
);

router.post(
  '/withdraw',
  protect,
  walletController.withdrawMoney
);

module.exports = router;
