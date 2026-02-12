'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useParams } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { useCartStore } from '@/store';
import { Star, ShoppingCart, ArrowLeft } from 'lucide-react';
import { formatPriceFixed } from '@/lib/utils';

const ProductDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { addItem } = useCartStore();
  const productId = params?.id as string;

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);

  // Fetch product details
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['products', productId],
    queryFn: async () => {
      const response = await apiClient.get(`products/${productId}`);
      return response.data;
    },
    enabled: !!productId,
  });

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      addItem({
        productId: product.id,
        quantity,
        variantId: selectedVariant || undefined,
        addedAt: new Date(),
      });
      // Show success feedback
      setTimeout(() => {
        router.push('/cart');
      }, 1000);
    } finally {
      setAddingToCart(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-xl text-gray-600 dark:text-gray-400">Loading product...</div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 dark:text-red-400">Product not found</p>
      </div>
    );
  }

  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="flex flex-col gap-4">
            <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden h-96">
              {product.images?.[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No image available
                </div>
              )}
              {discount > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-lg font-semibold">
                  -{discount}%
                </div>
              )}
            </div>

            {/* Product thumbnails */}
            <div className="flex gap-2">
              {product.images?.slice(0, 4).map((img: string, idx: number) => (
                <button
                  key={idx}
                  className="w-20 h-20 rounded-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden hover:border-blue-600"
                >
                  <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={
                      i < Math.round(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }
                  />
                ))}
              </div>
              <span className="text-gray-600 dark:text-gray-400">
                {product.reviewCount} reviews
              </span>
            </div>

            {/* Price */}
            <div className="mb-8">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  ${product.discountPrice ? formatPriceFixed(product.discountPrice) : formatPriceFixed(product.price)}
                </span>
                {product.discountPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    ${formatPriceFixed(product.price)}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
              {product.description}
            </p>

            {/* Variants */}
            {product.variants?.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Choose Options
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant: any) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant.id)}
                      className={`px-4 py-2 rounded-lg border-2 font-semibold transition ${
                        selectedVariant === variant.id
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900 text-blue-600'
                          : 'border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:border-blue-600'
                      }`}
                    >
                      {variant.name}: {variant.value}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-8">
              {product.stock > 0 ? (
                <p className="text-green-600 dark:text-green-400 font-semibold">
                  In Stock ({product.stock} available)
                </p>
              ) : (
                <p className="text-red-600 dark:text-red-400 font-semibold">Out of Stock</p>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex gap-4 mb-8">
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center border-l border-r border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addingToCart}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>

            {/* Sharing and Additional Info */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <dl className="space-y-4">
                <div className="flex justify-between">
                  <dt className="text-gray-600 dark:text-gray-400">SKU</dt>
                  <dd className="font-semibold text-gray-900 dark:text-white">{product.sku}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600 dark:text-gray-400">Category</dt>
                  <dd className="font-semibold text-gray-900 dark:text-white">
                    {product.category?.name || 'N/A'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
