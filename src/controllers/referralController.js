const { Referral, User } = require('../models');
const AppError = require('../utils/appError');

const dbType = process.env.DB_TYPE || 'mongodb';

async function buildStats(userId) {
  let referrals, user;
  if (dbType === 'postgresql') {
    user = await User.findByPk(userId);
    referrals = await Referral.findAll({ where: { referrerId: userId } });
  } else {
    user = await User.findById(userId);
    referrals = await Referral.find({ referrerId: userId });
  }

  const total = referrals.length;
  const successful = referrals.filter(r => (r.status || r.dataValues?.status) === 'completed').length;
  const earnings = referrals.reduce((sum, r) => sum + parseFloat(r.referrerReward || r.dataValues?.referrerReward || 0), 0);
  const pending = referrals
    .filter(r => (r.status || r.dataValues?.status) === 'pending')
    .reduce((sum, r) => sum + parseFloat(r.referrerReward || r.dataValues?.referrerReward || 0), 0);

  const code = user?.referralCode || '';
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  return {
    referralCode: code,
    referralLink: `${baseUrl}/auth/signup?ref=${code}`,
    totalReferrals: total,
    successfulReferrals: successful,
    totalEarnings: earnings,
    pendingEarnings: pending,
    referrals
  };
}

// GET /api/referrals
exports.getReferralInfo = async (req, res, next) => {
  try {
    const stats = await buildStats(req.user.id);
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

// GET /api/referrals/stats
exports.getReferralStats = async (req, res, next) => {
  try {
    const stats = await buildStats(req.user.id);
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

// POST /api/referrals/apply
exports.applyReferralCode = async (req, res, next) => {
  try {
    const { referralCode } = req.body;
    if (!referralCode) return next(new AppError('Referral code is required', 400));

    let referrer;
    if (dbType === 'postgresql') {
      referrer = await User.findOne({ where: { referralCode: referralCode.toUpperCase() } });
    } else {
      referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });
    }

    if (!referrer) return next(new AppError('Invalid referral code', 400));

    const referrerId = referrer.id || referrer._id;
    if (String(referrerId) === String(req.user.id)) {
      return next(new AppError('You cannot use your own referral code', 400));
    }

    // Check if already referred
    let existing;
    if (dbType === 'postgresql') {
      existing = await Referral.findOne({ where: { referrerId, referredUserId: req.user.id } });
    } else {
      existing = await Referral.findOne({ referrerId, referredUserId: req.user.id });
    }
    if (existing) return next(new AppError('Referral already applied', 400));

    await Referral.create({
      referrerId,
      referredUserId: req.user.id,
      status: 'pending',
      referrerReward: 500,
      referredUserReward: 200
    });

    res.status(200).json({
      success: true,
      message: 'Referral code applied successfully',
      data: { discount: 200, referrerName: referrer.name }
    });
  } catch (error) {
    next(error);
  }
};
