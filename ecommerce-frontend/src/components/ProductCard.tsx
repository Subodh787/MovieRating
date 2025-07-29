import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { Product } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showMessage, setShowMessage] = useState('');
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = async () => {
    if (!user) {
      setShowMessage('Please login to add items to cart');
      setTimeout(() => setShowMessage(''), 3000);
      return;
    }

    try {
      setIsLoading(true);
      await addToCart(product.id, 1);
      setShowMessage('Added to cart!');
      setTimeout(() => setShowMessage(''), 3000);
    } catch (error: any) {
      setShowMessage(error.message || 'Failed to add to cart');
      setTimeout(() => setShowMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={product.image || '/api/placeholder/300/200'}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {product.featured && (
          <span className="absolute top-2 left-2 bg-primary-600 text-white px-2 py-1 text-xs rounded-md">
            Featured
          </span>
        )}
        {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
          <span className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 text-xs rounded-md">
            Low Stock
          </span>
        )}
        {product.stock_quantity === 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded-md">
            Out of Stock
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            <Link 
              to={`/product/${product.id}`}
              className="hover:text-primary-600 transition-colors"
            >
              {product.name}
            </Link>
          </h3>
          {product.category_name && (
            <p className="text-sm text-gray-500">{product.category_name}</p>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary-600">
            ${product.price.toFixed(2)}
          </span>
          
          <button
            onClick={handleAddToCart}
            disabled={isLoading || product.stock_quantity === 0}
            className="flex items-center space-x-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCartIcon className="h-4 w-4" />
            <span>{isLoading ? 'Adding...' : 'Add to Cart'}</span>
          </button>
        </div>

        {showMessage && (
          <div className={`mt-2 text-sm text-center ${
            showMessage.includes('Failed') || showMessage.includes('login') 
              ? 'text-red-600' 
              : 'text-green-600'
          }`}>
            {showMessage}
          </div>
        )}

        <div className="mt-2 text-sm text-gray-500">
          {product.stock_quantity > 0 ? (
            <span>{product.stock_quantity} in stock</span>
          ) : (
            <span className="text-red-500">Out of stock</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;