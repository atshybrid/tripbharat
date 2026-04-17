const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingNumber: {
    type: String,
    unique: true,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TourPackage',
    required: [true, 'Package ID is required']
  },
  packageName: {
    type: String,
    required: true
  },
  packageImage: String,
  destination: String,
  travelDate: {
    type: Date,
    required: [true, 'Travel date is required'],
    validate: {
      validator: function(value) {
        return value >= new Date();
      },
      message: 'Travel date must be in the future'
    }
  },
  numberOfTravelers: {
    type: Number,
    required: [true, 'Number of travelers is required'],
    min: [1, 'Must have at least 1 traveler']
  },
  travelers: [{
    name: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      required: true,
      min: [1, 'Age must be at least 1'],
      max: [120, 'Age cannot exceed 120']
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true
    },
    email: {
      type: String,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
    },
    phone: String,
    idProof: String
  }],
  contactDetails: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
    },
    phone: {
      type: String,
      required: true
    },
    address: String
  },
  pricing: {
    basePrice: {
      type: Number,
      required: true,
      min: [0, 'Base price cannot be negative']
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative']
    },
    taxes: {
      type: Number,
      required: true,
      min: [0, 'Taxes cannot be negative']
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total amount cannot be negative']
    }
  },
  paymentDetails: {
    method: {
      type: String,
      enum: ['wallet', 'razorpay', 'card', 'upi'],
      required: true
    },
    transactionId: String,
    paidAmount: {
      type: Number,
      min: [0, 'Paid amount cannot be negative']
    },
    paidAt: Date
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  cancellationReason: String,
  cancelledAt: Date
}, {
  timestamps: true
});

// Indexes
bookingSchema.index({ bookingNumber: 1 });
bookingSchema.index({ userId: 1 });
bookingSchema.index({ packageId: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ paymentStatus: 1 });
bookingSchema.index({ travelDate: 1 });
bookingSchema.index({ createdAt: -1 });

// Generate booking number before saving
bookingSchema.pre('save', async function(next) {
  if (!this.bookingNumber) {
    const year = new Date().getFullYear();
    const random = Math.floor(10000000 + Math.random() * 90000000);
    this.bookingNumber = `TRV${year}${random}`;
    
    // Ensure uniqueness
    const existing = await this.constructor.findOne({ bookingNumber: this.bookingNumber });
    if (existing) {
      return next(new Error('Booking number conflict, please try again'));
    }
  }
  next();
});

// Calculate taxes before saving
bookingSchema.pre('save', function(next) {
  if (this.pricing && this.pricing.basePrice !== undefined) {
    const gstPercentage = parseFloat(process.env.GST_PERCENTAGE) || 12;
    const subtotal = this.pricing.basePrice - (this.pricing.discount || 0);
    this.pricing.taxes = Math.round((subtotal * gstPercentage) / 100);
    this.pricing.totalAmount = subtotal + this.pricing.taxes;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
