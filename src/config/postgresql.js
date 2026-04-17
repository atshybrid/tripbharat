const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

let sequelize;

const connectPostgreSQL = async () => {
  try {
    // Initialize Sequelize with PostgreSQL connection
    sequelize = new Sequelize(process.env.POSTGRES_URI, {
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? (msg) => logger.info(msg) : false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    });

    // Test connection
    await sequelize.authenticate();
    logger.info(`PostgreSQL Connected: ${sequelize.config.database}`);

    // Note: Tables will be synced after models are initialized
    // See syncTables() function below

    return sequelize;
  } catch (error) {
    logger.error(`PostgreSQL Connection Error: ${error.message}`);
    throw error;
  }
};

const getSequelize = () => {
  if (!sequelize) {
    throw new Error('PostgreSQL not connected. Call connectPostgreSQL first.');
  }
  return sequelize;
};

const disconnectPostgreSQL = async () => {
  if (sequelize) {
    await sequelize.close();
    logger.info('PostgreSQL connection closed');
  }
};

const syncTables = async () => {
  if (!sequelize) {
    throw new Error('PostgreSQL not connected. Call connectPostgreSQL first.');
  }
  
  // Sync models (create tables if they don't exist)
  if (process.env.NODE_ENV === 'development') {
    await sequelize.sync({ alter: true });
    logger.info('PostgreSQL tables synced');
  }
};

module.exports = {
  connectPostgreSQL,
  getSequelize,
  disconnectPostgreSQL,
  syncTables
};
