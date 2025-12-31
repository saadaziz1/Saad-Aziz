const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.use(authMiddleware);
router.use(roleMiddleware('superadmin'));

/**
 * @swagger
 * /api/admin/users/{id}/promote-admin:
 *   put:
 *     summary: Promote user to admin (Superadmin only)
 *     tags: [Admin]
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
 *         description: User promoted to admin
 */
router.put('/users/:id/promote-admin', adminController.promoteToAdmin);

/**
 * @swagger
 * /api/admin/users/{id}/promote-superadmin:
 *   put:
 *     summary: Promote user to superadmin (Superadmin only)
 *     tags: [Admin]
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
 *         description: User promoted to superadmin
 */
router.put('/users/:id/promote-superadmin', adminController.promoteToSuperadmin);

/**
 * @swagger
 * /api/admin/users/{id}/demote:
 *   put:
 *     summary: Demote user to regular user (Superadmin only)
 *     tags: [Admin]
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
 *         description: User demoted to regular user
 */
router.put('/users/:id/demote', adminController.demoteToUser);

module.exports = router;