const { TourPackage } = require('../models');
const AppError = require('../utils/appError');
const { uploadMultipleImages } = require('../utils/imageUpload');
const { getPagination, formatPaginationResponse } = require('../utils/helpers');

const dbType = process.env.DB_TYPE || 'mongodb';

// @desc    Get all packages
// @route   GET /api/packages
// @access  Public
exports.getAllPackages = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, destination, page = 1, limit = 10, sortBy } = req.query;
    const { skip, limit: limitNum } = getPagination(page, limit);

    let packages, total;

    if (dbType === 'postgresql') {
      const { Op } = require('sequelize');
      const where = { isActive: true };
      if (category) where.category = category;
      if (destination) where.destination = { [Op.iLike]: `%${destination}%` };
      if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
        if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
      }

      let order = [['createdAt', 'DESC']];
      if (sortBy === 'price_asc') order = [['price', 'ASC']];
      else if (sortBy === 'price_desc') order = [['price', 'DESC']];
      else if (sortBy === 'rating') order = [['averageRating', 'DESC']];

      const result = await TourPackage.findAndCountAll({ where, order, offset: skip, limit: limitNum });
      packages = result.rows;
      total = result.count;
    } else {
      const query = { isActive: true };
      if (category) query.category = category;
      if (destination) query.destination = new RegExp(destination, 'i');
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseFloat(minPrice);
        if (maxPrice) query.price.$lte = parseFloat(maxPrice);
      }

      let sort = {};
      if (sortBy === 'price_asc') sort.price = 1;
      else if (sortBy === 'price_desc') sort.price = -1;
      else if (sortBy === 'rating') sort.rating = -1;
      else sort.createdAt = -1;

      packages = await TourPackage.find(query).sort(sort).skip(skip).limit(limitNum);
      total = await TourPackage.countDocuments(query);
    }

    const response = formatPaginationResponse(packages, total, page, limit);

    res.status(200).json({
      success: true,
      data: response
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get package by ID
// @route   GET /api/packages/:id
// @access  Public
exports.getPackageById = async (req, res, next) => {
  try {
    let pkg;

    if (dbType === 'postgresql') {
      pkg = await TourPackage.findByPk(req.params.id);
    } else {
      pkg = await TourPackage.findById(req.params.id).populate('createdBy', 'name email');
    }

    if (!pkg) {
      return next(new AppError('Package not found', 404));
    }

    res.status(200).json({
      success: true,
      data: pkg
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Create package (Admin only)
// @route   POST /api/packages
// @access  Private/Admin
exports.createPackage = async (req, res, next) => {
  try {
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = await uploadMultipleImages(req.files, 'sktours/packages');
    }

    const pkg = await TourPackage.create({
      ...req.body,
      images: imageUrls,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Package created successfully',
      data: pkg
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Update package (Admin only)
// @route   PUT /api/packages/:id
// @access  Private/Admin
exports.updatePackage = async (req, res, next) => {
  try {
    let pkg;

    if (dbType === 'postgresql') {
      pkg = await TourPackage.findByPk(req.params.id);
    } else {
      pkg = await TourPackage.findById(req.params.id);
    }

    if (!pkg) {
      return next(new AppError('Package not found', 404));
    }

    if (req.files && req.files.length > 0) {
      const newImageUrls = await uploadMultipleImages(req.files, 'sktours/packages');
      req.body.images = [...(pkg.images || []), ...newImageUrls];
    }

    if (dbType === 'postgresql') {
      await pkg.update(req.body);
      await pkg.reload();
    } else {
      pkg = await TourPackage.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
    }

    res.status(200).json({
      success: true,
      message: 'Package updated successfully',
      data: pkg
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Delete package (Admin only)
// @route   DELETE /api/packages/:id
// @access  Private/Admin
exports.deletePackage = async (req, res, next) => {
  try {
    let pkg;

    if (dbType === 'postgresql') {
      pkg = await TourPackage.findByPk(req.params.id);
    } else {
      pkg = await TourPackage.findById(req.params.id);
    }

    if (!pkg) {
      return next(new AppError('Package not found', 404));
    }

    if (dbType === 'postgresql') {
      await pkg.destroy();
    } else {
      await TourPackage.findByIdAndDelete(req.params.id);
    }

    res.status(200).json({
      success: true,
      message: 'Package deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};
