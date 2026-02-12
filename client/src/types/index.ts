/**
 * Global application types
 * Centralized type definitions for the entire frontend
 */

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CUSTOMER' | 'ADMIN' | 'VENDOR';
  avatar?: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: Category;
  categoryId: string;
  stock: number;
  rating: number;
  reviewCount: number;
  variants?: ProductVariant[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  value: string;
  sku: string;
  stock: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  variantId?: string;
  addedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  shippingAddress: Address;
  paymentMethod: string;
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  variantId?: string;
}

export interface Address {
  id: string;
  userId: string;
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title: string;
  content: string;
  verified: boolean;
  createdAt: Date;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
