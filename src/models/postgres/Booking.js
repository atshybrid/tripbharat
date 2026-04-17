const { DataTypes } = require('sequelize');
const crypto = require('crypto');

module.exports = (sequelize) => {
  const Booking = sequelize.define('Booking', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    bookingNumber: {
      type: DataTypes.STRING(20),
      unique: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    packageId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'tour_packages',
        key: 'id'
      }
    },
    packageName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    packagePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    numberOfTravelers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    travelers: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    gstAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    finalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    paymentMethod: {
      type: DataTypes.ENUM('wallet', 'razorpay', 'partial'),
      allowNull: false
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
      defaultValue: 'pending'
    },
    bookingStatus: {
      type: DataTypes.ENUM('confirmed', 'pending', 'cancelled', 'completed'),
      defaultValue: 'pending'
    },
    razorpayOrderId: {
      type: DataTypes.STRING
    },
    razorpayPaymentId: {
      type: DataTypes.STRING
    },
    walletAmountUsed: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    refundAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    cancellationReason: {
      type: DataTypes.TEXT
    },
    cancelledAt: {
      type: DataTypes.DATE
    },
    specialRequests: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'bookings',
    timestamps: true,
    hooks: {
      beforeCreate: async (booking) => {
        // Generate unique booking number
        if (!booking.bookingNumber) {
          const year = new Date().getFullYear();
          const random = crypto.randomBytes(4).toString('hex').toUpperCase();
          booking.bookingNumber = `TRV${year}${random}`;
        }

        // Calculate GST (12%)
        const gstRate = parseFloat(process.env.GST_RATE) || 0.12;
        booking.gstAmount = (booking.totalAmount * gstRate).toFixed(2);
        booking.finalAmount = (parseFloat(booking.totalAmount) + parseFloat(booking.gstAmount)).toFixed(2);
      }
    },
    indexes: [
      { fields: ['userId'] },
      { fields: ['packageId'] },
      { fields: ['bookingNumber'], unique: true },
      { fields: ['bookingStatus'] },
      { fields: ['paymentStatus'] },
      { fields: ['startDate'] }
    ]
  });

  return Booking;
};
