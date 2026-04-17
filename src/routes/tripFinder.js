const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const tf = require('../controllers/tripFinderController');

// Public — browse open trips
router.get('/', tf.listOpenTrips);
router.get('/:id', tf.getTripDetails);

// Auth required
router.post('/', protect, tf.createOpenTrip);
router.put('/:id', protect, tf.updateOpenTrip);
router.delete('/:id', protect, tf.cancelOpenTrip);
router.post('/:id/request', protect, tf.requestToJoin);
router.put('/:id/request/:requestUserId/respond', protect, tf.respondToRequest);

module.exports = router;
