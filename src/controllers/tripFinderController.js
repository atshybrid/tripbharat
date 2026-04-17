/**
 * Strangers Trip Planner Controller
 * Find travel companions for open trips
 *
 * Routes:
 *   GET    /api/trip-finder              — browse open trips
 *   GET    /api/trip-finder/:id          — trip details
 *   POST   /api/trip-finder              — create open trip
 *   PUT    /api/trip-finder/:id          — update trip (creator only)
 *   POST   /api/trip-finder/:id/request  — request to join
 *   PUT    /api/trip-finder/:id/request/:userId/respond — approve/reject
 *   DELETE /api/trip-finder/:id          — cancel trip (creator only)
 */

const AppError = require('../utils/appError');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

// We use the GetTogether model with tripType = 'open' for strangers trips
// This avoids creating a new DB table
const { GetTogether } = require('../models');

const dbType = process.env.DB_TYPE || 'mongodb';

// ── GET /api/trip-finder  — list open trips with filters ──────
exports.listOpenTrips = async (req, res, next) => {
  try {
    const {
      destination, startDate, endDate,
      minBudget, maxBudget, page = 1, limit = 12,
      category, gender
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    let trips, total;

    if (dbType === 'postgresql') {
      const where = { tripType: 'open', status: 'active' };
      if (destination) where.destination = { [Op.iLike]: `%${destination}%` };
      if (startDate)   where.startDate   = { [Op.gte]: new Date(startDate) };
      if (endDate)     where.endDate     = { [Op.lte]: new Date(endDate) };
      if (category)    where.category    = category;
      if (minBudget)   where.budget      = { ...(where.budget || {}), [Op.gte]: parseFloat(minBudget) };
      if (maxBudget)   where.budget      = { ...(where.budget || {}), [Op.lte]: parseFloat(maxBudget) };
      if (gender && gender !== 'any') where.preferredGender = { [Op.in]: [gender, 'any'] };

      const result = await GetTogether.findAndCountAll({
        where,
        order: [['createdAt', 'DESC']],
        limit: limitNum,
        offset
      });
      trips = result.rows;
      total = result.count;
    } else {
      const filter = { tripType: 'open', status: 'active' };
      if (destination) filter.destination = new RegExp(destination, 'i');
      if (startDate)   filter.startDate = { $gte: new Date(startDate) };
      if (endDate)     filter.endDate   = { $lte: new Date(endDate) };
      if (category)    filter.category  = category;
      if (minBudget || maxBudget) {
        filter.budget = {};
        if (minBudget) filter.budget.$gte = parseFloat(minBudget);
        if (maxBudget) filter.budget.$lte = parseFloat(maxBudget);
      }
      trips = await GetTogether.find(filter)
        .sort('-createdAt').skip(offset).limit(limitNum);
      total = await GetTogether.countDocuments(filter);
    }

    res.status(200).json({
      success: true,
      data: trips,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) }
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/trip-finder/:id ──────────────────────────────────
exports.getTripDetails = async (req, res, next) => {
  try {
    let trip;
    if (dbType === 'postgresql') {
      trip = await GetTogether.findOne({ where: { id: req.params.id, tripType: 'open' } });
    } else {
      trip = await GetTogether.findOne({ _id: req.params.id, tripType: 'open' });
    }
    if (!trip) return next(new AppError('Trip not found', 404));
    res.status(200).json({ success: true, data: trip });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/trip-finder  — create open trip ─────────────────
exports.createOpenTrip = async (req, res, next) => {
  try {
    const {
      tripName, destination, description,
      startDate, endDate, budget,
      maxParticipants, category, preferredGender,
      preferredAgeMin, preferredAgeMax,
      languages, interests
    } = req.body;

    if (!tripName || !destination || !startDate) {
      return next(new AppError('tripName, destination, and startDate are required', 400));
    }

    const { crypto: cryptoModule } = require('crypto');
    const inviteCode = require('crypto').randomBytes(4).toString('hex').toUpperCase();

    const trip = await GetTogether.create({
      tripName,
      destination,
      description,
      creatorId: req.user.id,
      creatorName: req.user.name,
      tripType: 'open',         // differentiates from private GetTogether
      inviteCode,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      budget: budget ? parseFloat(budget) : null,
      maxParticipants: maxParticipants || 6,
      category: category || 'general',
      preferredGender: preferredGender || 'any',
      preferredAgeMin: preferredAgeMin || 18,
      preferredAgeMax: preferredAgeMax || 60,
      languages: languages || ['Telugu', 'Hindi', 'English'],
      interests: interests || [],
      participants: [{
        userId: req.user.id,
        name: req.user.name,
        role: 'creator',
        status: 'approved',
        joinedAt: new Date()
      }],
      joinRequests: [],
      status: 'active'
    });

    res.status(201).json({ success: true, message: 'Open trip created!', data: trip });
  } catch (error) {
    next(error);
  }
};

// ── PUT /api/trip-finder/:id ──────────────────────────────────
exports.updateOpenTrip = async (req, res, next) => {
  try {
    let trip;
    if (dbType === 'postgresql') {
      trip = await GetTogether.findByPk(req.params.id);
    } else {
      trip = await GetTogether.findById(req.params.id);
    }
    if (!trip) return next(new AppError('Trip not found', 404));

    const creatorId = trip.creatorId || trip.dataValues?.creatorId;
    if (String(creatorId) !== String(req.user.id)) {
      return next(new AppError('Only the creator can update this trip', 403));
    }

    const allowed = [
      'tripName', 'description', 'budget', 'maxParticipants',
      'startDate', 'endDate', 'preferredGender', 'preferredAgeMin',
      'preferredAgeMax', 'interests', 'languages', 'status'
    ];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    if (dbType === 'postgresql') {
      await trip.update(updates); await trip.reload();
    } else {
      Object.assign(trip, updates); await trip.save();
    }

    res.status(200).json({ success: true, data: trip });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/trip-finder/:id/request — request to join ───────
exports.requestToJoin = async (req, res, next) => {
  try {
    const { message } = req.body;
    let trip;
    if (dbType === 'postgresql') {
      trip = await GetTogether.findOne({ where: { id: req.params.id, tripType: 'open', status: 'active' } });
    } else {
      trip = await GetTogether.findOne({ _id: req.params.id, tripType: 'open', status: 'active' });
    }
    if (!trip) return next(new AppError('Trip not found or no longer accepting requests', 404));

    const participants = trip.participants || [];
    const joinRequests = trip.joinRequests || [];

    // Check already joined
    if (participants.some(p => String(p.userId) === String(req.user.id))) {
      return next(new AppError('You are already in this trip', 400));
    }
    // Check already requested
    if (joinRequests.some(r => String(r.userId) === String(req.user.id) && r.status === 'pending')) {
      return next(new AppError('You already have a pending request', 400));
    }
    // Check capacity
    const approved = participants.filter(p => p.status === 'approved').length;
    const max = trip.maxParticipants || trip.dataValues?.maxParticipants || 6;
    if (approved >= max) return next(new AppError('This trip is full', 400));

    joinRequests.push({
      userId: req.user.id,
      name: req.user.name,
      message: message || '',
      status: 'pending',
      requestedAt: new Date()
    });

    if (dbType === 'postgresql') {
      await trip.update({ joinRequests });
    } else {
      trip.joinRequests = joinRequests; await trip.save();
    }

    res.status(200).json({ success: true, message: 'Join request sent! Waiting for creator approval.' });
  } catch (error) {
    next(error);
  }
};

// ── PUT /api/trip-finder/:id/request/:requestUserId/respond ───
// Body: { action: 'approve' | 'reject' }
exports.respondToRequest = async (req, res, next) => {
  try {
    const { action } = req.body;
    if (!['approve', 'reject'].includes(action)) {
      return next(new AppError('action must be approve or reject', 400));
    }

    let trip;
    if (dbType === 'postgresql') {
      trip = await GetTogether.findByPk(req.params.id);
    } else {
      trip = await GetTogether.findById(req.params.id);
    }
    if (!trip) return next(new AppError('Trip not found', 404));

    const creatorId = trip.creatorId || trip.dataValues?.creatorId;
    if (String(creatorId) !== String(req.user.id)) {
      return next(new AppError('Only the creator can respond to requests', 403));
    }

    const joinRequests = [...(trip.joinRequests || [])];
    const reqIdx = joinRequests.findIndex(r => String(r.userId) === String(req.params.requestUserId));
    if (reqIdx === -1) return next(new AppError('Request not found', 404));

    joinRequests[reqIdx].status = action === 'approve' ? 'approved' : 'rejected';
    joinRequests[reqIdx].respondedAt = new Date();

    const participants = [...(trip.participants || [])];
    if (action === 'approve') {
      participants.push({
        userId: joinRequests[reqIdx].userId,
        name: joinRequests[reqIdx].name,
        role: 'member',
        status: 'approved',
        joinedAt: new Date()
      });
    }

    const updates = { joinRequests, participants };
    if (dbType === 'postgresql') {
      await trip.update(updates);
    } else {
      trip.joinRequests = joinRequests;
      trip.participants = participants;
      await trip.save();
    }

    res.status(200).json({
      success: true,
      message: `Request ${action}d successfully`,
      data: { action, userId: req.params.requestUserId }
    });
  } catch (error) {
    next(error);
  }
};

// ── DELETE /api/trip-finder/:id ───────────────────────────────
exports.cancelOpenTrip = async (req, res, next) => {
  try {
    let trip;
    if (dbType === 'postgresql') {
      trip = await GetTogether.findByPk(req.params.id);
    } else {
      trip = await GetTogether.findById(req.params.id);
    }
    if (!trip) return next(new AppError('Trip not found', 404));

    const creatorId = trip.creatorId || trip.dataValues?.creatorId;
    if (String(creatorId) !== String(req.user.id)) {
      return next(new AppError('Only the creator can cancel this trip', 403));
    }

    if (dbType === 'postgresql') {
      await trip.update({ status: 'cancelled' });
    } else {
      trip.status = 'cancelled'; await trip.save();
    }

    res.status(200).json({ success: true, message: 'Trip cancelled' });
  } catch (error) {
    next(error);
  }
};
