const mongoose = require('mongoose');

const walletTransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: [true, 'Transaction type is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  description: {
    type: String,
    required: true
  },
  reference: {
    type: String,
    // Reference to booking ID, payment ID, etc.
  },
  balanceBefore: {
    type: Number,
    required: true
  },
  balanceAfter: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  paymentMethod: {
    type: String,
    // 'razorpay', 'bank_transfer', etc.
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes
walletTransactionSchema.index({ userId: 1 });
walletTransactionSchema.index({ type: 1 });
walletTransactionSchema.index({ status: 1 });
walletTransactionSchema.index({ createdAt: -1 });
walletTransactionSchema.index({ transactionId: 1 });

// Generate transaction ID before saving
walletTransactionSchema.pre('save', async function(next) {
  if (!this.transactionId) {
    const timestamp = Date.now();
    const random = Math.floor(1000 + Math.random() * 9000);
    this.transactionId = `TXN${timestamp}${random}`;
  }
  next();
});

module.exports = mongoose.model('WalletTransaction', walletTransactionSchema);
