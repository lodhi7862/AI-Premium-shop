/**
 * Product Card Component
 * Displays a single product with image, price, rating, and actions
 */

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { Button } from '@/shared/components/ui';
import { formatPriceFixed, toNumber } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetails }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageError, setImageError] = useState(false);

  const discountPercentage =
    product.originalPrice && toNumber(product.originalPrice) > toNumber(product.price)
      ? Math.round(
          ((toNumber(product.originalPrice) - toNumber(product.price)) /
            toNumber(product.originalPrice)) *
            100
        )
      : 0;

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col"
    >
      {/* Image Container */}
      <div className="relative h-64 bg-gray-200 overflow-hidden">
        {product.images && product.images.length > 0 && !imageError ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            unoptimized={product.images[0].startsWith('http')}
            onError={() => setImageError(true)}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-600">
            <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75-3.54c-.3-.38-.77-.59-1.25-.59-.48 0-.95.21-1.25.59L6.5 12.1c-.3.38-.3.98 0 1.36l3.75 4.84c.3.38.77.59 1.25.59.48 0 .95-.21 1.25-.59L17.9 7.62c.3-.38.3-.98 0-1.36l-3.94-5.84z" />
            </svg>
          </div>
        )}

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            -{discountPercentage}%
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorited(!isFavorited)}
          className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition"
        >
          <svg
            className={`w-6 h-6 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Stock Status */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-4 flex-grow flex flex-col">
        {/* Category */}
        <p className="text-sm text-gray-500 mb-2">{product.category.name}</p>

        {/* Product Name */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">{product.description}</p>

        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex text-yellow-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'fill-gray-300'}`}
                viewBox="0 0 24 24"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold text-gray-900">${formatPriceFixed(product.price)}</span>
          {product.originalPrice && (
            <span className="text-lg text-gray-500 line-through">${formatPriceFixed(product.originalPrice)}</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <div className="flex gap-2">
          <Button
            onClick={() => onAddToCart?.(product)}
            disabled={product.stock === 0}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
          <Button
            onClick={() => onViewDetails?.(product)}
            variant="outline"
            className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900"
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
