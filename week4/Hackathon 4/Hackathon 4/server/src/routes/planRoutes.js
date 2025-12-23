const express = require('express');
const { getAllPlans, getPlanById } = require('../controllers/planController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getAllPlans);
router.get('/:id', authMiddleware, getPlanById);

module.exports = router;