// Nigerian phone number validation (supports +234 format)
export const validatePhoneNumber = (phone: string): boolean => {
  // Remove spaces and dashes
  const cleaned = phone.replace(/[\s-]/g, '');
  
  // Check if it starts with +234 or 0
  const nigerianPattern = /^(\+234|0)(7|8|9)[0-1][0-9]{8}$/;
  return nigerianPattern.test(cleaned);
};

// Format phone number to +234 format
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/[\s-]/g, '');
  
  if (cleaned.startsWith('+234')) {
    return cleaned;
  }
  
  if (cleaned.startsWith('0')) {
    return '+234' + cleaned.substring(1);
  }
  
  if (cleaned.startsWith('234')) {
    return '+' + cleaned;
  }
  
  return '+234' + cleaned;
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

// OTP validation (6 digits)
export const validateOTP = (otp: string): boolean => {
  return /^\d{6}$/.test(otp);
};

// Validate non-empty string
export const isNotEmpty = (value: string | undefined | null): boolean => {
  return value !== undefined && value !== null && value.trim().length > 0;
};

// Validate minimum length
export const minLength = (value: string, min: number): boolean => {
  return value.length >= min;
};

// Validate maximum length
export const maxLength = (value: string, max: number): boolean => {
  return value.length <= max;
};

// Validate price/amount (positive number)
export const validateAmount = (amount: number): boolean => {
  return amount > 0 && !isNaN(amount) && isFinite(amount);
};
