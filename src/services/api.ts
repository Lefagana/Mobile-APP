import { mockServer } from './mocks/mockServer';
import axios, { AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';
import {
  Product,
  ProductListResponse,
  ReviewListResponse,
  Vendor,
  Order,
  CreateOrderRequest,
  CreateOrderResponse,
  AuthResponse,
  PaymentInitiateResponse,
  PaymentVerifyResponse,
  Wallet,
  WalletTransaction,
  Chat,
  Message,
  Notification,
  VendorProduct,
} from '../types';
import { parseApiError, logError, ErrorCode } from '../utils/errorHandling';

// Create axios instance (for real API calls)
let apiClient: AxiosInstance | null = null;
let isRefreshing = false;
let pendingRequests: Array<(token: string | null) => void> = [];

const getApiClient = async (baseURL: string): Promise<AxiosInstance> => {
  if (!apiClient) {
    apiClient = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - add auth token
    apiClient.interceptors.request.use(
      async (config) => {
        try {
          const token = await SecureStore.getItemAsync('wakanda_access_token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Error getting token:', error);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle token refresh, errors
    apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        // Parse and log error using error handling utilities
        const appError = parseApiError(error);
        logError(appError, 'API Request');
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const newToken = await refreshAccessToken(baseURL);
            if (newToken) {
              // set header and retry
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return apiClient!(originalRequest);
            }
          } catch (e) {
            // fallthrough to reject
          }
        }

        // Reject with parsed error for better error handling upstream
        return Promise.reject(appError);
      }
    );
  }
  return apiClient;
};

// Helper: refresh token (single-flight). Returns new access token or null
const refreshAccessToken = async (baseURL: string): Promise<string | null> => {
  if (isRefreshing) {
    return new Promise((resolve) => {
      pendingRequests.push((token) => resolve(token));
    });
  }
  isRefreshing = true;
  try {
    const refresh = await SecureStore.getItemAsync('wakanda_refresh_token');
    if (!refresh) return null;
    const refreshClient = axios.create({ baseURL });
    const resp = await refreshClient.post('/auth/refresh', { refresh_token: refresh });
    const { access_token, refresh_token } = resp.data || {};
    if (access_token) {
      await SecureStore.setItemAsync('wakanda_access_token', access_token);
      if (refresh_token) {
        await SecureStore.setItemAsync('wakanda_refresh_token', refresh_token);
      }
      // notify queuers
      pendingRequests.forEach((cb) => cb(access_token));
      pendingRequests = [];
      return access_token as string;
    }
    return null;
  } catch (e) {
    pendingRequests.forEach((cb) => cb(null));
    pendingRequests = [];
    // On failure, clear tokens
    try {
      await SecureStore.deleteItemAsync('wakanda_access_token');
      await SecureStore.deleteItemAsync('wakanda_refresh_token');
    } catch { }
    return null;
  } finally {
    isRefreshing = false;
  }
};

