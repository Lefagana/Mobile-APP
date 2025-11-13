export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp?: number;
}

export interface IAnalyticsAdapter {
  /**
   * Track an event
   */
  track(event: AnalyticsEvent): void;

  /**
   * Identify a user
   */
  identify(userId: string, traits?: Record<string, any>): void;

  /**
   * Set user properties
   */
  setUserProperties(properties: Record<string, any>): void;

  /**
   * Track a screen view
   */
  screen(name: string, properties?: Record<string, any>): void;

  /**
   * Reset/clear user data (on logout)
   */
  reset(): void;
}

// Export adapter instance (will be set based on environment)
export let analyticsAdapter: IAnalyticsAdapter;

export const setAnalyticsAdapter = (impl: IAnalyticsAdapter) => {
  analyticsAdapter = impl;
};