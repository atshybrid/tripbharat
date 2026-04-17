const express = require('express');
const { getModels } = require('../models/postgres');
const { protect, restrictTo } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { imageUpload } = require('../utils/imageUpload');
const AppError = require('../utils/appError');

const router = express.Router();

// @desc    Get all tour packages
// @route   GET /api/packages
// @access  Public
const getAllPackages = async (req, res, next) => {
  try {
    if (process.env.DB_TYPE === 'postgresql') {
      const { TourPackage } = getModels();
      const { Op } = require('sequelize');
      
      const { destination, category, difficulty, minPrice, maxPrice, search, sort = '-createdAt', page = 1, limit = 10 } = req.query;

      const where = { isActive: true };

      if (destination) where.destination = { [Op.iLike]: `%${destination}%` };
      if (category) where.category = category;
      if (difficulty) where.difficulty = difficulty;
      if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price[Op.gte] = minPrice;
        if (maxPrice) where.price[Op.lte] = maxPrice;
      }
      if (search) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const sortField = sort.startsWith('-') ? sort.slice(1) : sort;
      const sortOrder = sort.startsWith('-') ? 'DESC' : 'ASC';

      const offset = (page - 1) * limit;

      const { count, rows } = await TourPackage.findAndCountAll({
        where,
        order: [[sortField, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.status(200).json({
        success: true,
        count: rows.length,
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        data: rows
      });
    } else {
      // MongoDB implementation (existing code)
      const TourPackage = require('../models/TourPackage');
      const { destination, category, difficulty, minPrice, maxPrice, search, sort = '-createdAt', page = 1, limit = 10 } = req.query;

      const query = { isActive: true };

      if (destination) query.destination = new RegExp(destination, 'i');
      if (category) query.category = category;
      if (difficulty) query.difficulty = difficulty;
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = minPrice;
        if (maxPrice) query.price.$lte = maxPrice;
      }
      if (search) {
        query.$or = [
          { name: new RegExp(search, 'i') },
          { description: new RegExp(search, 'i') }
        ];
      }

      const packages = await TourPackage.find(query)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit * 1);

      const count = await TourPackage.countDocuments(query);

      res.status(200).json({
        success: true,
        count: packages.length,
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        data: packages
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get single package by ID
// @route   GET /api/packages/:id
// @access  Public
const getPackageById = async (req, res, next) => {
  try {
    if (process.env.DB_TYPE === 'postgresql') {
      const { TourPackage, Review } = getModels();
      
      const package = await TourPackage.findByPk(req.params.id, {
        include: [{ model: Review, as: 'reviews', include: ['user'] }]
      });

      if (!package) {
        return next(new AppError('Package not found', 404));
      }

      res.status(200).json({
        success: true,
        data: package
      });
    } else {
      const TourPackage = require('../models/TourPackage');
      
      const package = await TourPackage.findById(req.params.id).populate({
        path: 'reviews',
        populate: { path: 'user', select: 'name profileImage' }
      });

      if (!package) {
        return next(new AppError('Package not found', 404));
      }

      res.status(200).json({
        success: true,
        data: package
      });
    }
  } catch (error) {
    next(error);
  }
};

router.get('/', getAllPackages);
router.get('/:id', getPackageById);

// Protected routes below
router.use(protect);

// Admin only routes
router.use(restrictTo('admin'));

// @desc    Create new package
// @route   POST /api/packages
// @access  Admin
router.post('/', upload.array('images', 10), async (req, res, next) => {
  try {
    // Upload images to Cloudinary
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await imageUpload(file.buffer, 'packages');
        imageUrls.push(result.secure_url);
      }
    }

    const packageData = {
      ...req.body,
      images: imageUrls,
      itinerary: JSON.parse(req.body.itinerary || '[]'),
      inclusions: JSON.parse(req.body.inclusions || '[]'),
      exclusions: JSON.parse(req.body.exclusions || '[]'),
      startDates: JSON.parse(req.body.startDates || '[]')
    };

    if (process.env.DB_TYPE === 'postgresql') {
      const { TourPackage } = getModels();
      const package = await TourPackage.create(packageData);

      res.status(201).json({
        success: true,
        data: package
      });
    } else {
      const TourPackage = require('../models/TourPackage');
      const package = await TourPackage.create(packageData);

      res.status(201).json({
        success: true,
        data: package
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
