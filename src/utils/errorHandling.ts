/**
 * Error handling utilities
 */

export interface AppError {
  code: string;
  message: string;
  details?: any;
  userMessage?: string;
}

/**
 * Error codes
 */
export enum ErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTH_ERROR = 'AUTH_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  PAYMENT_ERROR = 'PAYMENT_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
}

/**
 * User-friendly error messages (Nigerian context)
 */
const errorMessages: Record<ErrorCode, string> = {
  [ErrorCode.NETWORK_ERROR]: 'Network wahala! Check your internet connection and try again.',
  [ErrorCode.AUTH_ERROR]: 'Unauthorized. Please login again.',
  [ErrorCode.VALIDATION_ERROR]: 'Invalid input. Please check and try again.',
  [ErrorCode.PAYMENT_ERROR]: 'Payment failed. Please try again or use another payment method.',
  [ErrorCode.SERVER_ERROR]: 'Server error. Please try again later.',
  [ErrorCode.UNKNOWN_ERROR]: 'Something went wrong. Please try again.',
  [ErrorCode.NOT_FOUND]: 'Item not found.',
  [ErrorCode.PERMISSION_DENIED]: 'Permission denied. Please check your settings.',
};

/**
 * Create a user-friendly error object
 */
export function createAppError(
  error: Error | any,
  code: ErrorCode = ErrorCode.UNKNOWN_ERROR
): AppError {
  const message = error?.message || error?.toString() || 'Unknown error';
  const userMessage = errorMessages[code] || errorMessages[ErrorCode.UNKNOWN_ERROR];

  return {
    code,
    message,
    details: error,
    userMessage,
  };
}

/**
 * Parse error from API response
 */
export function parseApiError(error: any): AppError {
  // Handle network errors
  if (error?.message?.includes('Network') || error?.code === 'NETWORK_ERROR') {
    return createAppError(error, ErrorCode.NETWORK_ERROR);
  }

  // Handle HTTP errors
  if (error?.response) {
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 401:
        return createAppError(error, ErrorCode.AUTH_ERROR);
      case 403:
        return createAppError(error, ErrorCode.PERMISSION_DENIED);
      case 404:
        return createAppError(error, ErrorCode.NOT_FOUND);
      case 422:
        return createAppError(
          data?.message || error,
          ErrorCode.VALIDATION_ERROR
        );
      case 500:
      case 502:
      case 503:
        return createAppError(error, ErrorCode.SERVER_ERROR);
      default:
        return createAppError(
          data?.message || error,
          ErrorCode.UNKNOWN_ERROR
        );
    }
  }

  // Handle payment errors
  if (error?.code?.includes('PAYMENT') || error?.type === 'payment') {
    return createAppError(error, ErrorCode.PAYMENT_ERROR);
  }

  return createAppError(error, ErrorCode.UNKNOWN_ERROR);
}

/**
 * Log error for debugging
 */
export function logError(error: AppError, context?: string): void {
  if (__DEV__) {
    console.error(`[Error] ${context || 'App'}:`, {
      code: error.code,
      message: error.message,
      details: error.details,
    });
  }

  // In production, send to error reporting service (Sentry, Firebase Crashlytics, etc.)
  // Example:
  // Sentry.captureException(error.details, {
  //   tags: { code: error.code },
  //   extra: { context },
  // });
}

/**
 * Handle error with user notification
 */
export function handleError(
  error: Error | any,
  context?: string
): AppError {
  const appError = parseApiError(error);
  logError(appError, context);
  return appError;
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}

/**
 * Safe async function wrapper
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  fallback?: T
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    logError(handleError(error), 'safeAsync');
    return fallback ?? null;
  }
}

/**
 * Validate and format error message for display
 */
export function getErrorMessage(error: AppError | Error | any): string {
  if ('userMessage' in error) {
    return error.userMessage;
  }

  if (error instanceof Error) {
    return parseApiError(error).userMessage;
  }

  return errorMessages[ErrorCode.UNKNOWN_ERROR];
}

