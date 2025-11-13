import { formatCurrency as i18nFormatCurrency, formatNumber, formatDate as i18nFormatDate } from '../i18n';

// Re-export formatCurrency for convenience
export const formatCurrency = (amount: number, currency: string = 'NGN'): string => {
  return i18nFormatCurrency(amount, currency);
};

// Currency formatting (NGN)
export const formatNGN = (amount: number): string => {
  return i18nFormatCurrency(amount, 'NGN');
};

// Number formatting with Nigerian locale
export const formatNigerianNumber = (value: number): string => {
  return formatNumber(value);
};

// Date formatting
export const formatDate = (date: Date | string, format: 'short' | 'long' = 'short'): string => {
  return i18nFormatDate(date, format);
};

// Relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  } else {
    return formatDate(dateObj, 'short');
  }
};

// Truncate text
export const truncate = (text: string, maxLength: number, suffix: string = '...'): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - suffix.length) + suffix;
};

// Format order status for display
export const formatOrderStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: 'Pending',
    accepted: 'Accepted',
    preparing: 'Preparing',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
  };
  return statusMap[status] || status;
};

// Format payment method
export const formatPaymentMethod = (method: string): string => {
  const methodMap: Record<string, string> = {
    wallet: 'Wallet',
    paystack: 'Paystack',
    cod: 'Cash on Delivery',
    ussd: 'USSD Bank Transfer',
    bank_transfer: 'Bank Transfer',
  };
  return methodMap[method] || method;
};
