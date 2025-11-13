import type {
  IPaystackAdapter,
  PaystackInitiateRequest,
  PaystackInitiateResponse,
  PaystackVerifyResponse,
} from './paystackAdapter';

/**
 * Mock Paystack Adapter
 * Simulates Paystack payment flows for development and testing
 */
export const paystackAdapterMock: IPaystackAdapter = {
  initiatePayment: async (request: PaystackInitiateRequest): Promise<PaystackInitiateResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const reference = request.reference || `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const accessCode = `access_${Date.now()}`;

    console.log('[MOCK Paystack] Payment Initiated:', {
      email: request.email,
      amount: request.amount,
      reference,
    });

    return {
      authorization_url: `https://checkout.paystack.com/${accessCode}`,
      access_code: accessCode,
      reference,
    };
  },

  verifyPayment: async (reference: string): Promise<PaystackVerifyResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));

    // Mock: Always succeed for demo purposes
    // In real implementation, this would call Paystack API
    const shouldSucceed = !reference.includes('fail');

    console.log('[MOCK Paystack] Payment Verification:', {
      reference,
      status: shouldSucceed ? 'success' : 'failed',
    });

    if (shouldSucceed) {
      return {
        status: 'success',
        message: 'Verification successful',
        data: {
          amount: 500000, // 5000 NGN in kobo
          currency: 'NGN',
          transaction_date: new Date().toISOString(),
          status: 'success',
          reference,
          gateway_response: 'Successful',
          customer: {
            email: 'customer@example.com',
          },
        },
      };
    } else {
      return {
        status: 'failed',
        message: 'Payment verification failed',
      };
    }
  },
};
