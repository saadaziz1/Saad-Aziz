const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.use(authMiddleware);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Place order from cart
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shippingAddress
 *               - paymentMethod
 *             properties:
 *               shippingAddress:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   zipCode:
 *                     type: string
 *                   country:
 *                     type: string
 *               paymentMethod:
 *                 type: string
 *                 enum: [card, cash, bank_transfer]
 *     responses:
 *       201:
 *         description: Order placed successfully
 */
router.post('/', orderController.placeOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get user orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 */
router.get('/', orderController.getUserOrders);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update order status (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Order status updated
 */
router.put('/:id/status', roleMiddleware('admin', 'superadmin'), orderController.updateStatus);

/**
 * @swagger
 * /api/orders/all:
 *   get:
 *     summary: Get all orders with user information (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
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
 *           default: 20
 *         description: Items per page
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *           example: "userId"
 *         description: Populate user information
 *     responses:
 *       200:
 *         description: Orders retrieved with user information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/OrderWithUser'
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 total:
 *                   type: integer
 */
router.get('/all', roleMiddleware('admin', 'superadmin'), orderController.getAllOrders);

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *           description: Reference to User ID
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         shippingAddress:
 *           $ref: '#/components/schemas/ShippingAddress'
 *         paymentMethod:
 *           type: string
 *           enum: [card, cash, bank_transfer]
 *         paymentStatus:
 *           type: string
 *           enum: [pending, paid, failed]
 *           default: pending
 *         orderStatus:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, cancelled]
 *           default: pending
 *         totalAmount:
 *           type: number
 *           minimum: 0
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     OrderWithUser:
 *       allOf:
 *         - $ref: '#/components/schemas/Order'
 *         - type: object
 *           properties:
 *             userId:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *     OrderItem:
 *       type: object
 *       properties:
 *         productId:
 *           type: string
 *           description: Reference to Product
 *         variantId:
 *           type: string
 *           description: Product variant ID
 *         quantity:
 *           type: number
 *           minimum: 1
 *         priceAtOrderTime:
 *           type: number
 *           minimum: 0
 *           description: Price when order was placed
 *     ShippingAddress:
 *       type: object
 *       required:
 *         - street
 *         - city
 *         - state
 *         - zipCode
 *         - country
 *       properties:
 *         street:
 *           type: string
 *           example: "123 Main Street, Apt 4B"
 *         city:
 *           type: string
 *           example: "New York"
 *         state:
 *           type: string
 *           example: "NY"
 *         zipCode:
 *           type: string
 *           example: "10001"
 *         country:
 *           type: string
 *           example: "United States"
 */

module.exports = router;