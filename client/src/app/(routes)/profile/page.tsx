'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useCheckAuth } from '@/features/auth/hooks';
import { User, LogOut, History, Settings } from 'lucide-react';
import { formatPriceFixed } from '@/lib/utils';

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useCheckAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: '',
  });

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // Fetch user profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await apiClient.get('/users/profile');
      return response.data;
    },
    enabled: !!user,
  });

  // Fetch user orders
  const { data: orders } = useQuery({
    queryKey: ['user-orders'],
    queryFn: async () => {
      const response = await apiClient.get('/orders/my-orders');
      return response.data;
    },
    enabled: !!user,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiClient.patch('/users/profile', data);
      return response.data;
    },
    onSuccess: () => {
      setEditing(false);
    },
  });

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-xl text-gray-600 dark:text-gray-400">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            My Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your profile and view your orders
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              {/* Profile Avatar */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                  <User className="text-blue-600" size={40} />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
              </div>

              {/* Menu Items */}
              <nav className="space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 font-semibold">
                  <Settings size={20} />
                  Profile Settings
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <History size={20} />
                  Order History
                </button>
              </nav>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold mt-6"
              >
                <LogOut size={20} />
                Sign Out
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {/* Profile Information */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Profile Information
                </h2>
                <button
                  onClick={() => setEditing(!editing)}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  {editing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {editing ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateProfileMutation.mutate(formData);
                  }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, firstName: e.target.value }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, email: e.target.value }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg w-full"
                  >
                    {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">First Name</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {profile?.firstName || user.firstName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Last Name</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {profile?.lastName || user.lastName}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {profile?.email || user.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {profile?.phoneNumber || 'Not provided'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Orders */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Recent Orders
              </h2>

              {orders && orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                          Order ID
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                          Total
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order: any) => (
                        <tr key={order.id} className="border-b border-gray-200 dark:border-gray-700">
                          <td className="px-4 py-3 text-gray-900 dark:text-white">
                            {order.orderNumber}
                          </td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                            ${formatPriceFixed(order.totalAmount)}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                order.status === 'DELIVERED'
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                                  : order.status === 'PENDING'
                                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'
                                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">No orders yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
