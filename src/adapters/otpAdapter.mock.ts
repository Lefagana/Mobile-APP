import type { IOTPAdapter, SendOTPRequest, SendOTPResponse, VerifyOTPRequest, VerifyOTPResponse } from './otpAdapter';

// In-memory storage for mock OTPs (in production, this would be handled by backend)
const otpSessions: Map<string, { phone: string; otp: string; expiresAt: number; type: string }> = new Map();

const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Mock OTP Adapter
 * Simulates OTP sending and verification for development and testing
 */
export const otpAdapterMock: IOTPAdapter = {
  sendOTP: async (request: SendOTPRequest): Promise<SendOTPResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const sessionId = `otp_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
    const type = request.type || 'sms';

    // Store OTP session
    otpSessions.set(sessionId, {
      phone: request.phone,
      otp,
      expiresAt,
      type,
    });

    // Log OTP for development (remove in production)
    console.log(`[MOCK OTP] ${type.toUpperCase()} OTP sent to ${request.phone}: ${otp} (Session: ${sessionId})`);

    return {
      success: true,
      session_id: sessionId,
      message: type === 'voice' ? 'Voice call initiated' : 'OTP sent successfully',
      expires_in: 300, // 5 minutes
    };
  },

  verifyOTP: async (request: VerifyOTPRequest): Promise<VerifyOTPResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const session = otpSessions.get(request.session_id);

    if (!session) {
      console.log('[MOCK OTP] Verification failed: Invalid session ID');
      return {
        success: false,
        message: 'Invalid session ID',
      };
    }

    if (Date.now() > session.expiresAt) {
      otpSessions.delete(request.session_id);
      console.log('[MOCK OTP] Verification failed: OTP expired');
      return {
        success: false,
        message: 'OTP has expired',
      };
    }

    if (session.otp !== request.code) {
      console.log('[MOCK OTP] Verification failed: Invalid OTP code');
      return {
        success: false,
        message: 'Invalid OTP code',
      };
    }

    // Clean up session on successful verification
    otpSessions.delete(request.session_id);
    console.log('[MOCK OTP] Verification successful');
    return {
      success: true,
      message: 'OTP verified successfully',
    };
  },
};
