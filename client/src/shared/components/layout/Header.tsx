/**
 * Header Navigation Component
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUIStore, useCartStore, useAuthStore } from '@/store';
import { useTheme } from 'next-themes';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const { toggleCart } = useUIStore();
  const { getTotalItems, _hasHydrated } = useCartStore();
  const { user, logout } = useAuthStore();
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-brand-primary shadow-md transition-colors duration-300">
      <div className="container-custom flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-brand-gold">✨ AI Shop</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex gap-6">
          <Link
            href="/products"
            className="text-gray-700 dark:text-gray-300 hover:text-brand-gold transition-colors"
          >
            Products
          </Link>
          <Link
            href="/categories"
            className="text-gray-700 dark:text-gray-300 hover:text-brand-gold transition-colors"
          >
            Categories
          </Link>
          <Link
            href="/deals"
            className="text-gray-700 dark:text-gray-300 hover:text-brand-gold transition-colors"
          >
            Deals
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={handleThemeToggle}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-brand-secondary transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Search Icon */}
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-brand-secondary transition-colors">
            🔍
          </button>

          {/* Cart */}
          <button
            onClick={() => toggleCart()}
            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-brand-secondary transition-colors"
          >
            🛒
            {mounted && _hasHydrated && getTotalItems() > 0 && (
              <span className="absolute top-1 right-1 bg-brand-gold text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </button>

          {/* User Menu */}
          {mounted && user ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-gold rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user.firstName.charAt(0)}
              </div>
              <Button
                onClick={logout}
                variant="ghost"
                size="sm"
              >
                Logout
              </Button>
            </div>
          ) : mounted ? (
            <Link href="/login">
              <Button variant="primary" size="sm">
                Login
              </Button>
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Header;
