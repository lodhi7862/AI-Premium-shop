'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useCheckAuth } from '@/features/auth/hooks';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit, Trash2, Search } from 'lucide-react';
import { formatPriceFixed } from '@/lib/utils';

const AdminProductsPage: React.FC = () => {
  const router = useRouter();
  const { user, isLoading } = useCheckAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  // Redirect if not admin
  React.useEffect(() => {
    if (!isLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Fetch products
  const ITEMS_PER_PAGE = 10;
  const { data: productsResponse, isLoading: isProductsLoading, refetch } = useQuery({
    queryKey: ['admin-products', { search: searchQuery, page }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      const skip = (page - 1) * ITEMS_PER_PAGE;
      params.append('skip', skip.toString());
      params.append('take', ITEMS_PER_PAGE.toString());

      const response = await apiClient.get(`/admin/products?${params.toString()}`);
      return response.data;
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      await apiClient.delete(`/admin/products/${productId}`);
    },
    onSuccess: () => {
      refetch();
    },
  });

  const handleDelete = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(productId);
    }
  };

  if (isProductsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/admin"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
            >
              <ArrowLeft size={20} />
              Back
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Products Management
            </h1>
          </div>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg"
          >
            <Plus size={20} />
            Add Product
          </Link>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
            <Search className="absolute right-3 top-3 text-gray-400" size={20} />
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {isProductsLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-600 dark:text-gray-400">Loading products...</div>
            </div>
          ) : productsResponse?.data?.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 dark:text-gray-400">No products found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">
                      SKU
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {productsResponse?.data?.map((product: any) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {product.category?.name}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white">
                        {product.sku}
                      </td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">
                        ${formatPriceFixed(product.price)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            product.stock > 0
                              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            product.active
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {product.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            disabled={deleteProductMutation.isPending}
                            className="text-red-600 hover:text-red-700 disabled:opacity-50"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {productsResponse?.data?.length > 0 && (
          <div className="mt-8 flex justify-center gap-2">
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
        )}
      </div>
    </div>
  );
};

export default AdminProductsPage;
