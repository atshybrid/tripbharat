const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Review = sequelize.define('Review', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
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
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    title: {
      type: DataTypes.STRING
    },
    comment: {
      type: DataTypes.TEXT
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      defaultValue: []
    },
    isVerifiedBooking: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'reviews',
    timestamps: true,
    hooks: {
      afterCreate: async (review) => {
        // Update package rating
        await updatePackageRating(review.packageId, sequelize);
      },
      afterUpdate: async (review) => {
        // Update package rating
        await updatePackageRating(review.packageId, sequelize);
      },
      afterDestroy: async (review) => {
        // Update package rating
        await updatePackageRating(review.packageId, sequelize);
      }
    },
    indexes: [
      { fields: ['userId'] },
      { fields: ['packageId'] },
      { fields: ['rating'] }
    ]
  });

  return Review;
};

async function updatePackageRating(packageId, sequelize) {
  const reviews = await sequelize.models.Review.findAll({
    where: { packageId },
    attributes: [
      [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'totalReviews']
    ]
  });

  if (reviews && reviews[0]) {
    const avgRating = parseFloat(reviews[0].get('avgRating')) || 0;
    const totalReviews = parseInt(reviews[0].get('totalReviews')) || 0;

    await sequelize.models.TourPackage.update(
      {
        averageRating: avgRating.toFixed(1),
        totalReviews: totalReviews
      },
      { where: { id: packageId } }
    );
  }
}
