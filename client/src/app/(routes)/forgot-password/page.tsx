'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    // Simulate sending reset email
    setSubmitted(true);

    // In a real app, you would call the API here
    console.log('Password reset email sent to:', email);
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

        {/* Forget Password Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {!submitted ? (
            <>
              <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                  <Mail className="text-blue-600" size={32} />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Forgot Password?
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  No problem. Enter your email and we'll send you instructions to reset your
                  password.
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
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    We'll send a password reset link to this email address
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
                >
                  Send Reset Link
                </button>
              </form>

              {/* Back to Login */}
              <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
                Remember your password?{' '}
                <button
                  onClick={() => router.push('/login')}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Sign in
                </button>
              </p>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4 animate-pulse">
                  <Mail className="text-green-600" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Check Your Email
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  We've sent password reset instructions to <strong>{email}</strong>
                </p>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-8 text-sm text-gray-700 dark:text-gray-300">
                  <p className="mb-2">The reset link will expire in 24 hours.</p>
                  <p>If you don't see the email, check your spam folder.</p>
                </div>

                <button
                  onClick={() => router.push('/login')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
                >
                  Back to Sign In
                </button>

                <button
                  onClick={() => {
                    setSubmitted(false);
                    setEmail('');
                  }}
                  className="w-full text-blue-600 hover:text-blue-700 font-semibold py-3 mt-2"
                >
                  Try Another Email
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
