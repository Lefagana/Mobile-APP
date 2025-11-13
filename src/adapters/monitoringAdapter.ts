export interface ErrorContext {
  userId?: string;
  tags?: Record<string, string>;
  extra?: Record<string, any>;
}

export interface IMonitoringAdapter {
  /**
   * Capture an exception/error
   */
  captureException(error: Error, context?: ErrorContext): void;

  /**
   * Capture a message
   */
  captureMessage(message: string, level?: 'info' | 'warning' | 'error', context?: ErrorContext): void;

  /**
   * Set user context
   */
  setUser(userId: string, email?: string, username?: string): void;

  /**
   * Clear user context (on logout)
   */
  clearUser(): void;

  /**
   * Add breadcrumb for debugging
   */
  addBreadcrumb(message: string, category?: string, level?: 'info' | 'warning' | 'error', data?: Record<string, any>): void;
}

// Export adapter instance (will be set based on environment)
export let monitoringAdapter: IMonitoringAdapter;

export const setMonitoringAdapter = (impl: IMonitoringAdapter) => {
  monitoringAdapter = impl;
};