const { OpenAI } = require('openai');
const logger = require('../utils/logger');

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Test connection
const testConnection = async () => {
  try {
    if (process.env.OPENAI_API_KEY) {
      logger.info('OpenAI API configured successfully');
    } else {
      logger.warn('OpenAI API key not found in environment variables');
    }
  } catch (error) {
    logger.error(`OpenAI configuration error: ${error.message}`);
  }
};

testConnection();

module.exports = openai;
