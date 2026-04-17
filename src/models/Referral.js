const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  referrerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Referrer ID is required']
  },
  referredUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  referralCode: {
    type: String,
    required: true,
    uppercase: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'expired'],
    default: 'pending'
  },
  rewardAmount: {
    type: Number,
    default: 0,
    min: [0, 'Reward amount cannot be negative']
  },
  rewardCredited: {
    type: Boolean,
    default: false
  },
  completedAt: Date
}, {
  timestamps: true
});

// Indexes
referralSchema.index({ referrerId: 1 });
referralSchema.index({ referredUserId: 1 });
referralSchema.index({ referralCode: 1 });
referralSchema.index({ status: 1 });
referralSchema.index({ createdAt: -1 });

// Set reward amount from env before saving
referralSchema.pre('save', function(next) {
  if (!this.rewardAmount) {
    this.rewardAmount = parseFloat(process.env.REFERRAL_REWARD_AMOUNT) || 500;
  }
  next();
});

module.exports = mongoose.model('Referral', referralSchema);
