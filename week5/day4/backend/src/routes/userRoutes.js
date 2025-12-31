const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * /api/users/mention-search:
 *   get:
 *     summary: Search users for mentions (authenticated users only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query for name
 *     responses:
 *       200:
 *         description: Users found for mention
 */
router.get('/mention-search', authMiddleware, userController.mentionSearch);

router.use(authMiddleware);
router.use(roleMiddleware('superadmin'));

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: List all users (Superadmin only)
 *     tags: [Users]
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
 *         description: Users retrieved successfully
 */
router.get('/', userController.listUsers);

/**
 * @swagger
 * /api/users/{id}/block:
 *   put:
 *     summary: Block user (Superadmin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User blocked successfully
 */
router.put('/:id/block', userController.blockUser);

/**
 * @swagger
 * /api/users/{id}/unblock:
 *   put:
 *     summary: Unblock user (Superadmin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User unblocked successfully
 */
router.put('/:id/unblock', userController.unblockUser);

module.exports = router;