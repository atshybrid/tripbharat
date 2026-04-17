const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Referral = sequelize.define('Referral', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    referrerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    referredUserId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed'),
      defaultValue: 'pending'
    },
    referrerReward: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    referredUserReward: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    completedAt: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'referrals',
    timestamps: true,
    indexes: [
      { fields: ['referrerId'] },
      { fields: ['referredUserId'] },
      { fields: ['status'] }
    ]
  });

  return Referral;
};
