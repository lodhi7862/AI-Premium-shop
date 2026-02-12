// Order Types & Interfaces

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  tax: number;
  shippingCost: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress: Address;
  billingAddress: Address;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface CreateOrderRequest {
  shippingAddressId: string;
  billingAddressId?: string;
  paymentMethodId: string;
}

export interface OrderResponse {
  data: Order;
}

export interface OrderListResponse {
  data: Order[];
  total: number;
  page: number;
  limit: number;
}
