import type { IPushAdapter, PushNotificationPayload } from './pushAdapter';

/**
 * Production Push Notification Adapter (Stub)
 * 
 * TODO: Implement real Expo Notifications integration:
 * 1. Install expo-notifications package
 * 2. Configure app.json with notification settings
 * 3. Get Expo Push Token
 * 4. Register token with backend
 * 5. Handle notification events
 * 
 * Example implementation:
 * 
 * import * as Notifications from 'expo-notifications';
 * 
 * // Configure notification behavior
 * Notifications.setNotificationHandler({
 *   handleNotification: async () => ({
 *     shouldShowAlert: true,
 *     shouldPlaySound: true,
 *     shouldSetBadge: true,
 *   }),
 * });
 * 
 * export const pushAdapterProd: IPushAdapter = {
 *   requestPermission: async () => {
 *     const { status } = await Notifications.requestPermissionsAsync();
 *     return status === 'granted';
 *   },
 * 
 *   getToken: async () => {
 *     const tokenData = await Notifications.getExpoPushTokenAsync({
 *       projectId: process.env.EXPO_PROJECT_ID,
 *     });
 *     return tokenData.data;
 *   },
 * 
 *   sendNotification: async (payload) => {
 *     // Usually handled by backend via Expo Push API
 *     // For local testing, you can schedule a local notification:
 *     await Notifications.scheduleNotificationAsync({
 *       content: {
 *         title: payload.title,
 *         body: payload.body,
 *         data: payload.data,
 *         sound: payload.sound || 'default',
 *         badge: payload.badge,
 *       },
 *       trigger: null, // Show immediately
 *     });
 *   },
 * 
 *   onNotificationReceived: (callback) => {
 *     const subscription = Notifications.addNotificationReceivedListener(callback);
 *     return () => subscription.remove();
 *   },
 * 
 *   onNotificationOpened: (callback) => {
 *     const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
 *       callback(response.notification.request.content as PushNotificationPayload);
 *     });
 *     return () => subscription.remove();
 *   },
 * };
 */

export const pushAdapterProd: IPushAdapter = {
  requestPermission: async (): Promise<boolean> => {
    throw new Error(
      'Push production adapter not yet implemented. Please implement pushAdapter.prod.ts with Expo Notifications.'
    );
  },

  getToken: async (): Promise<string | null> => {
    throw new Error(
      'Push production adapter not yet implemented. Please implement pushAdapter.prod.ts with Expo Notifications.'
    );
  },

  sendNotification: async (payload: PushNotificationPayload): Promise<void> => {
    throw new Error(
      'Push production adapter not yet implemented. Please implement pushAdapter.prod.ts with Expo Notifications.'
    );
  },

  onNotificationReceived: (callback: (payload: PushNotificationPayload) => void): (() => void) => {
    throw new Error(
      'Push production adapter not yet implemented. Please implement pushAdapter.prod.ts with Expo Notifications.'
    );
  },

  onNotificationOpened: (callback: (payload: PushNotificationPayload) => void): (() => void) => {
    throw new Error(
      'Push production adapter not yet implemented. Please implement pushAdapter.prod.ts with Expo Notifications.'
    );
  },
};
