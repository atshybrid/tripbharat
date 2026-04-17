const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');
const { uploadMultiple, handleUploadError } = require('../middleware/upload');
const { createPackageValidation, validateMongoId, paginationValidation, validate } = require('../middleware/validation');

// Public routes
router.get(
  '/',
  paginationValidation,
  validate,
  packageController.getAllPackages
);

router.get(
  '/:id',
  validateMongoId,
  validate,
  packageController.getPackageById
);

// Admin routes
router.post(
  '/',
  protect,
  isAdmin,
  uploadMultiple('images', 10),
  handleUploadError,
  createPackageValidation,
  validate,
  packageController.createPackage
);

router.put(
  '/:id',
  protect,
  isAdmin,
  validateMongoId,
  uploadMultiple('images', 10),
  handleUploadError,
  validate,
  packageController.updatePackage
);

router.delete(
  '/:id',
  protect,
  isAdmin,
  validateMongoId,
  validate,
  packageController.deletePackage
);

module.exports = router;
