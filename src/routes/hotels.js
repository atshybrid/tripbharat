const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const hotelController = require('../controllers/hotelController');

// GET /api/hotels/search?city=&checkIn=&checkOut=&guests=&rooms=
router.get('/search', hotelController.searchHotels);

// GET /api/hotels/:id
router.get('/:id', hotelController.getHotelById);

// POST /api/hotels/book  (requires auth)
router.post('/book', protect, hotelController.bookHotel);

module.exports = router;
