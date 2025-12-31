const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.use(authMiddleware);
router.use(roleMiddleware('admin', 'superadmin'));

/**
 * @swagger
 * /api/dashboard/analytics:
 *   get:
 *     summary: Get dashboard analytics (Admin only)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 analytics:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: integer
 *                       example: 1250
 *                       description: Total registered users
 *                     totalOrders:
 *                       type: integer
 *                       example: 342
 *                       description: Total orders placed
 *                     revenue:
 *                       type: number
 *                       example: 15420.50
 *                       description: Total revenue in euros
 *                     lowStockProducts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           variants:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                               stock:
 *                                 type: number
 *                       description: Products with low stock (≤5 items)
 *                     topSellingProducts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           totalSold:
 *                             type: number
 *                       description: Best selling products by quantity
 */
router.get('/analytics', dashboardController.getAnalytics);

/**
 * @swagger
 * components:
 *   schemas:
 *     DashboardAnalytics:
 *       type: object
 *       properties:
 *         totalUsers:
 *           type: integer
 *           description: Count of all registered users
 *         totalOrders:
 *           type: integer
 *           description: Count of all orders
 *         revenue:
 *           type: number
 *           description: Total revenue from all orders
 *         lowStockProducts:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               name:
 *                 type: string
 *               variants:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   stock:
 *                     type: number
 *         topSellingProducts:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               name:
 *                 type: string
 *               totalSold:
 *                 type: number
 */

module.exports = router;