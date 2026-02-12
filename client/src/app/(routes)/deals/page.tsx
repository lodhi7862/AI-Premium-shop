'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Clock, ArrowLeft } from 'lucide-react';

const DealsPage: React.FC = () => {
  const router = useRouter();

  const deals = [
    {
      title: 'Summer Flash Sale',
      discount: '50% OFF',
      description: 'Selected Electronics',
      timeLeft: '2 days',
      color: 'from-orange-400 to-red-500',
    },
    {
      title: 'Weekly Deals',
      discount: '30% OFF',
      description: 'Fashion & Accessories',
      timeLeft: '5 days',
      color: 'from-pink-400 to-purple-500',
    },
    {
      title: 'Clearance Sale',
      discount: '40% OFF',
      description: 'Home & Garden',
      timeLeft: '7 days',
      color: 'from-blue-400 to-indigo-500',
    },
    {
      title: 'Bundle Offers',
      discount: 'Save $99',
      description: 'Buy 2 Get Free Shipping',
      timeLeft: '10 days',
      color: 'from-green-400 to-emerald-500',
    },
  ];

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

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Deals & Offers
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-12">
          Don't miss out on our amazing deals and exclusive offers
        </p>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {deals.map((deal, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-r ${deal.color} rounded-lg p-8 text-white cursor-pointer hover:shadow-xl transition group overflow-hidden relative`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-3xl font-bold mb-2">{deal.title}</h3>
                    <p className="text-white/80">{deal.description}</p>
                  </div>
                  <Zap className="flex-shrink-0" size={32} />
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-5xl font-bold mb-2">{deal.discount}</p>
                    <p className="flex items-center gap-2 text-white/80">
                      <Clock size={18} />
                      {deal.timeLeft} left
                    </p>
                  </div>
                  <button
                    onClick={() => router.push('/products')}
                    className="bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-6 rounded-lg backdrop-blur transition"
                  >
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Products Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Featured Deal Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((product) => (
              <div
                key={product}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Premium Product {product}
                  </h4>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-through">
                        $199.99
                      </p>
                      <p className="text-xl font-bold text-red-600">$99.99</p>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealsPage;
