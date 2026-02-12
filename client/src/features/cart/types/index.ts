// Cart Types & Interfaces

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  product: any; // Product interface
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
  itemCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AddToCartRequest {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CartResponse {
  data: Cart;
}
