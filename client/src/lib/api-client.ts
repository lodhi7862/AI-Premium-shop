import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { AuthToken } from '@/types';

/**
 * API Client for frontend
 * Handles authentication, request/response interceptors, and token refresh
 */

class APIClient {
  private instance: AxiosInstance;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

    this.instance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
    this.loadTokens();
  }

  /**
   * Load tokens from localStorage
   */
  private loadTokens(): void {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('accessToken');
      this.refreshToken = localStorage.getItem('refreshToken');
    }
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newTokens = await this.refreshAccessToken();
            if (newTokens) {
              this.setTokens(newTokens);
              originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
              return this.instance(originalRequest);
            }
          } catch (refreshError) {
            this.clearTokens();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Refresh access token using refresh token
   */
  private async refreshAccessToken(): Promise<AuthToken | null> {
    if (!this.refreshToken) return null;

    try {
      const response = await this.instance.post<AuthToken>('/auth/refresh', {
        refreshToken: this.refreshToken,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to refresh token', error);
      return null;
    }
  }

  /**
   * Set tokens in memory and localStorage
   */
  public setTokens(tokens: AuthToken): void {
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;

    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
    }
  }

  /**
   * Clear tokens
   */
  public clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;

    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  /**
   * Check if user is authenticated
   */
  public isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  /**
   * GET request
   */
  public get<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.instance.get<T>(url, config);
  }

  /**
   * POST request
   */
  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance.post<T>(url, data, config);
  }

  /**
   * PUT request
   */
  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance.put<T>(url, data, config);
  }

  /**
   * PATCH request
   */
  public patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance.patch<T>(url, data, config);
  }

  /**
   * DELETE request
   */
  public delete<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.instance.delete<T>(url, config);
  }
}

export const apiClient = new APIClient();
