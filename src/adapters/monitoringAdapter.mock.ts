import type { IMonitoringAdapter, ErrorContext } from './monitoringAdapter';

/**
 * Mock Monitoring Adapter
 * Logs errors and messages to console for development
 * No-op implementation when monitoring key is not provided
 */
export const monitoringAdapterMock: IMonitoringAdapter = {
  captureException: (error: Error, context?: ErrorContext) => {
    console.error('[MOCK Monitoring] Exception captured:', error.message, error.stack);
    if (context) {
      console.error('[MOCK Monitoring] Context:', context);
    }
    // In production, this would send to Sentry/Bugsnag/etc.
  },

  captureMessage: (message: string, level: 'info' | 'warning' | 'error' = 'info', context?: ErrorContext) => {
    const logMethod = level === 'error' ? console.error : level === 'warning' ? console.warn : console.log;
    logMethod(`[MOCK Monitoring] ${level.toUpperCase()}:`, message);
    if (context) {
      logMethod('[MOCK Monitoring] Context:', context);
    }
  },

  setUser: (userId: string, email?: string, username?: string) => {
    console.log('[MOCK Monitoring] User set:', { userId, email, username });
  },

  clearUser: () => {
    console.log('[MOCK Monitoring] User cleared');
  },

  addBreadcrumb: (message: string, category?: string, level: 'info' | 'warning' | 'error' = 'info', data?: Record<string, any>) => {
    console.log(`[MOCK Monitoring] Breadcrumb [${category || 'default'}]:`, message, data);
  },
};
