const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const { protect } = require('../middleware/auth');
const { addMoneyValidation, paginationValidation, validate } = require('../middleware/validation');
const { walletLimiter } = require('../middleware/rateLimiter');

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
