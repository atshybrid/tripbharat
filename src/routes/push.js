const express = require('express');
const router = express.Router();
const pushController = require('../controllers/pushController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');

/**
 * @swagger
 * tags:
 *   name: Push Notifications
 *   description: Web push notification subscription management
 */

/**
 * @swagger
 * /push/vapid-public-key:
 *   get:
 *     summary: Get VAPID public key for browser push subscription
 *     tags: [Push Notifications]
 *     security: []
 *     responses:
 *       200:
 *         description: VAPID public key
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     publicKey: { type: string }
 */

/**
 * @swagger
 * /push/subscribe:
 *   post:
 *     summary: Subscribe browser to push notifications
 *     tags: [Push Notifications]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [subscription]
 *             properties:
 *               subscription:
 *                 type: object
 *                 description: PushSubscription object from browser's pushManager.subscribe()
 *                 properties:
 *                   endpoint: { type: string, format: uri }
 *                   keys:
 *                     type: object
 *                     properties:
 *                       p256dh: { type: string }
 *                       auth: { type: string }
 *               userId: { type: string, format: uuid, description: "Optional — links subscription to user" }
 *     responses:
 *       201:
 *         description: Subscription saved
 */

/**
 * @swagger
 * /push/unsubscribe:
 *   post:
 *     summary: Unsubscribe browser from push notifications
 *     tags: [Push Notifications]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [endpoint]
 *             properties:
 *               endpoint: { type: string, format: uri }
 *     responses:
 *       200:
 *         description: Unsubscribed successfully
 */

/**
 * @swagger
 * /push/send-test:
 *   post:
 *     summary: Send a test push notification to all subscribers (Admin only)
 *     tags: [Push Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string, example: "TripBharat Alert" }
 *               body: { type: string, example: "New packages available!" }
 *               url: { type: string, example: "/packages" }
 *     responses:
 *       200:
 *         description: Test notification sent
 */

// Public
router.get('/vapid-public-key', pushController.getVapidKey);
router.post('/subscribe', pushController.subscribe);
router.post('/unsubscribe', pushController.unsubscribe);

// Admin only — send broadcast test
router.post('/send-test', protect, isAdmin, pushController.sendTest);

module.exports = router;
