'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useCheckAuth } from '@/features/auth/hooks';
import Link from 'next/link';
import { ArrowLeft, Eye, Printer } from 'lucide-react';
import { formatPriceFixed } from '@/lib/utils';

const AdminOrdersPage: React.FC = () => {
  const router = useRouter();
  const { user, isLoading } = useCheckAuth();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  // Redirect if not admin
  React.useEffect(() => {
    if (!isLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Fetch orders
  const { data: ordersResponse, isLoading: isOrdersLoading } = useQuery({
    queryKey: ['admin-orders', { page, status: statusFilter }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      params.append('page', page.toString());
      params.append('limit', '10');

      const response = await apiClient.get(`/admin/orders?${params.toString()}`);
      return response.data;
    },
  });

  if (isOrdersLoading) {
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

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200',
    PROCESSING: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
    SHIPPED: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200',
    DELIVERED: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
    CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft size={20} />
            Back
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Orders Management
          </h1>
        </div>

        {/* Filter */}
        <div className="mb-8">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All Orders</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Orders Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {isOrdersLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-600 dark:text-gray-400">Loading orders...</div>
            </div>
          ) : ordersResponse?.data?.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 dark:text-gray-400">No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">
                      Payment
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ordersResponse?.data?.map((order: any) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-gray-900 dark:text-white">
                            {order.user?.firstName} {order.user?.lastName}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {order.user?.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        ${formatPriceFixed(order.totalAmount)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            statusColors[order.status] ||
                            'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            order.paymentStatus === 'PAID'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Eye size={18} />
                          </Link>
                          <button className="text-gray-600 hover:text-gray-700">
                            <Printer size={18} />
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
        {ordersResponse?.data?.length > 0 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
