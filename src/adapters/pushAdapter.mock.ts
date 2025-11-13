import type { IPushAdapter, PushNotificationPayload } from './pushAdapter';

/**
 * Mock Push Notification Adapter
 * Simulates push notifications for development and testing
 */
export const pushAdapterMock: IPushAdapter = {
  requestPermission: async (): Promise<boolean> => {
    // Simulate permission request delay
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('[MOCK Push] Permission requested - granted in mock mode');
    return true; // Always granted in mock mode
  },

  getToken: async (): Promise<string | null> => {
    // Simulate token generation
    await new Promise(resolve => setTimeout(resolve, 300));
    const token = `mock_push_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log('[MOCK Push] Token generated:', token);
    return token;
  },

  sendNotification: async (payload: PushNotificationPayload): Promise<void> => {
    // Simulate sending notification
    await new Promise(resolve => setTimeout(resolve, 200));
    console.log('[MOCK Push] Notification sent:', payload);
    
    // In mock mode, we can simulate receiving the notification
    // This would trigger the onNotificationReceived callbacks if set up
    setTimeout(() => {
      // Simulate notification being received
      console.log('[MOCK Push] Notification received (simulated):', payload);
    }, 500);
  },

  onNotificationReceived: (callback: (payload: PushNotificationPayload) => void): (() => void) => {
    console.log('[MOCK Push] Notification received listener registered');
    // In mock mode, we don't actually receive real notifications
    // This would be implemented with Expo Notifications in production
    return () => {
      console.log('[MOCK Push] Notification received listener removed');
    };
  },

  onNotificationOpened: (callback: (payload: PushNotificationPayload) => void): (() => void) => {
    console.log('[MOCK Push] Notification opened listener registered');
    // In mock mode, we don't actually receive real notifications
    // This would be implemented with Expo Notifications in production
    return () => {
      console.log('[MOCK Push] Notification opened listener removed');
    };
  },
};
