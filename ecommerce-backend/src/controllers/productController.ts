import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import database from '../models/database';
import { AuthRequest } from '../middleware/auth';

export const getAllProducts = (req: Request, res: Response): void => {
  const { category, featured, limit = 20, offset = 0 } = req.query;
  const db = database.getDb();

  let query = `
    SELECT p.*, c.name as category_name 
    FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id 
    WHERE 1=1
  `;
  const params: any[] = [];

  if (category) {
    query += ' AND c.name = ?';
    params.push(category);
  }

  if (featured === 'true') {
    query += ' AND p.featured = 1';
  }

  query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit as string), parseInt(offset as string));

  db.all(query, params, (err, products) => {
    if (err) {
      res.status(500).json({ error: 'Database error' });
      return;
    }

    res.json({ products });
  });
};

export const getProductById = (req: Request, res: Response): void => {
  const { id } = req.params;
  const db = database.getDb();

  db.get(
    `SELECT p.*, c.name as category_name 
     FROM products p 
     LEFT JOIN categories c ON p.category_id = c.id 
     WHERE p.id = ?`,
    [id],
    (err, product) => {
      if (err) {
        res.status(500).json({ error: 'Database error' });
        return;
      }

      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      res.json({ product });
    }
  );
};

export const createProduct = (req: AuthRequest, res: Response): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { name, description, price, categoryId, stockQuantity } = req.body;
  const db = database.getDb();

  db.run(
    `INSERT INTO products (name, description, price, category_id, stock_quantity) 
     VALUES (?, ?, ?, ?, ?)`,
    [name, description, price, categoryId, stockQuantity],
    function (err) {
      if (err) {
        res.status(500).json({ error: 'Failed to create product' });
        return;
      }

      res.status(201).json({
        message: 'Product created successfully',
        productId: this.lastID
      });
    }
  );
};

export const updateProduct = (req: AuthRequest, res: Response): void => {
  const { id } = req.params;
  const { name, description, price, categoryId, stockQuantity, featured } = req.body;
  const db = database.getDb();

  db.run(
    `UPDATE products 
     SET name = ?, description = ?, price = ?, category_id = ?, 
         stock_quantity = ?, featured = ?, updated_at = CURRENT_TIMESTAMP 
     WHERE id = ?`,
    [name, description, price, categoryId, stockQuantity, featured, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: 'Failed to update product' });
        return;
      }

      if (this.changes === 0) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      res.json({ message: 'Product updated successfully' });
    }
  );
};

export const deleteProduct = (req: AuthRequest, res: Response): void => {
  const { id } = req.params;
  const db = database.getDb();

  db.run('DELETE FROM products WHERE id = ?', [id], function (err) {
    if (err) {
      res.status(500).json({ error: 'Failed to delete product' });
      return;
    }

    if (this.changes === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json({ message: 'Product deleted successfully' });
  });
};

export const getCategories = (req: Request, res: Response): void => {
  const db = database.getDb();

  db.all('SELECT * FROM categories ORDER BY name', [], (err, categories) => {
    if (err) {
      res.status(500).json({ error: 'Database error' });
      return;
    }

    res.json({ categories });
  });
};