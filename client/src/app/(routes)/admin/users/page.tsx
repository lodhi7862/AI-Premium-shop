'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useCheckAuth } from '@/features/auth/hooks';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Trash2, Search, ChevronDown } from 'lucide-react';

const AdminUsersPage: React.FC = () => {
  const router = useRouter();
  const { user, isLoading } = useCheckAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState('');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  // Redirect if not admin
  React.useEffect(() => {
    if (!isLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Fetch users
  const { data: usersResponse, isLoading: isUsersLoading, refetch } = useQuery({
    queryKey: ['admin-users', { search: searchQuery, page, role: roleFilter }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (roleFilter) params.append('role', roleFilter);
      params.append('page', page.toString());
      params.append('limit', '10');

      const response = await apiClient.get(`/admin/users?${params.toString()}`);
      return response.data;
    },
  });

  // Promote to admin mutation
  const promoteAdminMutation = useMutation({
    mutationFn: async (userId: string) => {
      await apiClient.post(`/admin/users/${userId}/promote`, {});
    },
    onSuccess: () => {
      refetch();
    },
  });

  // Update user status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      await apiClient.put(`/admin/users/${userId}/status`, { isActive });
    },
    onSuccess: () => {
      refetch();
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      await apiClient.delete(`/admin/users/${userId}`);
    },
    onSuccess: () => {
      refetch();
    },
  });

  const handlePromoteAdmin = (userId: string) => {
    if (confirm('Promote this user to admin?')) {
      promoteAdminMutation.mutate(userId);
    }
  };

  const handleToggleStatus = (userId: string, currentStatus: boolean) => {
    updateStatusMutation.mutate({ userId, isActive: !currentStatus });
  };

  const handleDelete = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      deleteUserMutation.mutate(userId);
    }
  };

  if (isUsersLoading) {
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

  const roleColors: Record<string, string> = {
    ADMIN: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
    CUSTOMER: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
    MODERATOR: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
              <ArrowLeft size={20} />
              Back
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Users Management</h1>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by email or name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All Roles</option>
            <option value="ADMIN">Admins</option>
            <option value="CUSTOMER">Customers</option>
            <option value="MODERATOR">Moderators</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {isUsersLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-600 dark:text-gray-400">Loading users...</div>
            </div>
          ) : usersResponse?.data?.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 dark:text-gray-400">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">User</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">Email</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">Role</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">Status</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">Joined</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersResponse?.data?.map((userData: any) => (
                    <React.Fragment key={userData.id}>
                      <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {userData.firstName} {userData.lastName}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-900 dark:text-white text-sm">{userData.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${roleColors[userData.role] || ''}`}>
                            {userData.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              userData.isActive
                                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                                : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                            }`}
                          >
                            {userData.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-900 dark:text-white text-sm">
                          {new Date(userData.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setExpandedUser(expandedUser === userData.id ? null : userData.id)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <ChevronDown size={18} />
                          </button>
                        </td>
                      </tr>
                      {expandedUser === userData.id && (
                        <tr className="bg-gray-50 dark:bg-gray-700">
                          <td colSpan={6} className="px-6 py-4">
                            <div className="flex flex-wrap gap-3">
                              {userData.role !== 'ADMIN' && (
                                <button
                                  onClick={() => handlePromoteAdmin(userData.id)}
                                  disabled={promoteAdminMutation.isPending}
                                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50"
                                >
                                  <Shield size={16} />
                                  Promote to Admin
                                </button>
                              )}
                              <button
                                onClick={() => handleToggleStatus(userData.id, userData.isActive)}
                                disabled={updateStatusMutation.isPending}
                                className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg disabled:opacity-50"
                              >
                                <Lock size={16} />
                                {userData.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                              <button
                                onClick={() => handleDelete(userData.id)}
                                disabled={deleteUserMutation.isPending}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50"
                              >
                                <Trash2 size={16} />
                                Delete User
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {usersResponse?.data?.length > 0 && (
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

export default AdminUsersPage;
