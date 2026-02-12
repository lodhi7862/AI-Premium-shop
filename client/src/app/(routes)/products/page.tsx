'use client';

import React, { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Product } from '@/types';
import { ProductCard } from '@/features/products/components';
import { useCartStore } from '@/store';
import { Search } from 'lucide-react';

const ProductsPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem } = useCartStore();

  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams?.get('category') || '');
  const [sortBy, setSortBy] = useState(searchParams?.get('sort') || 'newest');
  const [page, setPage] = useState(1);

  // Fetch products
  const ITEMS_PER_PAGE = 12;
  const { data: productsResponse, isLoading, isError } = useQuery({
    queryKey: ['products', { searchQuery, selectedCategory, sortBy, page }],
    queryFn: async () => {
      const params = new URLSearchParams();
      const skip = (page - 1) * ITEMS_PER_PAGE;
      params.append('skip', skip.toString());
      params.append('take', ITEMS_PER_PAGE.toString());

      // If a category is selected, use the category endpoint
      if (selectedCategory) {
        const response = await apiClient.get(`products/category/${selectedCategory}?${params.toString()}`);
        return response.data;
      }

      // Use search endpoint if search query exists
      if (searchQuery) {
        params.append('q', searchQuery);
        const response = await apiClient.get(`products/search?${params.toString()}`);
        return response.data;
      }

      // Default endpoint
      const response = await apiClient.get(`products?${params.toString()}`);
      return response.data;
    },
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await apiClient.get('products/categories');
      return response.data;
    },
  });

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setPage(1);
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (selectedCategory) params.append('category', selectedCategory);
      router.push(`/products?${params.toString()}`);
    },
    [searchQuery, selectedCategory, router]
  );

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      quantity: 1,
      addedAt: new Date(),
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Search and Filter Section */}
      <div className="bg-gray-50 dark:bg-gray-800 py-8">
        <div className="container max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Products
          </h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                <Search className="absolute right-3 top-3 text-gray-400" size={20} />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Categories</option>
                {categories?.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
              </select>
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container max-w-7xl mx-auto px-4 py-16">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-gray-600 dark:text-gray-400">Loading products...</div>
          </div>
        ) : isError ? (
          <div className="text-center py-16">
            <p className="text-red-600 dark:text-red-400">Error loading products</p>
          </div>
        ) : productsResponse?.data?.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              No products found. Try adjusting your filters.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {productsResponse?.data?.map((product: Product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => handleAddToCart(product)}
                  onViewDetails={() => router.push(`/products/${product.id}`)}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-16 flex justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">Page {page} of {productsResponse?.totalPages || 1}</span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= (productsResponse?.totalPages || 1)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
