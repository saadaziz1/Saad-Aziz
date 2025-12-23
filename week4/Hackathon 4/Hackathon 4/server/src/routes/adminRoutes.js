const express = require('express');
const { 
  getAllUsers, 
  createAdmin,
  blockUser, 
  unblockUser, 
  createPlan, 
  getAllPlans, 
  getDashboardStats 
} = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const { adminMiddleware } = require('../middlewares/adminMiddleware');
const { superAdminMiddleware } = require('../middlewares/superAdminMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/users', getAllUsers);
router.post('/create-admin', authMiddleware, superAdminMiddleware, createAdmin);
router.put('/users/:userId/block', blockUser);
router.put('/users/:userId/unblock', unblockUser);
router.post('/plans', createPlan);
router.get('/plans', getAllPlans);
router.get('/dashboard', getDashboardStats);

module.exports = router;