// src/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { uploadSingleImage } = require('../middlewares/upload');
const asyncHandler = require('express-async-handler');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management endpoints
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products with pagination and filters
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in name, description, tags
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [createdAt, price-low, price-high, rating, name]
 *           default: createdAt
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 totalProducts:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 */
router.get('/', productController.list);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.get('/:id', productController.get);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product with image upload
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - category
 *               - basePrice
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Premium Saffron"
 *               description:
 *                 type: string
 *                 example: "Finest quality saffron from Iran"
 *               category:
 *                 type: string
 *                 example: "Saffron"
 *               basePrice:
 *                 type: number
 *                 example: 59.99
 *               tags:
 *                 type: string
 *                 example: "organic,premium,iranian"
 *               slug:
 *                 type: string
 *                 example: "premium-saffron"
 *               variants:
 *                 type: string
 *                 description: JSON array of variants
 *                 example: '[{"name":"1g","stock":100},{"name":"5g","stock":50}]'
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Product featured image
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized - no token provided
 *       403:
 *         description: Forbidden - not admin
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware('admin', 'superadmin'),
  uploadSingleImage,
  productController.create
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update existing product with optional image
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               basePrice:
 *                 type: number
 *               tags:
 *                 type: string
 *               variants:
 *                 type: string
 *                 description: JSON array of variants
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: New featured image (optional)
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 */
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('admin', 'superadmin'),
  uploadSingleImage,
  productController.update
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('admin', 'superadmin'),
  productController.delete
);

/**
 * @swagger
 * /api/products/upload/image:
 *   post:
 *     summary: Upload standalone image to Cloudinary
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 imageUrl:
 *                   type: string
 *                   description: Cloudinary URL
 *                   example: "https://res.cloudinary.com/dxnxa5jgc/image/upload/v1234567/filename.jpg"
 *                 message:
 *                   type: string
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Cloudinary upload failed
 */
router.post(
  '/upload/image',
  authMiddleware,
  roleMiddleware('admin', 'superadmin'),
  uploadSingleImage,
  productController.uploadImage
);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ID
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         basePrice:
 *           type: number
 *         featuredImage:
 *           type: string
 *           description: Cloudinary image URL
 *         rating:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *         totalRatingsCount:
 *           type: number
 *         variants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Variant'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     Variant:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "1g"
 *         priceDiff:
 *           type: number
 *           example: 0
 *         stock:
 *           type: number
 *           example: 100
 *         sku:
 *           type: string
 *           example: "PRE-1G-1234"
 *         isActive:
 *           type: boolean
 *           default: true
 */

module.exports = router;