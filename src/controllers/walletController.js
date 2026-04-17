const { User, WalletTransaction } = require('../models');
const AppError = require('../utils/appError');
const razorpay = require('../config/razorpay');
const crypto = require('crypto');

const dbType = process.env.DB_TYPE || 'mongodb';

async function getUser(id) {
  if (dbType === 'postgresql') return User.findByPk(id);
  return User.findById(id);
}

// GET /api/wallet
exports.getWalletBalance = async (req, res, next) => {
  try {
    const user = await getUser(req.user.id);
    if (!user) return next(new AppError('User not found', 404));

    const balance = parseFloat(user.walletBalance || user.wallet?.balance || 0);

    let transactions = [];
    if (dbType === 'postgresql') {
      transactions = await WalletTransaction.findAll({
        where: { userId: req.user.id },
        order: [['createdAt', 'DESC']],
        limit: 10
      });
    } else {
      transactions = await WalletTransaction.find({ userId: req.user.id })
        .sort('-createdAt').limit(10);
    }

    res.status(200).json({
      success: true,
      data: {
        balance,
        currency: 'INR',
        transactions,
        userId: req.user.id,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/wallet/transactions
exports.getWalletTransactions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    let transactions, total;
    if (dbType === 'postgresql') {
      const result = await WalletTransaction.findAndCountAll({
        where: { userId: req.user.id },
        order: [['createdAt', 'DESC']],
        limit,
        offset
      });
      transactions = result.rows;
      total = result.count;
    } else {
      transactions = await WalletTransaction.find({ userId: req.user.id })
        .sort('-createdAt').skip(offset).limit(limit);
      total = await WalletTransaction.countDocuments({ userId: req.user.id });
    }

    res.status(200).json({
      success: true,
      data: transactions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/wallet/add-money  — creates Razorpay order
exports.addMoney = async (req, res, next) => {
  try {
    const { amount } = req.body;
    if (!amount || amount < 100) return next(new AppError('Minimum amount is ₹100', 400));
    if (amount > 50000) return next(new AppError('Maximum amount is ₹50,000 per transaction', 400));

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `wallet_${req.user.id}_${Date.now()}`,
      notes: { userId: req.user.id, purpose: 'wallet_topup' }
    });

    res.status(200).json({
      success: true,
      data: {
        orderId: order.id,
        amount,
        currency: 'INR',
        receipt: order.receipt
      }
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/wallet/verify-payment  — verify Razorpay & credit wallet
exports.verifyPayment = async (req, res, next) => {
  try {
    const { orderId, paymentId, signature, amount } = req.body;

    const expectedSig = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (expectedSig !== signature) return next(new AppError('Invalid payment signature', 400));

    const user = await getUser(req.user.id);
    if (!user) return next(new AppError('User not found', 404));

    const creditAmount = parseFloat(amount);
    const prevBalance = parseFloat(user.walletBalance || user.wallet?.balance || 0);
    const newBalance = parseFloat((prevBalance + creditAmount).toFixed(2));

    if (dbType === 'postgresql') {
      await user.update({ walletBalance: newBalance });
      await WalletTransaction.create({
        userId: req.user.id,
        type: 'credit',
        amount: creditAmount,
        balanceAfter: newBalance,
        description: 'Wallet recharge via Razorpay',
        source: 'razorpay',
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        status: 'completed'
      });
    } else {
      await User.findByIdAndUpdate(req.user.id, { 'wallet.balance': newBalance });
      await WalletTransaction.create({
        userId: req.user.id,
        type: 'credit',
        amount: creditAmount,
        description: 'Wallet recharge via Razorpay',
        reference: paymentId,
        status: 'completed'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Wallet topped up successfully',
      data: { balance: newBalance, credited: creditAmount }
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/wallet/withdraw
exports.withdrawMoney = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const user = await getUser(req.user.id);
    if (!user) return next(new AppError('User not found', 404));

    const balance = parseFloat(user.walletBalance || user.wallet?.balance || 0);
    if (amount > balance) return next(new AppError('Insufficient wallet balance', 400));
    if (amount < 100) return next(new AppError('Minimum withdrawal is ₹100', 400));

    const newBalance = parseFloat((balance - amount).toFixed(2));

    if (dbType === 'postgresql') {
      await user.update({ walletBalance: newBalance });
      await WalletTransaction.create({
        userId: req.user.id,
        type: 'debit',
        amount,
        balanceAfter: newBalance,
        description: 'Withdrawal to bank account',
        source: 'admin',
        status: 'completed'
      });
    } else {
      await User.findByIdAndUpdate(req.user.id, { 'wallet.balance': newBalance });
      await WalletTransaction.create({
        userId: req.user.id,
        type: 'debit',
        amount,
        description: 'Withdrawal to bank account',
        status: 'completed'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      data: { balance: newBalance, withdrawn: amount }
    });
  } catch (error) {
    next(error);
  }
};
