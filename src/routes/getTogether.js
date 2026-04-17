const express = require('express');
const router = express.Router();
const getTogetherController = require('../controllers/getTogetherController');
const { protect } = require('../middleware/auth');
const { createGetTogetherValidation, validateMongoId, validate } = require('../middleware/validation');

/**
 * @swagger
 * tags:
 *   name: Get-Together
 *   description: Group trip planning — create shared trips, vote on packages, and confirm together
 */

/**
 * @swagger
 * /get-together:
 *   get:
 *     summary: Get all group trips for the logged-in user
 *     tags: [Get-Together]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of group trips
 *   post:
 *     summary: Create a new group trip
 *     tags: [Get-Together]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, startDate]
 *             properties:
 *               title: { type: string, example: "Friends Kerala Trip" }
 *               description: { type: string }
 *               startDate: { type: string, format: date }
 *               endDate: { type: string, format: date }
 *               budget: { type: number }
 *               maxParticipants: { type: integer, example: 10 }
 *     responses:
 *       201:
 *         description: Group trip created
 */

/**
 * @swagger
 * /get-together/{id}:
 *   get:
 *     summary: Get group trip details by ID
 *     tags: [Get-Together]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Group trip details
 *   put:
 *     summary: Update group trip (organizer only)
 *     tags: [Get-Together]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               startDate: { type: string, format: date }
 *               budget: { type: number }
 *     responses:
 *       200:
 *         description: Trip updated
 */

/**
 * @swagger
 * /get-together/{id}/participants:
 *   post:
 *     summary: Add a participant to a group trip (by phone/email)
 *     tags: [Get-Together]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string, format: email }
 *               phone: { type: string }
 *     responses:
 *       200:
 *         description: Participant added
 */

/**
 * @swagger
 * /get-together/join:
 *   post:
 *     summary: Join a group trip using invite code
 *     tags: [Get-Together]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [inviteCode]
 *             properties:
 *               inviteCode: { type: string, example: "TRIP-ABCD1234" }
 *     responses:
 *       200:
 *         description: Joined the trip successfully
 */

/**
 * @swagger
 * /get-together/{id}/vote:
 *   post:
 *     summary: Vote for a suggested tour package in the group
 *     tags: [Get-Together]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [packageId]
 *             properties:
 *               packageId: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Vote recorded
 */

/**
 * @swagger
 * /get-together/{id}/confirm:
 *   post:
 *     summary: Confirm the group trip and create booking for all participants
 *     tags: [Get-Together]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Trip confirmed, bookings created
 */

router.get('/', protect, getTogetherController.getAllTrips);
router.get('/:id', protect, validateMongoId, validate, getTogetherController.getTripById);
router.post('/', protect, createGetTogetherValidation, validate, getTogetherController.createTrip);
router.put('/:id', protect, validateMongoId, validate, getTogetherController.updateTrip);
router.post('/:id/participants', protect, validateMongoId, validate, getTogetherController.addParticipant);
router.post('/join', protect, getTogetherController.joinTrip);
router.post('/:id/vote', protect, validateMongoId, validate, getTogetherController.voteForPackage);
router.post('/:id/confirm', protect, validateMongoId, validate, getTogetherController.confirmTrip);

module.exports = router;
