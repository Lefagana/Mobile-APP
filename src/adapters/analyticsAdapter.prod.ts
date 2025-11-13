import type { IAnalyticsAdapter, AnalyticsEvent } from './analyticsAdapter';

/**
 * Production Analytics Adapter (Stub)
 * 
 * TODO: Implement real analytics integration:
 * Options:
 * 1. Amplitude (recommended for React Native)
 * 2. Mixpanel
 * 3. Firebase Analytics
 * 4. Segment
 * 
 * Example implementation with Amplitude:
 * 
 * import * as Amplitude from 'expo-amplitude';
 * 
 * // Initialize in ConfigContext or App.tsx
 * Amplitude.initialize(process.env.AMPLITUDE_API_KEY);
 * 
 * export const analyticsAdapterProd: IAnalyticsAdapter = {
 *   track: (event: AnalyticsEvent) => {
 *     Amplitude.logEvent(event.name, event.properties);
 *   },
 * 
 *   identify: (userId: string, traits?: Record<string, any>) => {
 *     Amplitude.setUserId(userId);
 *     if (traits) {
 *       Amplitude.setUserProperties(traits);
 *     }
 *   },
 * 
 *   setUserProperties: (properties: Record<string, any>) => {
 *     Amplitude.setUserProperties(properties);
 *   },
 * 
 *   screen: (name: string, properties?: Record<string, any>) => {
 *     Amplitude.logEvent(`Screen: ${name}`, properties);
 *   },
 * 
 *   reset: () => {
 *     Amplitude.clearUserProperties();
 *     Amplitude.setUserId(null);
 *   },
 * };
 * 
 * Example with Firebase Analytics:
 * 
 * import analytics from '@react-native-firebase/analytics';
 * 
 * export const analyticsAdapterProd: IAnalyticsAdapter = {
 *   track: async (event: AnalyticsEvent) => {
 *     await analytics().logEvent(event.name, event.properties);
 *   },
 * 
 *   identify: async (userId: string, traits?: Record<string, any>) => {
 *     await analytics().setUserId(userId);
 *     if (traits) {
 *       await analytics().setUserProperties(traits);
 *     }
 *   },
 * 
 *   setUserProperties: async (properties: Record<string, any>) => {
 *     await analytics().setUserProperties(properties);
 *   },
 * 
 *   screen: async (name: string, properties?: Record<string, any>) => {
 *     await analytics().logScreenView({
 *       screen_name: name,
 *       screen_class: name,
 *       ...properties,
 *     });
 *   },
 * 
 *   reset: async () => {
 *     await analytics().resetAnalyticsData();
 *   },
 * };
 */

export const analyticsAdapterProd: IAnalyticsAdapter = {
  track: (event: AnalyticsEvent) => {
    // No-op when analytics key is not provided
    // In production, implement with real analytics SDK
  },

  identify: (userId: string, traits?: Record<string, any>) => {
    // No-op when analytics key is not provided
  },

  setUserProperties: (properties: Record<string, any>) => {
    // No-op when analytics key is not provided
  },

  screen: (name: string, properties?: Record<string, any>) => {
    // No-op when analytics key is not provided
  },

  reset: () => {
    // No-op when analytics key is not provided
  },
};
