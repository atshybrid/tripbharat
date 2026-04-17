const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TourPackage = sequelize.define('TourPackage', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Duration in days'
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    discountPrice: {
      type: DataTypes.DECIMAL(10, 2)
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      defaultValue: []
    },
    maxGroupSize: {
      type: DataTypes.INTEGER,
      defaultValue: 10
    },
    difficulty: {
      type: DataTypes.ENUM('easy', 'moderate', 'difficult'),
      defaultValue: 'moderate'
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    inclusions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    exclusions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    itinerary: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    startDates: {
      type: DataTypes.ARRAY(DataTypes.DATE),
      defaultValue: []
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    averageRating: {
      type: DataTypes.DECIMAL(2, 1),
      defaultValue: 0.0
    },
    totalReviews: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    totalBookings: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'tour_packages',
    timestamps: true,
    indexes: [
      { fields: ['destination'] },
      { fields: ['category'] },
      { fields: ['isActive'] },
      { fields: ['averageRating'] }
    ]
  });

  // Virtual field for discount percentage
  TourPackage.prototype.getDiscountPercentage = function() {
    if (this.discountPrice && this.price > this.discountPrice) {
      return Math.round(((this.price - this.discountPrice) / this.price) * 100);
    }
    return 0;
  };

  // Virtual field for final price
  TourPackage.prototype.getFinalPrice = function() {
    return this.discountPrice || this.price;
  };

  return TourPackage;
};