// API facade that switches between mock and real
export const createApi = (config: { MOCK_MODE: boolean; apiBaseUrl: string }) => {
  const { MOCK_MODE, apiBaseUrl } = config;

  if (MOCK_MODE) {
    // Return mock implementations
    return {
      auth: {
        requestOTP: (phone: string) => mockServer.auth.requestOTP(phone),
        verifyOTP: (sessionId: string, code: string) =>
          mockServer.auth.verifyOTP(sessionId, code),
      },

      products: {
        list: (params?: {
          category?: string;
          q?: string;
          page?: number;
          lat?: number;
          lng?: number;
        }) => mockServer.products.list(params),

        getById: (id: string) => mockServer.products.getById(id),

        getReviews: (productId: string, page?: number) => mockServer.products.getReviews(productId, page),

        getRelated: (productId: string, limit?: number) => mockServer.products.getRelated(productId, limit),
      },

      vendors: {
        list: () => mockServer.vendors.list(),
        getById: (id: string) => mockServer.vendors.getById(id),
        products: {
          create: (vendorId: string, data: any) => mockServer.vendors.products.create(vendorId, data),
          update: (vendorId: string, productId: string, data: any) => mockServer.vendors.products.update(vendorId, productId, data),
          delete: (vendorId: string, productId: string) => mockServer.vendors.products.delete(vendorId, productId),
        }
      },

      cart: {
        validateCoupon: (code: string) => mockServer.cart.validateCoupon(code),
      },

      orders: {
        create: (request: CreateOrderRequest) => mockServer.orders.create(request),
        list: (userId: string) => mockServer.orders.list(userId),
        getById: (id: string) => mockServer.orders.getById(id),
      },

      payments: {
        initiate: (orderId: string, amount: number) =>
          mockServer.payments.initiate(orderId, amount),
        verify: (reference: string) => mockServer.payments.verify(reference),
      },

      wallet: {
        get: (userId: string) => mockServer.wallet.get(userId),
        topUp: (userId: string, amount: number, method?: string) =>
          mockServer.wallet.topUp(userId, amount, method),
        transactions: (userId: string, params?: { limit?: number; offset?: number }) =>
          mockServer.wallet.transactions(userId, params),
      },

      chat: {
        list: (userId: string) => mockServer.chat.list(userId),
        getById: (chatId: string) => mockServer.chat.getById(chatId),
        messages: (chatId: string, params?: { limit?: number; offset?: number }) =>
          mockServer.chat.messages(chatId, params),
        sendMessage: (chatId: string, senderId: string, content: string) =>
          mockServer.chat.sendMessage(chatId, senderId, content),
        markAsRead: (chatId: string, userId: string) => mockServer.chat.markAsRead(chatId, userId),
      },

      notifications: {
        list: (userId: string, params?: { limit?: number; offset?: number; unread_only?: boolean }) =>
          mockServer.notifications.list(userId, params),
        getById: (notificationId: string) => mockServer.notifications.getById(notificationId),
        markAsRead: (notificationId: string) => mockServer.notifications.markAsRead(notificationId),
        markAllAsRead: (userId: string) => mockServer.notifications.markAllAsRead(userId),
        getUnreadCount: (userId: string) => mockServer.notifications.getUnreadCount(userId),
      },
    };
  }

  // Real API implementations
  return {
    auth: {
      requestOTP: async (phone: string) => {
        const client = await getApiClient(apiBaseUrl);
        const response = await client.post('/auth/request-otp', { phone });
        return response.data;
      },

      verifyOTP: async (sessionId: string, code: string): Promise<AuthResponse> => {
        const client = await getApiClient(apiBaseUrl);
        const response = await client.post('/auth/verify-otp', {
          otp_session_id: sessionId,
          code,
        });
        return response.data;
      },
    },

    products: {
      list: async (params?: {
        category?: string;
        q?: string;
        page?: number;
        lat?: number;
        lng?: number;
      }): Promise<ProductListResponse> => {
        const client = await getApiClient(apiBaseUrl);
        const response = await client.get('/products', { params });
        return response.data;
      },

      getById: async (id: string): Promise<Product> => {
        const client = await getApiClient(apiBaseUrl);
        const response = await client.get(`/products/${id}`);
        return response.data;
      },

      getReviews: async (productId: string, page: number = 1): Promise<ReviewListResponse> => {
        const client = await getApiClient(apiBaseUrl);
        const response = await client.get(`/products/${productId}/reviews`, {
          params: { page },
        });
        return response.data;
      },

      getRelated: async (productId: string, limit: number = 6): Promise<Product[]> => {
        const client = await getApiClient(apiBaseUrl);
        const response = await client.get(`/products/${productId}/related`, {
          params: { limit },
        });
        return response.data.items || response.data;
      },
    },

    vendors: {
      list: async (): Promise<Vendor[]> => {
        const client = await getApiClient(apiBaseUrl);
        const response = await client.get('/vendors');
        return response.data;
      },

      getById: async (id: string): Promise<Vendor> => {
        const client = await getApiClient(apiBaseUrl);
        const response = await client.get(`/vendors/${id}`);
        return response.data;
      },

      products: {
        create: async (vendorId: string, data: any): Promise<VendorProduct> => {
          const client = await getApiClient(apiBaseUrl);
          const response = await client.post(`/vendors/${vendorId}/products`, data);
          return response.data;
        },
        update: async (vendorId: string, productId: string, data: any): Promise<VendorProduct> => {
          const client = await getApiClient(apiBaseUrl);
          const response = await client.put(`/vendors/${vendorId}/products/${productId}`, data);
          return response.data;
        },
        delete: async (vendorId: string, productId: string): Promise<void> => {
          const client = await getApiClient(apiBaseUrl);
          await client.delete(`/vendors/${vendorId}/products/${productId}`);
        },
      }
    },

    cart: {
      validateCoupon: async (code: string): Promise<boolean> => {
        const client = await getApiClient(apiBaseUrl);
        try {
          const response = await client.post('/cart/validate-coupon', { code });
          return response.data.valid === true;
        } catch {
          return false;
        }
      },
    },

    orders: {
      create: async (request: CreateOrderRequest): Promise<CreateOrderResponse> => {
        const client = await getApiClient(apiBaseUrl);
        const response = await client.post('/orders/create', request);
        return response.data;
      },

      list: async (userId: string): Promise<Order[]> => {
        const client = await getApiClient(apiBaseUrl);
        const response = await client.get('/orders', { params: { user_id: userId } });
        return response.data.items || response.data;
      },

      getById: async (id: string): Promise<Order> => {
        const client = await getApiClient(apiBaseUrl);
        const response = await client.get(`/orders/${id}`);
        return response.data;
      },
    },

    payments: {
      initiate: async (
        orderId: string,
        amount: number
      ): Promise<PaymentInitiateResponse> => {
        const client = await getApiClient(apiBaseUrl);
        const response = await client.post('/payments/paystack/initiate', {
          order_id: orderId,
          amount,
        });
        return response.data;
      },

      verify: async (reference: string): Promise<PaymentVerifyResponse> => {
        const client = await getApiClient(apiBaseUrl);
        const response = await client.post('/payments/paystack/verify', { reference });
        return response.data;
      },
    },

    wallet: {
      get: async (userId: string): Promise<Wallet> => {
        const client = await getApiClient(apiBaseUrl);
        const response = await client.get(`/wallet/${userId}`);
        return response.data;
      },

      topUp: async (userId: string, amount: number, method: string = 'paystack'): Promise<WalletTransaction> => {
        const client = await getApiClient(apiBaseUrl);
        const response = await client.post('/wallet/top-up', {
          user_id: userId,
          amount,
          method,
        });
        return response.data;
      },

      transactions: async (userId: string, params?: { limit?: number; offset?: number }): Promise<WalletTransaction[]> => {
        const client = await getApiClient(apiBaseUrl);
        const response = await client.get(`/wallet/${userId}/transactions`, { params });
        return response.data.items || response.data;
      },
    },

    chat: {
      list: async (userId: string): Promise<Chat[]> => {
        const client = await getApiClient(apiBaseUrl);
        const response = await client.get('/chats', { params: { user_id: userId } });
        return response.data.items || response.data;
      },

      getById: async (chatId: string): Promise<Chat> => {
        const client = await getApiClient(apiBaseUrl);
        const response = await client.get(`/chats/${chatId}`);
        return response.data;
      },

      messages: async (chatId: string, params?: { limit?: number; offset?: number }): Promise<Message[]> => {
        const client = await getApiClient(apiBaseUrl);
        const response = await client.get(`/chats/${chatId}/messages`, { params });
        return response.data.items || response.data;
      },

      sendMessage: async (chatId: string, senderId: string, content: string): Promise<Message> => {
        const client = await getApiClient(apiBaseUrl);
        const response = await client.post(`/chats/${chatId}/messages`, {
          sender_id: senderId,
          content,
        });
        return response.data;
      },

      markAsRead: async (chatId: string, userId: string): Promise<void> => {
        const client = await getApiClient(apiBaseUrl);
        await client.post(`/chats/${chatId}/mark-read`, { user_id: userId });
      },
    },

    notifications: {
      list: async (userId: string, params?: { limit?: number; offset?: number; unread_only?: boolean }): Promise<Notification[]> => {
        const client = await getApiClient(apiBaseUrl);
        const response = await client.get('/notifications', { params: { user_id: userId, ...params } });
        return response.data.items || response.data;
      },

      getById: async (notificationId: string): Promise<Notification> => {
        const client = await getApiClient(apiBaseUrl);
        const response = await client.get(`/notifications/${notificationId}`);
        return response.data;
      },

      markAsRead: async (notificationId: string): Promise<void> => {
        const client = await getApiClient(apiBaseUrl);
        await client.post(`/notifications/${notificationId}/mark-read`);
      },

      markAllAsRead: async (userId: string): Promise<void> => {
        const client = await getApiClient(apiBaseUrl);
        await client.post('/notifications/mark-all-read', { user_id: userId });
      },

      getUnreadCount: async (userId: string): Promise<number> => {
        const client = await getApiClient(apiBaseUrl);
        const response = await client.get('/notifications/unread-count', { params: { user_id: userId } });
        return response.data.count || 0;
      },
    },
  };
};

// Export singleton instance (will be initialized by ConfigProvider)
let apiInstance: ReturnType<typeof createApi> | null = null;

export const initializeApi = (config: { MOCK_MODE: boolean; apiBaseUrl: string }) => {
  apiInstance = createApi(config);
  return apiInstance;
};

// Export getter (throws if not initialized)
export const api = new Proxy(
  {},
  {
    get(target, prop) {
      if (!apiInstance) {
        throw new Error(
          'API not initialized. Call initializeApi() first or ensure ConfigProvider is set up.'
        );
      }
      return (apiInstance as any)[prop];
    },
  }
) as ReturnType<typeof createApi>;
