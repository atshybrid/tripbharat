const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../utils/logger');

let genAI = null;

const getGemini = () => {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      logger.warn('GEMINI_API_KEY not set');
      return null;
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};

const getModel = (modelName) => {
  const ai = getGemini();
  if (!ai) return null;
  return ai.getGenerativeModel({ model: modelName || process.env.GEMINI_MODEL || 'gemini-1.5-flash' });
};

module.exports = { getGemini, getModel };
