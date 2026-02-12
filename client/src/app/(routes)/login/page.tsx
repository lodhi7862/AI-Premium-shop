'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useCheckAuth } from '@/features/auth/hooks';
import Link from 'next/link';
import { ArrowLeft, LogIn } from 'lucide-react';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { setAuth } = useCheckAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
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
      
      // Redirect to home or dashboard
      router.push('/');
    },
    onError: (error: any) => {
      console.error('Login error:', error);
      
      // Handle different error types
      if (error.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Make sure the backend is running on http://localhost:3001');
      } else if (error.response?.status === 401) {
        setError('Invalid email or password. Please try again.');
      } else if (error.response?.status === 400) {
        setError('Invalid input. Please check your credentials.');
      } else {
        setError(error.response?.data?.message || 'Login failed. Please try again.');
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container max-w-md mx-auto px-4 flex flex-col justify-center min-h-screen">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 self-start"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        {/* Login Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
              <LogIn className="text-blue-600" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <input type="checkbox" className="rounded" />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-blue-600 hover:text-blue-700 font-semibold">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button className="w-full border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              Continue with Google
            </button>
            <button className="w-full border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              Continue with Apple
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-gray-600 dark:text-gray-400 mt-8">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
