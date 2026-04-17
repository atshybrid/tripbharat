const { PushSubscription } = require('../models');
const { sendPushToAll, getVapidPublicKey } = require('../utils/pushNotification');
const AppError = require('../utils/appError');
const logger = require('../utils/logger');

// @desc    Get VAPID public key (needed by frontend to subscribe)
// @route   GET /api/push/vapid-public-key
// @access  Public
exports.getVapidKey = (req, res) => {
  const key = getVapidPublicKey();
  if (!key) {
    return res.status(503).json({ success: false, message: 'Push notifications not configured' });
  }
  res.status(200).json({ success: true, data: { publicKey: key } });
};

// @desc    Subscribe to push notifications
// @route   POST /api/push/subscribe
// @access  Public (optionally authenticated)
exports.subscribe = async (req, res, next) => {
  try {
    const { endpoint, keys } = req.body;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return next(new AppError('Invalid push subscription object', 400));
    }

    const userId = req.user?.id || req.user?._id || null;

    // Upsert — update userId if same endpoint re-subscribes after login
    const [sub, created] = await PushSubscription.findOrCreate({
      where: { endpoint },
      defaults: {
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        userId,
        userAgent: req.headers['user-agent']?.substring(0, 255) || null
      }
    });

    if (!created && userId && !sub.userId) {
      await sub.update({ userId, p256dh: keys.p256dh, auth: keys.auth });
    }

    res.status(200).json({ success: true, message: 'Subscribed to push notifications' });
  } catch (error) {
    next(error);
  }
};

// @desc    Unsubscribe from push notifications
// @route   POST /api/push/unsubscribe
// @access  Public
exports.unsubscribe = async (req, res, next) => {
  try {
    const { endpoint } = req.body;

    if (!endpoint) {
      return next(new AppError('Endpoint is required', 400));
    }

    await PushSubscription.destroy({ where: { endpoint } });

    res.status(200).json({ success: true, message: 'Unsubscribed from push notifications' });
  } catch (error) {
    next(error);
  }
};

// @desc    Send a test push notification (admin only)
// @route   POST /api/push/send-test
// @access  Admin
exports.sendTest = async (req, res, next) => {
  try {
    const { title = 'TripBharat', body = 'Push notifications are working! 🎉', url = '/' } = req.body;

    await sendPushToAll(
      { title, body, icon: '/icons/icon-192x192.png', badge: '/icons/badge-72x72.png', url },
      PushSubscription
    );

    res.status(200).json({ success: true, message: 'Test notification sent to all subscribers' });
  } catch (error) {
    next(error);
  }
};
