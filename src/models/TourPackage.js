const mongoose = require('mongoose');

const tourPackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Package name is required'],
    trim: true,
    minlength: [5, 'Package name must be at least 5 characters'],
    maxlength: [100, 'Package name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Package description is required'],
    minlength: [20, 'Description must be at least 20 characters'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  destination: {
    type: String,
    required: [true, 'Destination is required'],
    trim: true
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 day']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  discountedPrice: {
    type: Number,
    min: [0, 'Discounted price cannot be negative'],
    validate: {
      validator: function(value) {
        return !value || value < this.price;
      },
      message: 'Discounted price must be less than original price'
    }
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  },
  images: {
    type: [String],
    validate: {
      validator: function(v) {
        return v && v.length > 0 && v.length <= 10;
      },
      message: 'Must have at least 1 and at most 10 images'
    }
  },
  inclusions: {
    type: [String],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'Must have at least 1 inclusion'
    }
  },
  exclusions: {
    type: [String],
    default: []
  },
  itinerary: [{
    day: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    activities: [String],
    meals: [String]
  }],
  availableSeats: {
    type: Number,
    required: [true, 'Available seats is required'],
    min: [0, 'Available seats cannot be negative']
  },
  availableDates: {
    type: [Date],
    default: []
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date,
    validate: {
      validator: function(value) {
        return !this.startDate || !value || value >= this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  category: {
    type: String,
    enum: ['adventure', 'relaxation', 'cultural', 'family', 'romantic', 'other'],
    default: 'other'
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  },
  totalReviews: {
    type: Number,
    default: 0,
    min: [0, 'Total reviews cannot be negative']
  },
  policies: {
    cancellation: {
      type: String,
      default: 'Free cancellation up to 7 days before travel'
    },
    refund: {
      type: String,
      default: '100% refund if cancelled 7+ days before, 50% if 3-7 days'
    },
    payment: {
      type: String,
      default: '20% advance, balance 7 days before travel'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
tourPackageSchema.index({ destination: 1 });
tourPackageSchema.index({ category: 1 });
tourPackageSchema.index({ isActive: 1 });
tourPackageSchema.index({ price: 1 });
tourPackageSchema.index({ rating: -1 });
tourPackageSchema.index({ createdAt: -1 });

// Calculate discount percentage before saving
tourPackageSchema.pre('save', function(next) {
  if (this.price && this.discountedPrice) {
    this.discount = Math.round(((this.price - this.discountedPrice) / this.price) * 100);
  }
  next();
});

// Virtual for calculating final price
tourPackageSchema.virtual('finalPrice').get(function() {
  return this.discountedPrice || this.price;
});

// Ensure virtuals are included in JSON
tourPackageSchema.set('toJSON', { virtuals: true });
tourPackageSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('TourPackage', tourPackageSchema);
