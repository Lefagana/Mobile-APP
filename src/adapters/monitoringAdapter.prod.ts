import type { IMonitoringAdapter, ErrorContext } from './monitoringAdapter';

/**
 * Production Monitoring Adapter (Stub)
 * 
 * TODO: Implement real error tracking integration:
 * Options:
 * 1. Sentry (recommended for React Native)
 * 2. Bugsnag
 * 3. LogRocket
 * 
 * Example implementation with Sentry:
 * 
 * import * as Sentry from '@sentry/react-native';
 * 
 * // Initialize in App.tsx or ConfigContext
 * Sentry.init({
 *   dsn: process.env.SENTRY_DSN,
 *   environment: process.env.NODE_ENV,
 *   enableInExpoDevelopment: false,
 * });
 * 
 * export const monitoringAdapterProd: IMonitoringAdapter = {
 *   captureException: (error: Error, context?: ErrorContext) => {
 *     if (context?.userId) {
 *       Sentry.setUser({ id: context.userId });
 *     }
 *     if (context?.tags) {
 *       Object.entries(context.tags).forEach(([key, value]) => {
 *         Sentry.setTag(key, value);
 *       });
 *     }
 *     if (context?.extra) {
 *       Sentry.setExtras(context.extra);
 *     }
 *     Sentry.captureException(error);
 *   },
 * 
 *   captureMessage: (message: string, level: 'info' | 'warning' | 'error' = 'info', context?: ErrorContext) => {
 *     const sentryLevel = level === 'error' ? 'error' : level === 'warning' ? 'warning' : 'info';
 *     if (context) {
 *       if (context.userId) {
 *         Sentry.setUser({ id: context.userId });
 *       }
 *       if (context.tags) {
 *         Object.entries(context.tags).forEach(([key, value]) => {
 *           Sentry.setTag(key, value);
 *         });
 *       }
 *       if (context.extra) {
 *         Sentry.setExtras(context.extra);
 *       }
 *     }
 *     Sentry.captureMessage(message, sentryLevel);
 *   },
 * 
 *   setUser: (userId: string, email?: string, username?: string) => {
 *     Sentry.setUser({
 *       id: userId,
 *       email,
 *       username,
 *     });
 *   },
 * 
 *   clearUser: () => {
 *     Sentry.setUser(null);
 *   },
 * 
 *   addBreadcrumb: (message: string, category?: string, level: 'info' | 'warning' | 'error' = 'info', data?: Record<string, any>) => {
 *     Sentry.addBreadcrumb({
 *       message,
 *       category: category || 'default',
 *       level: level === 'error' ? 'error' : level === 'warning' ? 'warning' : 'info',
 *       data,
 *     });
 *   },
 * };
 */

export const monitoringAdapterProd: IMonitoringAdapter = {
  captureException: (error: Error, context?: ErrorContext) => {
    // No-op when monitoring key is not provided
    // In production, implement with real error tracking SDK
  },

  captureMessage: (message: string, level: 'info' | 'warning' | 'error' = 'info', context?: ErrorContext) => {
    // No-op when monitoring key is not provided
  },

  setUser: (userId: string, email?: string, username?: string) => {
    // No-op when monitoring key is not provided
  },

  clearUser: () => {
    // No-op when monitoring key is not provided
  },

  addBreadcrumb: (message: string, category?: string, level: 'info' | 'warning' | 'error' = 'info', data?: Record<string, any>) => {
    // No-op when monitoring key is not provided
  },
};
