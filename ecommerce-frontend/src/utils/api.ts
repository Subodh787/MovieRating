import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  category_name?: string;
  stock_quantity: number;
  image?: string;
  images?: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  name: string;
  price: number;
  image?: string;
  stock_quantity: number;
  created_at: string;
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  shipping_address: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  item_count?: number;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  name: string;
  image?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string;
  created_at: string;
}

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; firstName: string; lastName: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getProfile: () =>
    api.get('/auth/profile'),
};

// Products API
export const productsAPI = {
  getAll: (params?: { category?: string; featured?: boolean; limit?: number; offset?: number }) =>
    api.get('/products', { params }),
  getById: (id: number) =>
    api.get(`/products/${id}`),
  getCategories: () =>
    api.get('/products/categories'),
  create: (data: Partial<Product>) =>
    api.post('/products', data),
  update: (id: number, data: Partial<Product>) =>
    api.put(`/products/${id}`, data),
  delete: (id: number) =>
    api.delete(`/products/${id}`),
};

// Cart API
export const cartAPI = {
  get: () =>
    api.get('/cart'),
  addItem: (data: { productId: number; quantity: number }) =>
    api.post('/cart/add', data),
  updateItem: (id: number, data: { quantity: number }) =>
    api.put(`/cart/${id}`, data),
  removeItem: (id: number) =>
    api.delete(`/cart/${id}`),
  clear: () =>
    api.delete('/cart'),
};

// Orders API
export const ordersAPI = {
  create: (data: { items: { productId: number; quantity: number }[]; shippingAddress: string }) =>
    api.post('/orders', data),
  getUserOrders: () =>
    api.get('/orders/my-orders'),
  getById: (id: number) =>
    api.get(`/orders/${id}`),
  getAll: (params?: { status?: string; limit?: number; offset?: number }) =>
    api.get('/orders', { params }),
  updateStatus: (id: number, data: { status: string }) =>
    api.put(`/orders/${id}/status`, data),
};

export default api;