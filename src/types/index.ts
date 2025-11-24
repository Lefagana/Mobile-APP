// User Types
export interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  profile_pic?: string;
  role: 'customer' | 'vendor' | 'rider' | 'admin';
  created_at?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

// Product Types
export interface ProductVariant {
  id: string;
  label: string;
  price: number;
  inventory?: number;
  image?: string; // Variant-specific image URL
  attributes?: Record<string, string>; // e.g., { color: 'Red', size: 'Large' }
}

export interface Product {
  id: string;
  title: string;
  name?: string; // Alias for title for backward compatibility
  description?: string;
  price: number;
  currency: string;
  vendor_id: string;
  vendor_name?: string;
  vendor?: Vendor; // Optional vendor object for populated responses
  images: string[];
  image_url?: string; // Single image URL alias
  variants?: ProductVariant[];
  rating?: number;
  review_count?: number;
  category?: string;
  inventory?: number;
  is_low_price?: boolean; // Flag for low price badge
  created_at?: string;
}

export interface ProductListResponse {
  items: Product[];
  meta: {
    page: number;
    total: number;
    per_page: number;
  };
}

// Review Types
export interface ProductReview {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  rating: number; // 1-5
  title?: string;
  comment: string;
  verified_purchase: boolean;
  helpful_count?: number;
  created_at: string;
  images?: string[];
}

export interface ReviewListResponse {
  reviews: ProductReview[];
  meta: {
    page: number;
    total: number;
    per_page: number;
    average_rating: number;
  };
}

// Vendor Types
export interface Vendor {
  id: string;
  user_id: string;
  shop_name: string;
  location?: {
    lat: number;
    lng: number;
  };
  address_text?: string;
  logo?: string;
  rating?: number;
  kyc_status?: string;
  created_at?: string;
}

// Cart Types
export interface CartItem {
  product_id: string;
  product: Product;
  variant_id?: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Cart {
  items: CartItem[];
  coupon_code?: string;
  discount?: number;
  subtotal: number;
  delivery_fee?: number;
  total: number;
}

// Order Types
export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface DeliveryAddress {
  lat: number;
  lng: number;
  text: string;
  landmark?: string;
  instructions?: string;
  type?: 'home' | 'work' | 'other';
}

export interface OrderItem {
  id: string;
  product_id: string;
  product: Product;
  qty: number;
  price: number;
  variant_id?: string;
}

export interface Order {
  id: string;
  order_id: string;
  user_id: string;
  vendor_id: string;
  vendor?: Vendor;
  items: OrderItem[];
  total: number;
  currency: string;
  status: OrderStatus;
  delivery_address: DeliveryAddress;
  payment_info?: {
    method: string;
    reference?: string;
    status?: string;
  };
  rider?: {
    id: string;
    name: string;
    phone?: string;
    photo?: string;
    lat?: number;
    lng?: number;
  };
  eta?: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateOrderRequest {
  user_id: string;
  items: Array<{
    product_id: string;
    qty: number;
    price: number;
    variant_id?: string;
  }>;
  delivery_address: DeliveryAddress;
  payment_method: string;
  meta?: {
    delivery_slot?: string;
    instructions?: string;
    coupon_code?: string;
  };
}

export interface CreateOrderResponse {
  order_id: string;
  status: OrderStatus;
  total: number;
  eta: string;
}

// Payment Types
export type PaymentMethod = 'wallet' | 'paystack' | 'cod' | 'ussd' | 'bank_transfer';

export interface PaymentInitiateResponse {
  authorization_url?: string;
  reference?: string;
  access_code?: string;
}

export interface PaymentVerifyResponse {
  status: 'success' | 'failed';
  gateway_response?: string;
  reference?: string;
}

// Chat Types
export interface Chat {
  id: string;
  order_id?: string;
  participants: string[];
  last_message?: string;
  updated_at: string;
  unread_count?: number;
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  attachments?: Array<{
    type: string;
    url: string;
  }>;
  created_at: string;
  read?: boolean;
}

// Wallet Types
export interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  reference?: string;
  status: 'completed' | 'pending' | 'failed';
  created_at: string;
}

export interface Wallet {
  balance: number;
  currency: string;
  transactions: WalletTransaction[];
}

// Address Types
export interface SavedAddress {
  id: string;
  type: 'home' | 'work' | 'other';
  text: string;
  landmark?: string;
  location?: {
    lat: number;
    lng: number;
  };
  is_default?: boolean;
}

// API Error Types
export interface ApiError {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

// Pagination
export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

// Notification Types
export type NotificationType = 'order' | 'message' | 'promotion' | 'payment' | 'system' | 'delivery';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  icon?: string;
  read: boolean;
  deep_link?: {
    screen: string;
    params?: Record<string, any>;
  };
  created_at: string;
}

// Socket Events
export interface OrderUpdateEvent {
  order_id: string;
  status: OrderStatus;
  eta?: string;
  rider?: {
    id: string;
    lat: number;
    lng: number;
    name?: string;
  };
}
