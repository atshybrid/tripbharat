const webpush = require('web-push');
const logger = require('./logger');

let configured = false;

const configure = () => {
  if (configured) return;
  const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, COMPANY_EMAIL } = process.env;
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    logger.warn('Web push VAPID keys not set — push notifications disabled');
    return;
  }
  webpush.setVapidDetails(
    `mailto:${COMPANY_EMAIL || 'admin@tripbharatgo.com'}`,
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
  configured = true;
};

/**
 * Send push notification to a single subscription object
 * @param {{ endpoint, keys: { p256dh, auth } }} subscription
 * @param {{ title, body, icon, badge, url, data }} payload
 * @returns {Promise<boolean>} true if sent, false if subscription is gone
 */
const sendPush = async (subscription, payload) => {
  configure();
  if (!configured) return false;

  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    return true;
  } catch (err) {
    if (err.statusCode === 404 || err.statusCode === 410) {
      // Subscription expired / unsubscribed — caller should delete it
      return null;
    }
    logger.error(`Push send error: ${err.message}`);
    return false;
  }
};

/**
 * Send push to all subscriptions of a user
 * @param {string} userId
 * @param {{ title, body, icon, badge, url, data }} payload
 * @param {Model} PushSubscription  — Sequelize model
 */
const sendPushToUser = async (userId, payload, PushSubscription) => {
  configure();
  if (!configured) return;

  const subs = await PushSubscription.findAll({ where: { userId } });
  for (const sub of subs) {
    const result = await sendPush(
      { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
      payload
    );
    if (result === null) {
      // Dead subscription — remove it
      await sub.destroy();
    }
  }
};

/**
 * Send push to ALL subscribers (broadcasts)
 * @param {{ title, body, icon, badge, url, data }} payload
 * @param {Model} PushSubscription
 */
const sendPushToAll = async (payload, PushSubscription) => {
  configure();
  if (!configured) return;

  const subs = await PushSubscription.findAll();
  const dead = [];
  await Promise.all(
    subs.map(async (sub) => {
      const result = await sendPush(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload
      );
      if (result === null) dead.push(sub.id);
    })
  );
  if (dead.length > 0) {
    await PushSubscription.destroy({ where: { id: dead } });
  }
};

module.exports = { sendPush, sendPushToUser, sendPushToAll, getVapidPublicKey: () => process.env.VAPID_PUBLIC_KEY };
