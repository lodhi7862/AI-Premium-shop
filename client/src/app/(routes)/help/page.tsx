'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, HelpCircle, ShoppingCart, Truck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const HelpPage: React.FC = () => {
  const router = useRouter();

  const helpCategories = [
    {
      icon: ShoppingCart,
      title: 'Orders & Purchases',
      description: 'Learn about placing, tracking, and managing your orders',
      topics: ['Placing an order', 'Payment methods', 'Order status', 'Cancellations'],
    },
    {
      icon: Truck,
      title: 'Shipping & Delivery',
      description: 'Get information about shipping, tracking, and delivery',
      topics: ['Shipping costs', 'Delivery times', 'Tracking orders', 'Address changes'],
    },
    {
      icon: BookOpen,
      title: 'Returns & Refunds',
      description: 'Understand our return policy and refund process',
      topics: ['Return policy', 'How to return', 'Refund status', 'Exchanges'],
    },
    {
      icon: HelpCircle,
      title: 'Account & Security',
      description: 'Manage your account and ensure your data is secure',
      topics: ['Create account', 'Password reset', 'Privacy', 'Security'],
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
          Help Center
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-12">
          Find answers and get support for your questions
        </p>

        {/* Search Bar */}
        <div className="mb-12 max-w-2xl">
          <input
            type="text"
            placeholder="Search for help..."
            className="w-full px-6 py-4 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white text-lg focus:outline-none focus:border-blue-600"
          />
        </div>

        {/* Help Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {helpCategories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.title}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Icon className="text-blue-600 dark:text-blue-200" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {category.title}
                  </h3>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {category.description}
                </p>

                <ul className="space-y-3 mb-6">
                  {category.topics.map((topic) => (
                    <li key={topic} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      <span className="text-gray-700 dark:text-gray-300">{topic}</span>
                    </li>
                  ))}
                </ul>

                <button className="w-full text-blue-600 hover:text-blue-700 font-semibold py-2 border border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition">
                  Learn More
                </button>
              </div>
            );
          })}
        </div>

        {/* Quick Links */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Popular Help Topics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'How to place an order',
              'Track my package',
              'Return an item',
              'Reset password',
            ].map((topic) => (
              <button
                key={topic}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg text-center hover:bg-blue-100 dark:hover:bg-blue-900/40 transition font-semibold text-gray-700 dark:text-gray-300"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Still need help?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Our support team is available to assist you
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/contact"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg"
            >
              Contact Support
            </Link>
            <Link
              href="/faq"
              className="border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold py-3 px-8 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              View FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
