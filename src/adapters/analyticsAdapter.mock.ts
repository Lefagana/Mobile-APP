import type { IAnalyticsAdapter, AnalyticsEvent } from './analyticsAdapter';

/**
 * Mock Analytics Adapter
 * Logs events to console for development and testing
 * No-op implementation when analytics key is not provided
 */
export const analyticsAdapterMock: IAnalyticsAdapter = {
  track: (event: AnalyticsEvent) => {
    console.log('[MOCK Analytics] Event tracked:', event);
    // In production, this would send to Amplitude/Mixpanel/etc.
  },

  identify: (userId: string, traits?: Record<string, any>) => {
    console.log('[MOCK Analytics] User identified:', { userId, traits });
  },

  setUserProperties: (properties: Record<string, any>) => {
    console.log('[MOCK Analytics] User properties set:', properties);
  },

  screen: (name: string, properties?: Record<string, any>) => {
    console.log('[MOCK Analytics] Screen viewed:', { name, properties });
  },

  reset: () => {
    console.log('[MOCK Analytics] Analytics reset');
  },
};
