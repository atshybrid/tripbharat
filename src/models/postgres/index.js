const { getSequelize } = require('../../config/postgresql');

let models = {};

const initModels = () => {
  const sequelize = getSequelize();

  // Import models
  models.User = require('./User')(sequelize);
  models.TourPackage = require('./TourPackage')(sequelize);
  models.Booking = require('./Booking')(sequelize);
  models.WalletTransaction = require('./WalletTransaction')(sequelize);
  models.GetTogether = require('./GetTogether')(sequelize);
  models.Referral = require('./Referral')(sequelize);
  models.Review = require('./Review')(sequelize);
  models.PushSubscription = require('./PushSubscription')(sequelize);

  // Define associations
  
  // User associations
  models.User.hasMany(models.Booking, { foreignKey: 'userId', as: 'bookings' });
  models.User.hasMany(models.WalletTransaction, { foreignKey: 'userId', as: 'transactions' });
  models.User.hasMany(models.GetTogether, { foreignKey: 'creatorId', as: 'createdTrips' });
  models.User.hasMany(models.Review, { foreignKey: 'userId', as: 'reviews' });
  models.User.hasMany(models.PushSubscription, { foreignKey: 'userId', as: 'pushSubscriptions' });
  
  // TourPackage associations
  models.TourPackage.hasMany(models.Booking, { foreignKey: 'packageId', as: 'bookings' });
  models.TourPackage.hasMany(models.Review, { foreignKey: 'packageId', as: 'reviews' });
  
  // Booking associations
  models.Booking.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  models.Booking.belongsTo(models.TourPackage, { foreignKey: 'packageId', as: 'package' });
  
  // WalletTransaction associations
  models.WalletTransaction.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  
  // GetTogether associations
  models.GetTogether.belongsTo(models.User, { foreignKey: 'creatorId', as: 'creator' });
  models.GetTogether.belongsTo(models.TourPackage, { foreignKey: 'packageId', as: 'package' });
  
  // Review associations
  models.Review.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  models.Review.belongsTo(models.TourPackage, { foreignKey: 'packageId', as: 'package' });
  
  // Referral associations
  models.Referral.belongsTo(models.User, { foreignKey: 'referrerId', as: 'referrer' });
  models.Referral.belongsTo(models.User, { foreignKey: 'referredUserId', as: 'referredUser' });

  return models;
};

const getModels = () => {
  if (Object.keys(models).length === 0) {
    return initModels();
  }
  return models;
};

module.exports = { initModels, getModels };
