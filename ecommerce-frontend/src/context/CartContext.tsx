import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, cartAPI } from '../utils/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateCartItem: (id: number, quantity: number) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartCount: () => number;
  loading: boolean;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();

  const refreshCart = async () => {
    if (!token) {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      const response = await cartAPI.get();
      setCartItems(response.data.cartItems || []);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [token]);

  const addToCart = async (productId: number, quantity: number) => {
    try {
      setLoading(true);
      await cartAPI.addItem({ productId, quantity });
      await refreshCart();
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (id: number, quantity: number) => {
    try {
      setLoading(true);
      await cartAPI.updateItem(id, { quantity });
      await refreshCart();
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update cart item');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (id: number) => {
    try {
      setLoading(true);
      await cartAPI.removeItem(id);
      await refreshCart();
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to remove item from cart');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await cartAPI.clear();
      setCartItems([]);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to clear cart');
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
    loading,
    refreshCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};