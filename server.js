require('dotenv').config();
const express = require('express');
const { connectDatabase, disconnectDatabase } = require('./src/config/database');
const { initModels } = require('./src/models/postgres');
const { syncTables } = require('./src/config/postgresql');
const logger = require('./src/utils/logger');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...');
  logger.error(err.name, err.message);
  logger.error(err.stack);
  process.exit(1);
});

// Start server
const startServer = async () => {
  try {
    // Connect to database FIRST
    await connectDatabase();

    // Initialize PostgreSQL models if using PostgreSQL
    if (process.env.DB_TYPE === 'postgresql') {
      initModels();
      logger.info('PostgreSQL models initialized');
      
      // Sync tables AFTER models are initialized
      await syncTables();
    }

    // Load app AFTER database is initialized
    const app = require('./src/app');

    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      logger.info(`Database: ${process.env.DB_TYPE || 'mongodb'}`)
      logger.info(`API URL: http://localhost:${PORT}/api`);
      logger.info(`Health check: http://localhost:${PORT}/health`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      logger.error('UNHANDLED REJECTION! Shutting down...');
      logger.error(err.name, err.message);
      server.close(async () => {
        await disconnectDatabase();
        process.exit(1);
      });
    });

    // Handle SIGTERM
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM RECEIVED. Shutting down gracefully...');
      server.close(async () => {
        await disconnectDatabase();
        logger.info('Process terminated!');
        process.exit(0);
      });
    });

    // Handle SIGINT (Ctrl+C)
    process.on('SIGINT', async () => {
      logger.info('SIGINT RECEIVED. Shutting down gracefully...');
      server.close(async () => {
        await disconnectDatabase();
        logger.info('Process terminated!');
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
