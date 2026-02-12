'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useCheckAuth } from '@/features/auth/hooks';
import Link from 'next/link';
import { ArrowLeft, UserPlus } from 'lucide-react';

const SignUpPage: React.FC = () => {
  const router = useRouter();
  const { setAuth } = useCheckAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const signUpMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiClient.post('/auth/signup', {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      // Store tokens and user info
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Update auth state
      setAuth(data.accessToken, data.user);
      
      // Redirect to home
      router.push('/');
    },
    onError: (error: any) => {
      console.error('Signup error:', error);
      
      // Handle different error types
      if (error.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Make sure the backend is running on http://localhost:3001');
      } else if (error.response?.status === 409) {
        setError('Email already registered. Please use a different email.');
      } else if (error.response?.status === 400) {
        setError(error.response?.data?.message || 'Invalid input. Please check your information.');
      } else {
        setError(error.response?.data?.message || 'Sign up failed. Please try again.');
      }
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreeToTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }

    signUpMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container max-w-md mx-auto px-4 flex flex-col justify-center min-h-screen py-12">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 self-start"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        {/* Sign Up Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
              <UserPlus className="text-blue-600" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Create Account
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Join us and start shopping today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="John"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:border-blue-600 text-sm"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Doe"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:border-blue-600 text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:border-blue-600 text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:border-blue-600 text-sm"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                At least 8 characters
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:border-blue-600 text-sm"
              />
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="mt-1"
              />
              <span>
                I agree to the{' '}
                <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Privacy Policy
                </Link>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={signUpMutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition text-sm"
            >
              {signUpMutation.isPending ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or</span>
            </div>
          </div>

          {/* Social Sign Up */}
          <div className="space-y-2">
            <button className="w-full border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">
              Continue with Google
            </button>
            <button className="w-full border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">
              Continue with Apple
            </button>
          </div>

          {/* Login Link */}
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
