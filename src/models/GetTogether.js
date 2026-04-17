const mongoose = require('mongoose');

const getTogetherSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  createdBy: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: String,
    email: String
  },
  participants: [{
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    email: String,
    status: {
      type: String,
      enum: ['invited', 'accepted', 'declined'],
      default: 'invited'
    },
    preferences: [String],
    budget: {
      type: Number,
      min: [0, 'Budget cannot be negative']
    },
    joinedAt: Date
  }],
  totalBudget: {
    type: Number,
    min: [0, 'Total budget cannot be negative']
  },
  budgetPerPerson: {
    type: Number,
    min: [0, 'Budget per person cannot be negative']
  },
  destination: {
    type: String,
    trim: true
  },
  preferences: {
    tripType: [String],
    activities: [String],
    accommodation: [String],
    foodPreferences: [String]
  },
  travelDates: {
    startDate: Date,
    endDate: Date,
    flexible: {
      type: Boolean,
      default: false
    }
  },
  recommendedPackages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TourPackage'
  }],
  status: {
    type: String,
    enum: ['planning', 'voting', 'confirmed', 'cancelled'],
    default: 'planning'
  },
  inviteLink: {
    type: String,
    unique: true
  },
  inviteCode: {
    type: String,
    unique: true,
    uppercase: true
  },
  votingResults: [{
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TourPackage'
    },
    votes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  }],
  finalBookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }
}, {
  timestamps: true
});

// Indexes
getTogetherSchema.index({ inviteCode: 1 });
getTogetherSchema.index({ 'createdBy.id': 1 });
getTogetherSchema.index({ status: 1 });
getTogetherSchema.index({ createdAt: -1 });

// Generate invite code before saving
getTogetherSchema.pre('save', async function(next) {
  if (!this.inviteCode) {
    let code;
    let isUnique = false;
    
    while (!isUnique) {
      code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const existing = await this.constructor.findOne({ inviteCode: code });
      if (!existing) {
        isUnique = true;
      }
    }
    
    this.inviteCode = code;
  }
  
  // Generate invite link
  if (!this.inviteLink && this.inviteCode) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    this.inviteLink = `${frontendUrl}/get-together/join/${this.inviteCode}`;
  }
  
  next();
});

module.exports = mongoose.model('GetTogether', getTogetherSchema);
