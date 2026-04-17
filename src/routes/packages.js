const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');
const { uploadMultiple, handleUploadError } = require('../middleware/upload');
const { createPackageValidation, validateMongoId, paginationValidation, validate } = require('../middleware/validation');

/**
 * @swagger
 * tags:
 *   name: Packages
 *   description: Tour package management
 */

/**
 * @swagger
 * /packages:
 *   get:
 *     summary: Get all tour packages (with filters & pagination)
 *     tags: [Packages]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: destination
 *         schema: { type: string }
 *         description: Filter by destination keyword
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *         description: Filter by category (Beach, Hill, Temple, etc.)
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *       - in: query
 *         name: isFeatured
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: List of packages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 count: { type: integer }
 *                 data: { type: array, items: { $ref: '#/components/schemas/TourPackage' } }
 */

/**
 * @swagger
 * /packages/{id}:
 *   get:
 *     summary: Get a single tour package by ID
 *     tags: [Packages]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Package details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TourPackage'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /packages:
 *   post:
 *     summary: Create a new tour package (Admin only)
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, destination, description, duration, price, category]
 *             properties:
 *               name: { type: string, example: "Kerala Premium Backwaters" }
 *               destination: { type: string, example: "Kerala, India" }
 *               description: { type: string }
 *               duration: { type: integer, example: 6 }
 *               price: { type: number, example: 18000 }
 *               discountPrice: { type: number, example: 15000 }
 *               category: { type: string, example: "Backwaters" }
 *               maxGroupSize: { type: integer, example: 12 }
 *               difficulty: { type: string, enum: [easy, moderate, difficult] }
 *               isFeatured: { type: boolean }
 *               images: { type: array, items: { type: string, format: binary } }
 *     responses:
 *       201:
 *         description: Package created
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /packages/{id}:
 *   put:
 *     summary: Update a tour package (Admin only)
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               price: { type: number }
 *               isActive: { type: boolean }
 *               images: { type: array, items: { type: string, format: binary } }
 *     responses:
 *       200:
 *         description: Package updated
 *   delete:
 *     summary: Delete a tour package (Admin only)
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Package deleted
 */

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
