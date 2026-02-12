// Product Types & Interfaces

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: Category;
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  featured: boolean;
  variants?: ProductVariant[];
  createdAt: Date;
}

export interface ProductVariant {
  id: string;
  sku: string;
  stock: number;
  priceModifier: number;
  size?: string;
  color?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  parentId?: string;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  page?: number;
  limit?: number;
}

export interface ProductResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}
