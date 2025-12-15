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
 *           enum: ["Black teas", "Green teas", "White teas", "Chai", "Matcha", "Herbal teas", "Oolong", "Rooibos", "Teaware"]
 *         description: Filter by tea category
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in name, description, tags
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Filter by tags (comma-separated)
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
 *         description: List of products with frontend-compatible structure
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
 *                 total:
 *                   type: integer
 *                   description: Total count for admin pages
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
 *                 example: "Premium Earl Grey"
 *               description:
 *                 type: string
 *                 example: "A classic blend of Ceylon black tea with bergamot oil"
 *               category:
 *                 type: string
 *                 enum: ["Black teas", "Green teas", "White teas", "Chai", "Matcha", "Herbal teas", "Oolong", "Rooibos", "Teaware"]
 *                 example: "Black teas"
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
 *                 description: JSON array of variants with required fields
 *                 example: '[{"name":"50g","priceDiff":0,"stock":100,"sku":"TEA-50G-001","isActive":true},{"name":"100g","priceDiff":5,"stock":50,"sku":"TEA-100G-001","isActive":true}]'
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
 *           example: "Premium Earl Grey"
 *         slug:
 *           type: string
 *           example: "premium-earl-grey"
 *         description:
 *           type: string
 *           example: "A classic blend of Ceylon black tea with bergamot oil"
 *         category:
 *           type: string
 *           enum: ["Black teas", "Green teas", "White teas", "Chai", "Matcha", "Herbal teas", "Oolong", "Rooibos", "Teaware"]
 *           example: "Black teas"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["organic", "premium", "bergamot"]
 *         basePrice:
 *           type: number
 *           example: 24.99
 *           description: Base price before variant adjustments
 *         featuredImage:
 *           type: string
 *           description: Cloudinary image URL
 *           example: "https://res.cloudinary.com/example/image/upload/v123/tea.jpg"
 *         rating:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *           example: 4.5
 *         totalRatingsCount:
 *           type: number
 *           example: 127
 *         variants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Variant'
 *           description: Available product variants with stock and pricing
 *         flavor:
 *           type: string
 *           example: "Citrusy"
 *         origin:
 *           type: string
 *           example: "Sri Lanka"
 *         caffeine:
 *           type: string
 *           example: "Medium"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     Variant:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Variant ID
 *         name:
 *           type: string
 *           enum: ["50g", "100g", "170g", "250g", "1kg", "sampler"]
 *           example: "100g"
 *         label:
 *           type: string
 *           example: "100g"
 *           description: Display label for frontend
 *         priceDiff:
 *           type: number
 *           example: 5.00
 *           description: Price difference from base price
 *         stock:
 *           type: number
 *           example: 50
 *           minimum: 0
 *         sku:
 *           type: string
 *           example: "EARL-100G-001"
 *         isActive:
 *           type: boolean
 *           default: true
 *           description: Whether variant is available for purchase
 */

module.exports = router;