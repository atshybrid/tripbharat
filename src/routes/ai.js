const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const aiController = require('../controllers/aiController');

// POST /api/ai/suggest-packages  — budget+time based AI package suggestions (auth optional)
router.post('/suggest-packages', aiController.suggestPackages);

// POST /api/ai/plan-trip  — generate custom itinerary
router.post('/plan-trip', aiController.planTrip);

// POST /api/ai/chat  — travel assistant chatbot
router.post('/chat', aiController.chat);

module.exports = router;
