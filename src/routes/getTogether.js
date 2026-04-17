const express = require('express');
const router = express.Router();
const getTogetherController = require('../controllers/getTogetherController');
const { protect } = require('../middleware/auth');
const { createGetTogetherValidation, validateMongoId, validate } = require('../middleware/validation');

router.get('/', protect, getTogetherController.getAllTrips);
router.get('/:id', protect, validateMongoId, validate, getTogetherController.getTripById);
router.post('/', protect, createGetTogetherValidation, validate, getTogetherController.createTrip);
router.put('/:id', protect, validateMongoId, validate, getTogetherController.updateTrip);
router.post('/:id/participants', protect, validateMongoId, validate, getTogetherController.addParticipant);
router.post('/join', protect, getTogetherController.joinTrip);
router.post('/:id/vote', protect, validateMongoId, validate, getTogetherController.voteForPackage);
router.post('/:id/confirm', protect, validateMongoId, validate, getTogetherController.confirmTrip);

module.exports = router;
