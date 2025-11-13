export interface SendOTPRequest {
  phone: string;
  type?: 'sms' | 'voice';
}

export interface SendOTPResponse {
  success: boolean;
  session_id?: string;
  message?: string;
  expires_in?: number; // seconds
}

export interface VerifyOTPRequest {
  session_id: string;
  code: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message?: string;
}

export interface IOTPAdapter {
  /**
   * Send OTP via SMS or Voice
   */
  sendOTP(request: SendOTPRequest): Promise<SendOTPResponse>;

  /**
   * Verify OTP code
   */
  verifyOTP(request: VerifyOTPRequest): Promise<VerifyOTPResponse>;
}

// Export adapter instance (will be set based on environment)
export let otpAdapter: IOTPAdapter;

export const setOTPAdapter = (impl: IOTPAdapter) => {
  otpAdapter = impl;
};