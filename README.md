# E-Commerce Application

A full-stack e-commerce application built with React (TypeScript) frontend and Node.js (Express + TypeScript) backend with SQLite database.

## Features

### Frontend
- **Modern React App** with TypeScript and Tailwind CSS
- **Responsive Design** that works on desktop and mobile
- **User Authentication** (login/register)
- **Product Catalog** with search and filtering
- **Shopping Cart** functionality
- **Order Management** for customers
- **Admin Panel** for product and order management
- **Context API** for state management

### Backend
- **RESTful API** built with Express.js and TypeScript
- **SQLite Database** with proper schema design
- **JWT Authentication** for secure user sessions
- **Input Validation** with express-validator
- **Error Handling** and security middleware
- **File Upload** support for product images
- **CORS** enabled for frontend integration

### Core Functionality
- User registration and authentication
- Product browsing with categories and search
- Shopping cart management
- Order placement and tracking
- Admin dashboard for product/order management
- Responsive design for all devices

## Project Structure

```
/workspace/
├── ecommerce-backend/          # Node.js API server
│   ├── src/
│   │   ├── controllers/        # Route controllers
│   │   ├── middleware/         # Authentication & validation
│   │   ├── models/            # Database models
│   │   ├── routes/            # API routes
│   │   ├── utils/             # Utility functions
│   │   └── server.ts          # Main server file
│   ├── uploads/               # File uploads directory
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
└── ecommerce-frontend/         # React frontend app
    ├── src/
    │   ├── components/         # Reusable components
    │   ├── context/           # React Context providers
    │   ├── pages/             # Page components
    │   ├── utils/             # API utilities
    │   └── App.tsx            # Main app component
    ├── public/
    ├── package.json
    └── tailwind.config.js
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd ecommerce-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ecommerce-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/categories` - Get all categories
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart
- `GET /api/cart` - Get user's cart (protected)
- `POST /api/cart/add` - Add item to cart (protected)
- `PUT /api/cart/:id` - Update cart item (protected)
- `DELETE /api/cart/:id` - Remove cart item (protected)
- `DELETE /api/cart` - Clear cart (protected)

### Orders
- `POST /api/orders` - Create order (protected)
- `GET /api/orders/my-orders` - Get user's orders (protected)
- `GET /api/orders/:id` - Get order by ID (protected)
- `GET /api/orders` - Get all orders (admin only)
- `PUT /api/orders/:id/status` - Update order status (admin only)

## Database Schema

### Users
- id, email, password, first_name, last_name, role, created_at, updated_at

### Categories
- id, name, description, image, created_at

### Products
- id, name, description, price, category_id, stock_quantity, image, images, featured, created_at, updated_at

### Orders
- id, user_id, total_amount, status, shipping_address, created_at, updated_at

### Order Items
- id, order_id, product_id, quantity, price

### Cart Items
- id, user_id, product_id, quantity, created_at

## Demo Credentials

**Admin Account:**
- Email: admin@ecommerce.com
- Password: admin123

You can also register a new customer account through the frontend.

## Sample Data

The application comes pre-loaded with:
- 4 product categories (Electronics, Clothing, Books, Home & Garden)
- Sample products in each category
- Admin user account

## Technologies Used

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- Heroicons for icons
- Context API for state management

### Backend
- Node.js with Express.js
- TypeScript
- SQLite database
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation
- CORS, Helmet, Morgan for security and logging

## Available Scripts

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DB_PATH=./ecommerce.db
UPLOAD_PATH=./uploads
```

### Frontend (.env.local)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Production Deployment

1. Build both frontend and backend:
   ```bash
   cd ecommerce-backend && npm run build
   cd ../ecommerce-frontend && npm run build
   ```

2. Serve the frontend build files through your web server
3. Deploy the backend to your preferred hosting service
4. Update environment variables for production

## Features Implemented

✅ User Authentication (Register/Login/JWT)  
✅ Product Catalog with Categories  
✅ Shopping Cart Functionality  
✅ Order Management System  
✅ Admin Panel for Products/Orders  
✅ Responsive UI with Tailwind CSS  
✅ RESTful API with TypeScript  
✅ SQLite Database with Proper Schema  
✅ Input Validation and Error Handling  
✅ Security Middleware (CORS, Helmet, etc.)  

## Future Enhancements

- Payment integration (Stripe, PayPal)
- Product reviews and ratings
- Inventory management
- Email notifications
- Advanced search and filtering
- Wishlist functionality
- Multi-image upload for products
- Order tracking with status updates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.