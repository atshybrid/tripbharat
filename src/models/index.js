/**
 * Model Factory
 * Returns the appropriate model based on DB_TYPE environment variable
 * This module exports models lazily to avoid circular dependency issues
 */

const dbType = process.env.DB_TYPE || 'mongodb';

if (dbType === 'postgresql') {
  // For PostgreSQL, export a getter function
  // Models will be initialized after database connection
  module.exports = {
    get User() {
      const { getModels } = require('./postgres');
      return getModels().User;
    },
    get TourPackage() {
      const { getModels } = require('./postgres');
      return getModels().TourPackage;
    },
    get Booking() {
      const { getModels } = require('./postgres');
      return getModels().Booking;
    },
    get WalletTransaction() {
      const { getModels } = require('./postgres');
      return getModels().WalletTransaction;
    },
    get GetTogether() {
      const { getModels } = require('./postgres');
      return getModels().GetTogether;
    },
    get Referral() {
      const { getModels } = require('./postgres');
      return getModels().Referral;
    },
    get Review() {
      const { getModels } = require('./postgres');
      return getModels().Review;
    },
    get PushSubscription() {
      const { getModels } = require('./postgres');
      return getModels().PushSubscription;
    }
  };
} else {
  // For MongoDB, export models directly
  module.exports = {
    User: require('./User'),
    TourPackage: require('./TourPackage'),
    Booking: require('./Booking'),
    WalletTransaction: require('./WalletTransaction'),
    GetTogether: require('./GetTogether'),
    Referral: require('./Referral'),
    Review: require('./Review')
  };
}
