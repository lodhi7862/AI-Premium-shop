'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store';
import { User } from '@/types';

/**
 * Hook to check and manage authentication
 */
export function useCheckAuth() {
  const { user, isAuthenticated, isLoading, setUser, logout, initializeAuth } = useAuthStore();

  // Initialize auth from localStorage on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const setAuth = (_token: string, userData: User) => {
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    logout();
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    setAuth,
    logout: logoutUser,
  };
}
