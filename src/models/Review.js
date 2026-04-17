const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
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
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  comment: {
    type: String,
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  images: {
    type: [String],
    validate: {
      validator: function(v) {
        return !v || v.length <= 5;
      },
      message: 'Cannot upload more than 5 images'
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  helpfulCount: {
    type: Number,
    default: 0,
    min: [0, 'Helpful count cannot be negative']
  }
}, {
  timestamps: true
});

// Indexes
reviewSchema.index({ userId: 1 });
reviewSchema.index({ packageId: 1 });
reviewSchema.index({ bookingId: 1 });
reviewSchema.index({ rating: -1 });
reviewSchema.index({ createdAt: -1 });

// Compound index to prevent duplicate reviews
reviewSchema.index({ userId: 1, packageId: 1 }, { unique: true });

// Update package rating after save
reviewSchema.post('save', async function() {
  try {
    const TourPackage = mongoose.model('TourPackage');
    const reviews = await this.constructor.find({ packageId: this.packageId });
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = totalRating / reviews.length;
    
    await TourPackage.findByIdAndUpdate(this.packageId, {
      rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
      totalReviews: reviews.length
    });
  } catch (error) {
    console.error('Error updating package rating:', error);
  }
});

// Update package rating after delete
reviewSchema.post('remove', async function() {
  try {
    const TourPackage = mongoose.model('TourPackage');
    const reviews = await this.constructor.find({ packageId: this.packageId });
    
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const avgRating = totalRating / reviews.length;
      
      await TourPackage.findByIdAndUpdate(this.packageId, {
        rating: Math.round(avgRating * 10) / 10,
        totalReviews: reviews.length
      });
    } else {
      await TourPackage.findByIdAndUpdate(this.packageId, {
        rating: 0,
        totalReviews: 0
      });
    }
  } catch (error) {
    console.error('Error updating package rating:', error);
  }
});

module.exports = mongoose.model('Review', reviewSchema);
