'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useCheckAuth } from '@/features/auth/hooks';
import { BarChart3, Package, Users, ShoppingCart, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const { user, isLoading } = useCheckAuth();

  // Redirect if not admin
  React.useEffect(() => {
    if (!isLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Fetch dashboard stats
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/stats');
      return response.data;
    },
    enabled: !!user && user.role === 'ADMIN',
  });

  const statCards = [
    {
      icon: ShoppingCart,
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      change: '+12% this month',
      color: 'blue',
    },
    {
      icon: Package,
      title: 'Products',
      value: stats?.totalProducts || 0,
      change: '+5 this month',
      color: 'green',
    },
    {
      icon: Users,
      title: 'Customers',
      value: stats?.totalCustomers || 0,
      change: '+8% this month',
      color: 'purple',
    },
    {
      icon: BarChart3,
      title: 'Revenue',
      value: `$${stats?.totalRevenue?.toLocaleString() || '0'}`,
      change: '+18% this month',
      color: 'orange',
    },
  ];

  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200',
    green: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200',
    purple: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-200',
    orange: 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-200',
  };

  // Show loading state while auth is being initialized
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If not admin, the useEffect will handle the redirect
  // This prevents the page from rendering if not admin
  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here&apos;s an overview of your store.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${colorClasses[card.color]} mb-4`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">
                  {card.title}
                </h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {isStatsLoading ? 'Loading...' : card.value}
                </p>
                <p className="text-green-600 dark:text-green-400 text-sm font-semibold">
                  {card.change}
                </p>
              </div>
            );
          })}
        </div>

        {/* Navigation Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Products Management */}
          <Link
            href="/admin/products"
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition group"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Products
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage inventory and product listings
                </p>
              </div>
              <ArrowRight className="text-gray-400 group-hover:text-blue-600 transition" size={24} />
            </div>
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg">
                <Package className="text-green-600 dark:text-green-200" size={24} />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Total:</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.totalProducts || 0}
                </p>
              </div>
            </div>
          </Link>

          {/* Orders Management */}
          <Link
            href="/admin/orders"
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition group"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Orders
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Track and manage customer orders
                </p>
              </div>
              <ArrowRight className="text-gray-400 group-hover:text-blue-600 transition" size={24} />
            </div>
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <ShoppingCart className="text-blue-600 dark:text-blue-200" size={24} />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Total:</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.totalOrders || 0}
                </p>
              </div>
            </div>
          </Link>

          {/* Users Management */}
          <Link
            href="/admin/users"
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition group"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Customers
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage customer accounts and data
                </p>
              </div>
              <ArrowRight className="text-gray-400 group-hover:text-blue-600 transition" size={24} />
            </div>
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Users className="text-purple-600 dark:text-purple-200" size={24} />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Total:</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.totalCustomers || 0}
                </p>
              </div>
            </div>
          </Link>

          {/* Settings */}
          <Link
            href="/admin/settings"
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition group"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Settings
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Configure store settings and preferences
                </p>
              </div>
              <ArrowRight className="text-gray-400 group-hover:text-blue-600 transition" size={24} />
            </div>
            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <BarChart3 className="text-orange-600 dark:text-orange-200" size={24} />
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Recent Activity
          </h2>

          {isLoading ? (
            <p className="text-gray-600 dark:text-gray-400">Loading activity...</p>
          ) : stats?.recentActivity?.length ? (
            <div className="space-y-4">
              {stats.recentActivity.map((activity: any, idx: number) => (
                <div key={idx} className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                    <ShoppingCart className="text-blue-600 dark:text-blue-200" size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-white font-semibold">
                      {activity.description}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
