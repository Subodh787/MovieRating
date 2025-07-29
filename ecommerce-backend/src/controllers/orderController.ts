import { Response } from 'express';
import { validationResult } from 'express-validator';
import database from '../models/database';
import { AuthRequest } from '../middleware/auth';

export const createOrder = (req: AuthRequest, res: Response): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const userId = req.user?.id;
  const { items, shippingAddress } = req.body;
  const db = database.getDb();

  // Validate items and calculate total
  let totalAmount = 0;
  let processedItems = 0;
  const orderItems: any[] = [];

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    items.forEach((item: any, index: number) => {
      db.get(
        'SELECT id, price, stock_quantity FROM products WHERE id = ?',
        [item.productId],
        (err, product: any) => {
          if (err) {
            db.run('ROLLBACK');
            res.status(500).json({ error: 'Database error' });
            return;
          }

          if (!product) {
            db.run('ROLLBACK');
            res.status(404).json({ error: `Product ${item.productId} not found` });
            return;
          }

          if (product.stock_quantity < item.quantity) {
            db.run('ROLLBACK');
            res.status(400).json({ error: `Insufficient stock for product ${item.productId}` });
            return;
          }

          totalAmount += product.price * item.quantity;
          orderItems.push({
            productId: item.productId,
            quantity: item.quantity,
            price: product.price
          });

          processedItems++;

          if (processedItems === items.length) {
            // Create order
            db.run(
              'INSERT INTO orders (user_id, total_amount, shipping_address) VALUES (?, ?, ?)',
              [userId, totalAmount, shippingAddress],
              function (err) {
                if (err) {
                  db.run('ROLLBACK');
                  res.status(500).json({ error: 'Failed to create order' });
                  return;
                }

                const orderId = this.lastID;
                let insertedItems = 0;

                // Insert order items and update stock
                orderItems.forEach((orderItem) => {
                  db.run(
                    'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                    [orderId, orderItem.productId, orderItem.quantity, orderItem.price],
                    (err) => {
                      if (err) {
                        db.run('ROLLBACK');
                        res.status(500).json({ error: 'Failed to create order items' });
                        return;
                      }

                      // Update stock
                      db.run(
                        'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
                        [orderItem.quantity, orderItem.productId],
                        (err) => {
                          if (err) {
                            db.run('ROLLBACK');
                            res.status(500).json({ error: 'Failed to update stock' });
                            return;
                          }

                          insertedItems++;

                          if (insertedItems === orderItems.length) {
                            // Clear cart items for this user
                            db.run(
                              'DELETE FROM cart_items WHERE user_id = ?',
                              [userId],
                              (err) => {
                                if (err) {
                                  console.error('Failed to clear cart:', err);
                                }

                                db.run('COMMIT');
                                res.status(201).json({
                                  message: 'Order created successfully',
                                  orderId,
                                  totalAmount
                                });
                              }
                            );
                          }
                        }
                      );
                    }
                  );
                });
              }
            );
          }
        }
      );
    });
  });
};

export const getUserOrders = (req: AuthRequest, res: Response): void => {
  const userId = req.user?.id;
  const db = database.getDb();

  db.all(
    `SELECT o.*, COUNT(oi.id) as item_count 
     FROM orders o 
     LEFT JOIN order_items oi ON o.id = oi.order_id 
     WHERE o.user_id = ? 
     GROUP BY o.id 
     ORDER BY o.created_at DESC`,
    [userId],
    (err, orders) => {
      if (err) {
        res.status(500).json({ error: 'Database error' });
        return;
      }

      res.json({ orders });
    }
  );
};

export const getOrderById = (req: AuthRequest, res: Response): void => {
  const userId = req.user?.id;
  const { id } = req.params;
  const db = database.getDb();

  // Get order details
  db.get(
    'SELECT * FROM orders WHERE id = ? AND user_id = ?',
    [id, userId],
    (err, order: any) => {
      if (err) {
        res.status(500).json({ error: 'Database error' });
        return;
      }

      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      // Get order items
      db.all(
        `SELECT oi.*, p.name, p.image 
         FROM order_items oi 
         JOIN products p ON oi.product_id = p.id 
         WHERE oi.order_id = ?`,
        [id],
        (err, items) => {
          if (err) {
            res.status(500).json({ error: 'Database error' });
            return;
          }

          res.json({ order: { ...order, items } });
        }
      );
    }
  );
};

export const getAllOrders = (req: AuthRequest, res: Response): void => {
  const { status, limit = 20, offset = 0 } = req.query;
  const db = database.getDb();

  let query = `
    SELECT o.*, u.email, u.first_name, u.last_name, COUNT(oi.id) as item_count 
    FROM orders o 
    JOIN users u ON o.user_id = u.id 
    LEFT JOIN order_items oi ON o.id = oi.order_id 
    WHERE 1=1
  `;
  const params: any[] = [];

  if (status) {
    query += ' AND o.status = ?';
    params.push(status);
  }

  query += ' GROUP BY o.id ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit as string), parseInt(offset as string));

  db.all(query, params, (err, orders) => {
    if (err) {
      res.status(500).json({ error: 'Database error' });
      return;
    }

    res.json({ orders });
  });
};

export const updateOrderStatus = (req: AuthRequest, res: Response): void => {
  const { id } = req.params;
  const { status } = req.body;
  const db = database.getDb();

  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    res.status(400).json({ error: 'Invalid status' });
    return;
  }

  db.run(
    'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [status, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: 'Failed to update order status' });
        return;
      }

      if (this.changes === 0) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      res.json({ message: 'Order status updated successfully' });
    }
  );
};