'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingCart } from 'lucide-react';
import { formatPriceFixed, toNumber } from '@/lib/utils';

const CartPage: React.FC = () => {
  const router = useRouter();
  const { items, removeItem, updateQuantity } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock product prices - in real app, would fetch from API
  const productPrices: Record<string, { name: string; price: number; image: string }> = {
    'product-1': { name: 'Premium Wireless Headphones', price: 299.99, image: '/products/headphones.jpg' },
    'product-2': { name: 'Smart Watch', price: 199.99, image: '/products/watch.jpg' },
    'product-3': { name: 'Ultra HD Camera', price: 1299.99, image: '/products/camera.jpg' },
  };

  const cartTotal = useMemo(() => {
    return items.reduce((total, item) => {
      const product = productPrices[item.productId] || { price: 0 };
      return total + product.price * item.quantity;
    }, 0);
  }, [items]);

  const subtotal = cartTotal;
  const tax = cartTotal * 0.08; // 8% tax
  const shipping = cartTotal > 0 ? (cartTotal > 100 ? 0 : 9.99) : 0;
  const total = subtotal + tax + shipping;

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container max-w-7xl mx-auto px-4 py-16">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <div className="text-center py-32">
            <ShoppingCart size={64} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Your cart is empty
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Start shopping to add items to your cart
            </p>
            <button
              onClick={() => router.push('/products')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => {
                const product = productPrices[item.productId] || { name: 'Unknown Product', price: 0, image: '' };
                return (
                  <div
                    key={`${item.productId}-${item.quantity}`}
                    className="flex gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                      {product.image && (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {product.name}
                      </h3>
                      <p className="text-lg font-bold text-blue-600">
                        ${formatPriceFixed(product.price)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                        className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="px-4 py-2 border-l border-r border-gray-300 dark:border-gray-600 min-w-12 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    {/* Total */}
                    <div className="text-right min-w-max">
                      <p className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                        ${formatPriceFixed(toNumber(product.price) * item.quantity)}
                      </p>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-red-600 hover:text-red-700 flex items-center gap-1"
                      >
                        <Trash2 size={18} />
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Continue Shopping */}
            <button
              onClick={() => router.push('/products')}
              className="mt-8 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              <ArrowLeft size={20} />
              Continue Shopping
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6 border-b border-gray-200 dark:border-gray-700 pb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>${formatPriceFixed(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600 dark:text-green-400">FREE</span>
                    ) : (
                      `$${formatPriceFixed(shipping)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax</span>
                  <span>${formatPriceFixed(tax)}</span>
                </div>
              </div>

              <div className="flex justify-between mb-8">
                <span className="text-xl font-bold text-gray-900 dark:text-white">Total</span>
                <span className="text-2xl font-bold text-blue-600">${formatPriceFixed(total)}</span>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg mb-3"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => router.push('/products')}
                className="w-full border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Continue Shopping
              </button>

              {/* Promo Code */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white mb-2"
                />
                <button className="w-full text-blue-600 hover:text-blue-700 font-semibold py-2">
                  Apply Code
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
