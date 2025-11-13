import type {
  IPaystackAdapter,
  PaystackInitiateRequest,
  PaystackInitiateResponse,
  PaystackVerifyResponse,
} from './paystackAdapter';

/**
 * Production Paystack Adapter (Stub)
 * 
 * TODO: Implement real Paystack integration:
 * 1. Install @paystack/paystack-sdk or use fetch/axios
 * 2. Get Paystack secret key from ConfigContext
 * 3. Implement initiatePayment using Paystack Transaction.initialize()
 * 4. Implement verifyPayment using Paystack Transaction.verify()
 * 5. Handle errors and edge cases
 * 6. Add proper TypeScript types from Paystack SDK
 * 
 * Example implementation:
 * 
 * import Paystack from '@paystack/paystack-sdk';
 * 
 * export const paystackAdapterProd: IPaystackAdapter = {
 *   initiatePayment: async (request) => {
 *     const paystack = new Paystack(secretKey);
 *     const response = await paystack.transaction.initialize({
 *       email: request.email,
 *       amount: request.amount,
 *       reference: request.reference,
 *       metadata: request.metadata,
 *     });
 *     
 *     return {
 *       authorization_url: response.data.authorization_url,
 *       access_code: response.data.access_code,
 *       reference: response.data.reference,
 *     };
 *   },
 *   
 *   verifyPayment: async (reference) => {
 *     const paystack = new Paystack(secretKey);
 *     const response = await paystack.transaction.verify(reference);
 *     
 *     return {
 *       status: response.data.status === 'success' ? 'success' : 'failed',
 *       message: response.data.gateway_response,
 *       data: response.data,
 *     };
 *   },
 * };
 */

export const paystackAdapterProd: IPaystackAdapter = {
  initiatePayment: async (request: PaystackInitiateRequest): Promise<PaystackInitiateResponse> => {
    throw new Error(
      'Paystack production adapter not yet implemented. Please implement paystackAdapter.prod.ts with real Paystack SDK integration.'
    );
  },

  verifyPayment: async (reference: string): Promise<PaystackVerifyResponse> => {
    throw new Error(
      'Paystack production adapter not yet implemented. Please implement paystackAdapter.prod.ts with real Paystack SDK integration.'
    );
  },
};
