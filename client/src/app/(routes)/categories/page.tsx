'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const CategoriesPage: React.FC = () => {
  const router = useRouter();

  const categories = [
    { name: 'Electronics', count: 120, image: '📱' },
    { name: 'Fashion', count: 85, image: '👕' },
    { name: 'Home & Garden', count: 65, image: '🏠' },
    { name: 'Sports & Outdoors', count: 50, image: '⚽' },
    { name: 'Books & Media', count: 40, image: '📚' },
    { name: 'Toys & Games', count: 35, image: '🎮' },
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
          Shop by Category
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-12">
          Explore our wide range of products across different categories
        </p>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => router.push(`/products?category=${category.name.toLowerCase()}`)}
              className="group text-left"
            >
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-12 text-center mb-4 group-hover:shadow-lg transition">
                <span className="text-6xl">{category.image}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600">
                {category.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {category.count} products
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
