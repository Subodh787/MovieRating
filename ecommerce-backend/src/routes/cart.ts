import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cartController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All cart routes require authentication
router.get('/', authenticateToken, getCart);
router.post('/add', authenticateToken, addToCart);
router.put('/:id', authenticateToken, updateCartItem);
router.delete('/:id', authenticateToken, removeFromCart);
router.delete('/', authenticateToken, clearCart);

export default router;