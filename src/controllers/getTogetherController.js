const { GetTogether } = require('../models');
const AppError = require('../utils/appError');
const crypto = require('crypto');

const dbType = process.env.DB_TYPE || 'mongodb';

function genInviteCode() {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

// GET /api/get-together
exports.getAllTrips = async (req, res, next) => {
  try {
    let trips;
    if (dbType === 'postgresql') {
      trips = await GetTogether.findAll({
        where: { creatorId: req.user.id },
        order: [['createdAt', 'DESC']]
      });
    } else {
      trips = await GetTogether.find({ creatorId: req.user.id }).sort('-createdAt');
    }
    res.status(200).json({ success: true, data: trips });
  } catch (error) { next(error); }
};

// GET /api/get-together/:id
exports.getTripById = async (req, res, next) => {
  try {
    let trip;
    if (dbType === 'postgresql') {
      trip = await GetTogether.findByPk(req.params.id);
    } else {
      trip = await GetTogether.findById(req.params.id);
    }
    if (!trip) return next(new AppError('Trip not found', 404));
    res.status(200).json({ success: true, data: trip });
  } catch (error) { next(error); }
};

// POST /api/get-together
exports.createTrip = async (req, res, next) => {
  try {
    const { tripName, description, proposedDates, maxParticipants } = req.body;
    const trip = await GetTogether.create({
      tripName,
      description,
      creatorId: req.user.id,
      inviteCode: genInviteCode(),
      proposedDates: proposedDates || [],
      proposedPackages: [],
      participants: [{ userId: req.user.id, name: req.user.name, role: 'creator', joinedAt: new Date() }],
      maxParticipants: maxParticipants || 20,
      status: 'active'
    });
    res.status(201).json({ success: true, message: 'Trip created successfully', data: trip });
  } catch (error) { next(error); }
};

// PUT /api/get-together/:id
exports.updateTrip = async (req, res, next) => {
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

    const allowed = ['tripName', 'description', 'proposedDates', 'maxParticipants', 'status'];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    if (dbType === 'postgresql') {
      await trip.update(updates); await trip.reload();
    } else {
      Object.assign(trip, updates); await trip.save();
    }
    res.status(200).json({ success: true, data: trip });
  } catch (error) { next(error); }
};

// POST /api/get-together/:id/participants
exports.addParticipant = async (req, res, next) => {
  try {
    const { userId, name } = req.body;
    let trip;
    if (dbType === 'postgresql') {
      trip = await GetTogether.findByPk(req.params.id);
    } else {
      trip = await GetTogether.findById(req.params.id);
    }
    if (!trip) return next(new AppError('Trip not found', 404));

    const participants = [...(trip.participants || [])];
    participants.push({ userId, name, role: 'member', joinedAt: new Date() });

    if (dbType === 'postgresql') {
      await trip.update({ participants });
    } else {
      trip.participants = participants; await trip.save();
    }
    res.status(200).json({ success: true, data: trip });
  } catch (error) { next(error); }
};

// POST /api/get-together/join  — { inviteCode }
exports.joinTrip = async (req, res, next) => {
  try {
    const { inviteCode } = req.body;
    if (!inviteCode) return next(new AppError('Invite code is required', 400));

    let trip;
    if (dbType === 'postgresql') {
      trip = await GetTogether.findOne({ where: { inviteCode: inviteCode.toUpperCase() } });
    } else {
      trip = await GetTogether.findOne({ inviteCode: inviteCode.toUpperCase() });
    }
    if (!trip) return next(new AppError('Invalid invite code', 404));

    const participants = [...(trip.participants || [])];
    const alreadyIn = participants.some(p => String(p.userId) === String(req.user.id));
    if (alreadyIn) return next(new AppError('You have already joined this trip', 400));

    participants.push({ userId: req.user.id, name: req.user.name, role: 'member', joinedAt: new Date() });

    if (dbType === 'postgresql') {
      await trip.update({ participants });
    } else {
      trip.participants = participants; await trip.save();
    }
    res.status(200).json({ success: true, message: 'Joined trip successfully', data: trip });
  } catch (error) { next(error); }
};

// POST /api/get-together/:id/vote
exports.voteForPackage = async (req, res, next) => {
  try {
    const { packageId, vote } = req.body;
    let trip;
    if (dbType === 'postgresql') {
      trip = await GetTogether.findByPk(req.params.id);
    } else {
      trip = await GetTogether.findById(req.params.id);
    }
    if (!trip) return next(new AppError('Trip not found', 404));

    const proposed = [...(trip.proposedPackages || [])];
    const pkg = proposed.find(p => String(p.packageId) === String(packageId));
    if (!pkg) return next(new AppError('Package not in this trip', 404));

    if (!pkg.votes) pkg.votes = [];
    pkg.votes = pkg.votes.filter(v => String(v.userId) !== String(req.user.id));
    pkg.votes.push({ userId: req.user.id, vote, votedAt: new Date() });

    if (dbType === 'postgresql') {
      await trip.update({ proposedPackages: proposed });
    } else {
      trip.proposedPackages = proposed; await trip.save();
    }
    res.status(200).json({ success: true, message: 'Vote recorded', data: trip });
  } catch (error) { next(error); }
};

// POST /api/get-together/:id/confirm
exports.confirmTrip = async (req, res, next) => {
  try {
    const { packageId } = req.body;
    let trip;
    if (dbType === 'postgresql') {
      trip = await GetTogether.findByPk(req.params.id);
    } else {
      trip = await GetTogether.findById(req.params.id);
    }
    if (!trip) return next(new AppError('Trip not found', 404));

    const creatorId = trip.creatorId || trip.dataValues?.creatorId;
    if (String(creatorId) !== String(req.user.id)) {
      return next(new AppError('Only the creator can confirm this trip', 403));
    }

    if (dbType === 'postgresql') {
      await trip.update({ status: 'confirmed', confirmedPackageId: packageId });
    } else {
      trip.status = 'confirmed'; trip.confirmedPackageId = packageId; await trip.save();
    }
    res.status(200).json({ success: true, message: 'Trip confirmed', data: trip });
  } catch (error) { next(error); }
};
