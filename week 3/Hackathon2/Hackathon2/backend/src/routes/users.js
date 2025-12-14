import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { blockUser, unblockUser, getAllUsers } from '../controllers/userController.js';

const router = express.Router();

router.use(authenticate);

router.get('/', authorize('superadmin', 'admin'), getAllUsers);
router.put('/:userId/block', authorize('superadmin'), blockUser);
router.put('/:userId/unblock', authorize('superadmin'), unblockUser);

export default router;