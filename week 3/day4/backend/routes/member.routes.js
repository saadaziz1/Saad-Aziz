const express = require('express');
const router = express.Router();
const { getMembers, getMemberById, createMember, updateMember, deleteMember } = require('../controllers/member.controller');
const { protect } = require('../middlewares/auth.middleware');
const { createMemberValidator, updateMemberValidator, idValidator } = require('../middlewares/validators');
const { validate } = require('../middlewares/validate.middleware');

/**
 * @swagger
 * /api/members:
 *   get:
 *     summary: Get all members
 *     tags: [Members]
 *     responses:
 *       200:
 *         description: Members fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', protect, getMembers);

/**
 * @swagger
 * /api/members/{id}:
 *   get:
 *     summary: Get member by ID
 *     tags: [Members]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member fetched successfully
 *       404:
 *         description: Member not found
 */
router.get('/:id', protect, idValidator, validate, getMemberById);

/**
 * @swagger
 * /api/members:
 *   post:
 *     summary: Create a new member
 *     tags: [Members]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - role
 *               - skills
 *               - email
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: number
 *     responses:
 *       201:
 *         description: Member created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', protect, createMemberValidator, validate, createMember);

/**
 * @swagger
 * /api/members/{id}:
 *   put:
 *     summary: Update member
 *     tags: [Members]
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
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: number
 *     responses:
 *       200:
 *         description: Member updated successfully
 *       404:
 *         description: Member not found
 */
router.put('/:id', protect, updateMemberValidator, validate, updateMember);

/**
 * @swagger
 * /api/members/{id}:
 *   delete:
 *     summary: Delete member
 *     tags: [Members]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member deleted successfully
 *       404:
 *         description: Member not found
 */
router.delete('/:id', protect, idValidator, validate, deleteMember);

module.exports = router;
