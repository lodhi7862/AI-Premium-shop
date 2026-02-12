'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useCheckAuth } from '@/features/auth/hooks';
import Link from 'next/link';
import { ArrowLeft, Printer } from 'lucide-react';
import { formatPriceFixed, toNumber } from '@/lib/utils';

const OrderDetailsPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const { user, isLoading: isAuthLoading } = useCheckAuth();
  const [selectedStatus, setSelectedStatus] = useState('');

  // Redirect if not admin
  React.useEffect(() => {
    if (!isAuthLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/');
    }
  }, [user, isAuthLoading, router]);

  // Fetch order
  const { data: orderData, isLoading: isOrderLoading, refetch } = useQuery({
    queryKey: ['admin-order', orderId],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/orders/${orderId}`);
      return response.data;
    },
    enabled: !!orderId && !!user && user.role === 'ADMIN',
  });

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      const response = await apiClient.patch(`/admin/orders/${orderId}`, { status });
      return response.data;
    },
    onSuccess: () => {
      refetch();
      setSelectedStatus('');
    },
  });

  const handleStatusUpdate = () => {
    if (selectedStatus && selectedStatus !== orderData?.data?.status) {
      updateStatusMutation.mutate(selectedStatus);
    }
  };

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200',
    PROCESSING: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
    SHIPPED: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200',
    DELIVERED: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
    CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
  };

  const paymentStatusColors: Record<string, string> = {
    PAID: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
    PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200',
    FAILED: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
  };

  if (isAuthLoading || isOrderLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN' || !orderData?.data) {
    return null;
  }

  const order = orderData.data;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/orders" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft size={20} />
            Back to Orders
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Order {order.orderNumber}</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg">
              <Printer size={18} />
              Print
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Order Status</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current Status</p>
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${statusColors[order.status] || ''}`}>
                    {order.status}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Update Status
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={selectedStatus || order.status}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                    <button
                      onClick={handleStatusUpdate}
                      disabled={updateStatusMutation.isPending || selectedStatus === order.status || !selectedStatus}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg"
                    >
                      {updateStatusMutation.isPending ? 'Updating...' : 'Update'}
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Payment Status</p>
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mt-2 ${paymentStatusColors[order.paymentStatus] || ''}`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Items</h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Product</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Price</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Quantity</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items?.map((item: any) => (
                      <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="px-4 py-4 text-gray-900 dark:text-white">{item.product?.name}</td>
                        <td className="px-4 py-4 text-gray-900 dark:text-white">${formatPriceFixed(item.price)}</td>
                        <td className="px-4 py-4 text-gray-900 dark:text-white">{item.quantity}</td>
                        <td className="px-4 py-4 text-right font-semibold text-gray-900 dark:text-white">
                          ${formatPriceFixed(toNumber(item.price) * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Customer Information</h2>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Name</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {order.user?.firstName} {order.user?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Email</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{order.user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Phone</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {order.user?.phoneNumber || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ${formatPriceFixed(toNumber(order.totalAmount) - (toNumber(order.shippingCost) || 0) - (toNumber(order.tax) || 0))}
                  </span>
                </div>
                {order.tax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tax</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${formatPriceFixed(toNumber(order.tax) || 0)}
                    </span>
                  </div>
                )}
                {order.shippingCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${formatPriceFixed(toNumber(order.shippingCost) || 0)}
                    </span>
                  </div>
                )}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between">
                  <span className="font-bold text-gray-900 dark:text-white">Total</span>
                  <span className="text-xl font-bold text-blue-600">${formatPriceFixed(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Shipping Address</h2>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                {order.shippingAddress || 'Address not provided'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
