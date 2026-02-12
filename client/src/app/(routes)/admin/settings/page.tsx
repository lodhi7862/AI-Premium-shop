'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useCheckAuth } from '@/features/auth/hooks';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const AdminSettingsPage: React.FC = () => {
  const router = useRouter();
  const { user, isLoading } = useCheckAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [generalSettings, setGeneralSettings] = useState({
    storeName: '',
    storeEmail: '',
    storePhone: '',
    storeAddress: '',
  });

  const [currencySettings, setCurrencySettings] = useState({
    currency: 'USD',
    taxRate: '',
    shippingCost: '',
  });

  // Redirect if not admin
  React.useEffect(() => {
    if (!isLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Update general settings mutation
  const updateGeneralMutation = useMutation({
    mutationFn: async (data: typeof generalSettings) => {
      const response = await apiClient.put('/admin/settings/general', data);
      return response.data;
    },
    onSuccess: () => {
      setSuccessMessage('General settings updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    },
    onError: (error: any) => {
      setErrors(error.response?.data?.errors || { submit: 'Failed to update settings' });
    },
  });

  // Update currency settings mutation
  const updateCurrencyMutation = useMutation({
    mutationFn: async (data: typeof currencySettings) => {
      const response = await apiClient.put('/admin/settings/currency', data);
      return response.data;
    },
    onSuccess: () => {
      setSuccessMessage('Currency settings updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    },
    onError: (error: any) => {
      setErrors(error.response?.data?.errors || { submit: 'Failed to update settings' });
    },
  });

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    updateGeneralMutation.mutate(generalSettings);
  };

  const handleCurrencySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    updateCurrencyMutation.mutate(currencySettings);
  };

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

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Store Settings</h1>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              activeTab === 'general'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            General Settings
          </button>
          <button
            onClick={() => setActiveTab('currency')}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              activeTab === 'currency'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            Currency & Pricing
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* General Settings Tab */}
        {activeTab === 'general' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
            {errors.submit && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {errors.submit}
              </div>
            )}

            <form onSubmit={handleGeneralSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Store Name
                </label>
                <input
                  type="text"
                  value={generalSettings.storeName}
                  onChange={(e) =>
                    setGeneralSettings((prev) => ({ ...prev, storeName: e.target.value }))
                  }
                  className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white ${
                    errors.storeName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter store name"
                />
                {errors.storeName && <p className="mt-1 text-sm text-red-600">{errors.storeName}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Store Email
                  </label>
                  <input
                    type="email"
                    value={generalSettings.storeEmail}
                    onChange={(e) =>
                      setGeneralSettings((prev) => ({ ...prev, storeEmail: e.target.value }))
                    }
                    className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white ${
                      errors.storeEmail ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="support@store.com"
                  />
                  {errors.storeEmail && <p className="mt-1 text-sm text-red-600">{errors.storeEmail}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Store Phone
                  </label>
                  <input
                    type="tel"
                    value={generalSettings.storePhone}
                    onChange={(e) =>
                      setGeneralSettings((prev) => ({ ...prev, storePhone: e.target.value }))
                    }
                    className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white ${
                      errors.storePhone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="+1 (555) 000-0000"
                  />
                  {errors.storePhone && <p className="mt-1 text-sm text-red-600">{errors.storePhone}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Store Address
                </label>
                <textarea
                  value={generalSettings.storeAddress}
                  onChange={(e) =>
                    setGeneralSettings((prev) => ({ ...prev, storeAddress: e.target.value }))
                  }
                  rows={3}
                  className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white ${
                    errors.storeAddress ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter store address"
                />
                {errors.storeAddress && <p className="mt-1 text-sm text-red-600">{errors.storeAddress}</p>}
              </div>

              <button
                type="submit"
                disabled={updateGeneralMutation.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg"
              >
                {updateGeneralMutation.isPending ? 'Saving...' : 'Save Settings'}
              </button>
            </form>
          </div>
        )}

        {/* Currency Settings Tab */}
        {activeTab === 'currency' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
            {errors.submit && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {errors.submit}
              </div>
            )}

            <form onSubmit={handleCurrencySubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Currency
                </label>
                <select
                  value={currencySettings.currency}
                  onChange={(e) =>
                    setCurrencySettings((prev) => ({ ...prev, currency: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD (C$)</option>
                  <option value="AUD">AUD (A$)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={currencySettings.taxRate}
                    onChange={(e) =>
                      setCurrencySettings((prev) => ({ ...prev, taxRate: e.target.value }))
                    }
                    className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white ${
                      errors.taxRate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="7.5"
                  />
                  {errors.taxRate && <p className="mt-1 text-sm text-red-600">{errors.taxRate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Shipping Cost
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={currencySettings.shippingCost}
                    onChange={(e) =>
                      setCurrencySettings((prev) => ({ ...prev, shippingCost: e.target.value }))
                    }
                    className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white ${
                      errors.shippingCost ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.shippingCost && (
                    <p className="mt-1 text-sm text-red-600">{errors.shippingCost}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={updateCurrencyMutation.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg"
              >
                {updateCurrencyMutation.isPending ? 'Saving...' : 'Save Settings'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettingsPage;
