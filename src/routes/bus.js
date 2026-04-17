const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const busController = require('../controllers/busController');

// GET /api/bus/search?from=&to=&date=&passengers=
router.get('/search', busController.searchBuses);

// GET /api/bus/routes/:id
router.get('/routes/:id', busController.getBusRoute);

// POST /api/bus/book  (requires auth)
router.post('/book', protect, busController.bookBus);

module.exports = router;
