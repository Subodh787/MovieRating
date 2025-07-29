"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getAllProducts = void 0;
const express_validator_1 = require("express-validator");
const database_1 = __importDefault(require("../models/database"));
const getAllProducts = (req, res) => {
    const { category, featured, limit = 20, offset = 0 } = req.query;
    const db = database_1.default.getDb();
    let query = `
    SELECT p.*, c.name as category_name 
    FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id 
    WHERE 1=1
  `;
    const params = [];
    if (category) {
        query += ' AND c.name = ?';
        params.push(category);
    }
    if (featured === 'true') {
        query += ' AND p.featured = 1';
    }
    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    db.all(query, params, (err, products) => {
        if (err) {
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json({ products });
    });
};
exports.getAllProducts = getAllProducts;
const getProductById = (req, res) => {
    const { id } = req.params;
    const db = database_1.default.getDb();
    db.get(`SELECT p.*, c.name as category_name 
     FROM products p 
     LEFT JOIN categories c ON p.category_id = c.id 
     WHERE p.id = ?`, [id], (err, product) => {
        if (err) {
            res.status(500).json({ error: 'Database error' });
            return;
        }
        if (!product) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        res.json({ product });
    });
};
exports.getProductById = getProductById;
const createProduct = (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { name, description, price, categoryId, stockQuantity } = req.body;
    const db = database_1.default.getDb();
    db.run(`INSERT INTO products (name, description, price, category_id, stock_quantity) 
     VALUES (?, ?, ?, ?, ?)`, [name, description, price, categoryId, stockQuantity], function (err) {
        if (err) {
            res.status(500).json({ error: 'Failed to create product' });
            return;
        }
        res.status(201).json({
            message: 'Product created successfully',
            productId: this.lastID
        });
    });
};
exports.createProduct = createProduct;
const updateProduct = (req, res) => {
    const { id } = req.params;
    const { name, description, price, categoryId, stockQuantity, featured } = req.body;
    const db = database_1.default.getDb();
    db.run(`UPDATE products 
     SET name = ?, description = ?, price = ?, category_id = ?, 
         stock_quantity = ?, featured = ?, updated_at = CURRENT_TIMESTAMP 
     WHERE id = ?`, [name, description, price, categoryId, stockQuantity, featured, id], function (err) {
        if (err) {
            res.status(500).json({ error: 'Failed to update product' });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        res.json({ message: 'Product updated successfully' });
    });
};
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => {
    const { id } = req.params;
    const db = database_1.default.getDb();
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
exports.deleteProduct = deleteProduct;
const getCategories = (req, res) => {
    const db = database_1.default.getDb();
    db.all('SELECT * FROM categories ORDER BY name', [], (err, categories) => {
        if (err) {
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json({ categories });
    });
};
exports.getCategories = getCategories;
//# sourceMappingURL=productController.js.map