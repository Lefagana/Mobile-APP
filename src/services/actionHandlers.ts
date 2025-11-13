import { api } from './api';
import { CreateOrderRequest, CreateOrderResponse } from '../types';

/**
 * Action handlers for offline queue
 * These functions execute the actual API calls when the queue is processed
 */

export interface ActionHandlers {
  'order:place': (payload: CreateOrderRequest) => Promise<CreateOrderResponse>;
  'message:send': (payload: {
    chatId: string;
    senderId: string;
    content: string;
  }) => Promise<any>;
  'return:initiate': (payload: {
    order_id: string;
    items: string[];
    reason: string;
    description?: string;
    resolution_preference: string;
    photos?: string[];
  }) => Promise<any>;
  'wallet:topup': (payload: {
    userId: string;
    amount: number;
    method?: string;
  }) => Promise<any>;
  'address:save': (payload: {
    userId: string;
    address: any;
  }) => Promise<any>;
}

/**
 * Place order handler
 */
export const placeOrderHandler = async (payload: CreateOrderRequest): Promise<CreateOrderResponse> => {
  const response = await api.orders.create(payload);
  return response;
};

/**
 * Send message handler
 */
export const sendMessageHandler = async (payload: {
  chatId: string;
  senderId: string;
  content: string;
}): Promise<any> => {
  const response = await api.chat.sendMessage(payload.chatId, payload.senderId, payload.content);
  return response;
};

/**
 * Initiate return handler
 */
export const initiateReturnHandler = async (payload: {
  order_id: string;
  items: string[];
  reason: string;
  description?: string;
  resolution_preference: string;
  photos?: string[];
}): Promise<any> => {
  // TODO: Implement API call when backend is ready
  // const response = await api.orders.initiateReturn(payload);
  // return response;
  
  // Mock implementation for now
  return Promise.resolve({
    return_id: `return_${Date.now()}`,
    status: 'pending',
    message: 'Return request submitted successfully',
  });
};

/**
 * Wallet top-up handler
 */
export const walletTopUpHandler = async (payload: {
  userId: string;
  amount: number;
  method?: string;
}): Promise<any> => {
  const response = await api.wallet.topUp(payload.userId, payload.amount, payload.method);
  return response;
};

/**
 * Save address handler
 */
export const saveAddressHandler = async (payload: {
  userId: string;
  address: any;
}): Promise<any> => {
  // TODO: Implement API call when backend is ready
  // const response = await api.addresses.create(payload.userId, payload.address);
  // return response;
  
  // Mock implementation for now
  return Promise.resolve({
    address_id: `addr_${Date.now()}`,
    message: 'Address saved successfully',
  });
};

/**
 * Register all action handlers
 * This should be called during app initialization
 * Import registerActionHandler from hooks to avoid circular dependency
 */
export const registerActionHandlers = (registerFn: (type: string, handler: any) => void) => {
  registerFn('order:place', placeOrderHandler);
  registerFn('message:send', sendMessageHandler);
  registerFn('return:initiate', initiateReturnHandler);
  registerFn('wallet:topup', walletTopUpHandler);
  registerFn('address:save', saveAddressHandler);
  
  console.log('[ActionHandlers] All action handlers registered');
};

