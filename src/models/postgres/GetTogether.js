const { DataTypes } = require('sequelize');
const crypto = require('crypto');

module.exports = (sequelize) => {
  const GetTogether = sequelize.define('GetTogether', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    tripName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    creatorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    inviteCode: {
      type: DataTypes.STRING(8),
      unique: true
    },
    maxParticipants: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 2,
        max: 20
      }
    },
    currentParticipants: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    participants: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    proposedPackages: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    packageId: {
      type: DataTypes.UUID,
      references: {
        model: 'tour_packages',
        key: 'id'
      }
    },
    startDate: {
      type: DataTypes.DATE
    },
    endDate: {
      type: DataTypes.DATE
    },
    status: {
      type: DataTypes.ENUM('active', 'voting', 'confirmed', 'cancelled', 'completed'),
      defaultValue: 'active'
    },
    votingDeadline: {
      type: DataTypes.DATE
    },
    confirmedAt: {
      type: DataTypes.DATE
    },
    totalBudget: {
      type: DataTypes.DECIMAL(10, 2)
    },
    description: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'get_together_trips',
    timestamps: true,
    hooks: {
      beforeCreate: async (trip) => {
        // Generate unique invite code
        if (!trip.inviteCode) {
          trip.inviteCode = crypto.randomBytes(4).toString('hex').toUpperCase();
        }
      }
    },
    indexes: [
      { fields: ['creatorId'] },
      { fields: ['inviteCode'], unique: true },
      { fields: ['status'] }
    ]
  });

  return GetTogether;
};
