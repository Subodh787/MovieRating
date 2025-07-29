import { Response } from 'express';
import database from '../models/database';
import { AuthRequest } from '../middleware/auth';

export const getCart = (req: AuthRequest, res: Response): void => {
  const userId = req.user?.id;
  const db = database.getDb();

  db.all(
    `SELECT ci.*, p.name, p.price, p.image, p.stock_quantity 
     FROM cart_items ci 
     JOIN products p ON ci.product_id = p.id 
     WHERE ci.user_id = ?`,
    [userId],
    (err, cartItems) => {
      if (err) {
        res.status(500).json({ error: 'Database error' });
        return;
      }

      res.json({ cartItems });
    }
  );
};

export const addToCart = (req: AuthRequest, res: Response): void => {
  const userId = req.user?.id;
  const { productId, quantity } = req.body;
  const db = database.getDb();

  if (!productId || !quantity || quantity <= 0) {
    res.status(400).json({ error: 'Valid product ID and quantity required' });
    return;
  }

  // Check if product exists and has sufficient stock
  db.get(
    'SELECT id, stock_quantity FROM products WHERE id = ?',
    [productId],
    (err, product: any) => {
      if (err) {
        res.status(500).json({ error: 'Database error' });
        return;
      }

      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      if (product.stock_quantity < quantity) {
        res.status(400).json({ error: 'Insufficient stock' });
        return;
      }

      // Check if item already exists in cart
      db.get(
        'SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?',
        [userId, productId],
        (err, existingItem: any) => {
          if (err) {
            res.status(500).json({ error: 'Database error' });
            return;
          }

          if (existingItem) {
            // Update quantity
            const newQuantity = existingItem.quantity + quantity;
            if (newQuantity > product.stock_quantity) {
              res.status(400).json({ error: 'Insufficient stock' });
              return;
            }

            db.run(
              'UPDATE cart_items SET quantity = ? WHERE id = ?',
              [newQuantity, existingItem.id],
              (err) => {
                if (err) {
                  res.status(500).json({ error: 'Failed to update cart' });
                  return;
                }
                res.json({ message: 'Cart updated successfully' });
              }
            );
          } else {
            // Add new item
            db.run(
              'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
              [userId, productId, quantity],
              (err) => {
                if (err) {
                  res.status(500).json({ error: 'Failed to add to cart' });
                  return;
                }
                res.status(201).json({ message: 'Item added to cart successfully' });
              }
            );
          }
        }
      );
    }
  );
};

export const updateCartItem = (req: AuthRequest, res: Response): void => {
  const userId = req.user?.id;
  const { id } = req.params;
  const { quantity } = req.body;
  const db = database.getDb();

  if (!quantity || quantity <= 0) {
    res.status(400).json({ error: 'Valid quantity required' });
    return;
  }

  // Check if cart item belongs to user and get product info
  db.get(
    `SELECT ci.id, ci.product_id, p.stock_quantity 
     FROM cart_items ci 
     JOIN products p ON ci.product_id = p.id 
     WHERE ci.id = ? AND ci.user_id = ?`,
    [id, userId],
    (err, cartItem: any) => {
      if (err) {
        res.status(500).json({ error: 'Database error' });
        return;
      }

      if (!cartItem) {
        res.status(404).json({ error: 'Cart item not found' });
        return;
      }

      if (quantity > cartItem.stock_quantity) {
        res.status(400).json({ error: 'Insufficient stock' });
        return;
      }

      db.run(
        'UPDATE cart_items SET quantity = ? WHERE id = ?',
        [quantity, id],
        (err) => {
          if (err) {
            res.status(500).json({ error: 'Failed to update cart item' });
            return;
          }
          res.json({ message: 'Cart item updated successfully' });
        }
      );
    }
  );
};

export const removeFromCart = (req: AuthRequest, res: Response): void => {
  const userId = req.user?.id;
  const { id } = req.params;
  const db = database.getDb();

  db.run(
    'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
    [id, userId],
    function (err) {
      if (err) {
        res.status(500).json({ error: 'Failed to remove item from cart' });
        return;
      }

      if (this.changes === 0) {
        res.status(404).json({ error: 'Cart item not found' });
        return;
      }

      res.json({ message: 'Item removed from cart successfully' });
    }
  );
};

export const clearCart = (req: AuthRequest, res: Response): void => {
  const userId = req.user?.id;
  const db = database.getDb();

  db.run('DELETE FROM cart_items WHERE user_id = ?', [userId], (err) => {
    if (err) {
      res.status(500).json({ error: 'Failed to clear cart' });
      return;
    }
    res.json({ message: 'Cart cleared successfully' });
  });
};