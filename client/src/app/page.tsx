/**
 * Homepage
 */

'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { HeroSection } from '@/shared/components/layout';
import { ProductCard } from '@/features/products/components';
import { apiClient } from '@/lib/api-client';
import { Product } from '@/types';
import { useCartStore } from '@/store';

const HomePage: React.FC = () => {
  const { addItem } = useCartStore();

  // Fetch featured products
  const { data: products, isLoading } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const response = await apiClient.get<{ data: Product[] }>('products?skip=0&take=8&featured=true');
      return response.data.data;
    },
  });

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      quantity: 1,
      addedAt: new Date(),
    });

    // Show toast notification
    console.log(`Added ${product.name} to cart`);
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Products Section */}
      <section className="py-20 bg-gray-50 dark:bg-brand-secondary">
        <div className="container-custom">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Discover our carefully curated collection of premium items
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-96 animate-pulse" />
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">No products available</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🤖',
                title: 'AI-Powered',
                description: 'Smart recommendations and personalized shopping experience',
              },
              {
                icon: '⚡',
                title: 'Lightning Fast',
                description: 'Ultra-fast search and checkout experience',
              },
              {
                icon: '🛡️',
                title: 'Secure & Safe',
                description: 'Enterprise-grade security for your peace of mind',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-8 bg-white dark:bg-brand-secondary rounded-lg shadow-md hover:shadow-xl transition-shadow"
              >
                <p className="text-4xl mb-4">{feature.icon}</p>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
