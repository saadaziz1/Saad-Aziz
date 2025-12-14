import express from 'express';
import { productController } from '../controllers/productController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);
router.post('/check-stock', productController.checkStock);

// Admin/Superadmin routes
router.post('/', authenticate, authorize('admin', 'superadmin'), productController.createProduct);
router.put('/:id', authenticate, authorize('admin', 'superadmin'), productController.updateProduct);
router.delete('/:id', authenticate, authorize('admin', 'superadmin'), productController.deleteProduct);

export default router;