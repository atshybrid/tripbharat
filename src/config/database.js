const mongoose = require('mongoose');
const logger = require('../utils/logger');
const { connectPostgreSQL, disconnectPostgreSQL } = require('./postgresql');

const connectDatabase = async () => {
  const dbType = process.env.DB_TYPE || 'mongodb';

  try {
    if (dbType === 'postgresql') {
      // Connect to PostgreSQL
      await connectPostgreSQL();
      logger.info('Using PostgreSQL database');
    } else {
      // Connect to MongoDB
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        // useNewUrlParser: true, // No longer needed in Mongoose 6+
        // useUnifiedTopology: true, // No longer needed in Mongoose 6+
      });

      logger.info(`MongoDB Connected: ${conn.connection.host}`);
      
      // Handle connection events
      mongoose.connection.on('error', (err) => {
        logger.error(`MongoDB connection error: ${err}`);
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected');
      });
    }
  } catch (error) {
    logger.error(`Database connection failed: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDatabase = async () => {
  const dbType = process.env.DB_TYPE || 'mongodb';

  try {
    if (dbType === 'postgresql') {
      await disconnectPostgreSQL();
    } else {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed');
    }
  } catch (error) {
    logger.error(`Database disconnect error: ${error.message}`);
  }
};

module.exports = { connectDatabase, disconnectDatabase };
