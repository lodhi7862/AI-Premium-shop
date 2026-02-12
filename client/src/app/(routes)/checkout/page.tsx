'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useCartStore } from '@/store';
import { ArrowLeft, Lock } from 'lucide-react';

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
}

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch user profile if logged in
  const { data: user } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/users/profile');
        return response.data;
      } catch {
        return null;
      }
    },
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post('/orders', {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      clearCart();
      router.push(`/checkout/success?orderId=${data.id}`);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.zipCode
    ) {
      alert('Please fill in all required fields');
      return;
    }

    createOrderMutation.mutate();
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Your cart is empty
            </h1>
            <button
              onClick={() => router.push('/products')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

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

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Shipping Information */}
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Shipping Information
                </h2>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      defaultValue={user?.firstName || ''}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      defaultValue={user?.lastName || ''}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    defaultValue={user?.email || ''}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      State/Province *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      ZIP/Postal Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="United States"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Lock size={24} />
                  Payment Information
                </h2>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\s/g, '');
                      value = value.replace(/(\d{4})/g, '$1 ').trim();
                      setFormData((prev) => ({ ...prev, cardNumber: value }));
                    }}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Expiry Date *
                    </label>
                    <input
                      type="text"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length >= 2) {
                          value = value.substring(0, 2) + '/' + value.substring(2, 4);
                        }
                        setFormData((prev) => ({ ...prev, cardExpiry: value }));
                      }}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      CVV *
                    </label>
                    <input
                      type="text"
                      name="cardCvc"
                      value={formData.cardCvc}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          cardCvc: e.target.value.replace(/\D/g, '').substring(0, 4),
                        }));
                      }}
                      placeholder="123"
                      maxLength={4}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={createOrderMutation.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-lg text-lg"
              >
                {createOrderMutation.isPending ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Item × {item.quantity}</span>
                    <span>${(99.99 * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>${(items.reduce((total, item) => total + item.quantity * 99.99, 0)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-600 dark:text-green-400">FREE</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax</span>
                  <span>${(items.reduce((total, item) => total + item.quantity * 99.99, 0) * 0.08).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between py-4 border-t-2 border-gray-200 dark:border-gray-700">
                <span className="text-xl font-bold text-gray-900 dark:text-white">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${(items.reduce((total, item) => total + item.quantity * 99.99, 0) * 1.08).toFixed(2)}
                </span>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center flex items-center justify-center gap-1">
                <Lock size={12} />
                Your payment is secure and encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
