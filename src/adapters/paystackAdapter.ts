export interface PaystackInitiateRequest {
  email: string;
  amount: number; // in kobo (lowest currency unit)
  reference?: string;
  metadata?: Record<string, any>;
}

export interface PaystackInitiateResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface PaystackVerifyResponse {
  status: 'success' | 'failed';
  message: string;
  data?: {
    amount: number;
    currency: string;
    transaction_date: string;
    status: string;
    reference: string;
    gateway_response: string;
    customer: {
      email: string;
    };
  };
}

export interface IPaystackAdapter {
  /**
   * Initialize a payment transaction
   */
  initiatePayment(request: PaystackInitiateRequest): Promise<PaystackInitiateResponse>;

  /**
   * Verify a payment transaction by reference
   */
  verifyPayment(reference: string): Promise<PaystackVerifyResponse>;
}

// Export adapter instance (will be set based on environment)
export let paystackAdapter: IPaystackAdapter;

export const setPaystackAdapter = (impl: IPaystackAdapter) => {
  paystackAdapter = impl;
};