'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

const CheckoutSuccessPage: React.FC = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get('orderId');

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Success Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-green-400 rounded-full animate-pulse opacity-20"></div>
            <div className="relative w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <CheckCircle className="text-green-600 dark:text-green-200" size={48} />
            </div>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Order Confirmed!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
          Thank you for your purchase. Your order has been successfully placed and we're getting
          it ready for shipment.
        </p>

        {/* Order Details */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 mb-8">
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Order Number</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white font-mono">
              {orderId || 'ORD-2024-001'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Order Date</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {new Date().toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Estimated Delivery</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8 text-left">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Package size={20} />
            What's Next?
          </h3>
          <ol className="space-y-3 text-gray-600 dark:text-gray-400">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                1
              </span>
              <span>We'll send you a confirmation email shortly</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                2
              </span>
              <span>Your order will be prepared and packed by our team</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                3
              </span>
              <span>You'll receive a tracking number via email when it ships</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                4
              </span>
              <span>Your package will arrive shortly after shipment</span>
            </li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/profile"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
          >
            View Order Details
            <ArrowRight size={20} />
          </Link>
          <Link
            href="/products"
            className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Support Message */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-8">
          Have questions?{' '}
          <Link href="/contact" className="text-blue-600 hover:text-blue-700 font-semibold">
            Contact our support team
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
