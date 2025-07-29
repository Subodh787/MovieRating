"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = __importDefault(require("sqlite3"));
const fs_1 = __importDefault(require("fs"));
const dbPath = process.env.DB_PATH || './ecommerce.db';
// Ensure uploads directory exists
const uploadPath = process.env.UPLOAD_PATH || './uploads';
if (!fs_1.default.existsSync(uploadPath)) {
    fs_1.default.mkdirSync(uploadPath, { recursive: true });
}
class Database {
    constructor() {
        this.db = new sqlite3_1.default.Database(dbPath, (err) => {
            if (err) {
                console.error('Error opening database:', err.message);
            }
            else {
                console.log('Connected to SQLite database');
                this.initializeTables();
            }
        });
    }
    initializeTables() {
        const queries = [
            // Users table
            `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        role TEXT DEFAULT 'customer',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
            // Categories table
            `CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        description TEXT,
        image TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
            // Products table
            `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        category_id INTEGER,
        stock_quantity INTEGER DEFAULT 0,
        image TEXT,
        images TEXT, -- JSON array of image paths
        featured BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories (id)
      )`,
            // Orders table
            `CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        status TEXT DEFAULT 'pending',
        shipping_address TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`,
            // Order items table
            `CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders (id),
        FOREIGN KEY (product_id) REFERENCES products (id)
      )`,
            // Shopping cart table
            `CREATE TABLE IF NOT EXISTS cart_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (product_id) REFERENCES products (id),
        UNIQUE(user_id, product_id)
      )`
        ];
        queries.forEach((query) => {
            this.db.run(query, (err) => {
                if (err) {
                    console.error('Error creating table:', err.message);
                }
            });
        });
        // Insert sample data
        this.insertSampleData();
    }
    insertSampleData() {
        // Insert sample categories
        const categories = [
            { name: 'Electronics', description: 'Electronic devices and gadgets' },
            { name: 'Clothing', description: 'Fashion and apparel' },
            { name: 'Books', description: 'Books and literature' },
            { name: 'Home & Garden', description: 'Home improvement and garden supplies' }
        ];
        categories.forEach(category => {
            this.db.run('INSERT OR IGNORE INTO categories (name, description) VALUES (?, ?)', [category.name, category.description]);
        });
        // Insert sample products
        const products = [
            {
                name: 'Smartphone X1',
                description: 'Latest smartphone with advanced features',
                price: 699.99,
                category_id: 1,
                stock_quantity: 50,
                featured: 1
            },
            {
                name: 'Laptop Pro',
                description: 'High-performance laptop for professionals',
                price: 1299.99,
                category_id: 1,
                stock_quantity: 30,
                featured: 1
            },
            {
                name: 'Casual T-Shirt',
                description: 'Comfortable cotton t-shirt',
                price: 24.99,
                category_id: 2,
                stock_quantity: 100,
                featured: 0
            },
            {
                name: 'Programming Guide',
                description: 'Complete guide to modern programming',
                price: 49.99,
                category_id: 3,
                stock_quantity: 25,
                featured: 1
            }
        ];
        products.forEach(product => {
            this.db.run(`INSERT OR IGNORE INTO products 
         (name, description, price, category_id, stock_quantity, featured) 
         VALUES (?, ?, ?, ?, ?, ?)`, [product.name, product.description, product.price, product.category_id, product.stock_quantity, product.featured]);
        });
        // Create admin user
        const bcrypt = require('bcryptjs');
        const adminPassword = bcrypt.hashSync('admin123', 10);
        this.db.run(`INSERT OR IGNORE INTO users 
       (email, password, first_name, last_name, role) 
       VALUES (?, ?, ?, ?, ?)`, ['admin@ecommerce.com', adminPassword, 'Admin', 'User', 'admin']);
    }
    getDb() {
        return this.db;
    }
    close() {
        this.db.close((err) => {
            if (err) {
                console.error('Error closing database:', err.message);
            }
            else {
                console.log('Database connection closed');
            }
        });
    }
}
exports.default = new Database();
//# sourceMappingURL=database.js.map