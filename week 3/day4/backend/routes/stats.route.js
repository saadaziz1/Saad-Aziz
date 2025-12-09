const express = require('express');
const router = express.Router();
const { getStats } = require("../controllers/project.controller");
const { protect } = require("../middlewares/auth.middleware");

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Stats fetched successfully
 */
router.get('/', protect, getStats);

module.exports = router;