const express = require('express');
const { activateFreeTrial, subscribeToPlan, getSubscriptionStatus } = require('../controllers/userController');
const { validateCard } = require('../utils/validations');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/free-trial', authMiddleware, activateFreeTrial);
router.post('/subscribe', authMiddleware, validateCard, subscribeToPlan);
router.get('/subscription', authMiddleware, getSubscriptionStatus);

module.exports = router;