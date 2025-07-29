import { Router } from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} from '../controllers/orderController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { orderValidation } from '../utils/validation';

const router = Router();

// Customer routes
router.post('/', authenticateToken, orderValidation, createOrder);
router.get('/my-orders', authenticateToken, getUserOrders);
router.get('/:id', authenticateToken, getOrderById);

// Admin routes
router.get('/', authenticateToken, requireAdmin, getAllOrders);
router.put('/:id/status', authenticateToken, requireAdmin, updateOrderStatus);

export default router;