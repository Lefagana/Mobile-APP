export interface PushNotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: string;
  badge?: number;
  priority?: 'default' | 'high';
}

export interface PushSubscription {
  token: string;
  platform: 'ios' | 'android' | 'web';
}

export interface IPushAdapter {
  /**
   * Request push notification permissions
   */
  requestPermission(): Promise<boolean>;

  /**
   * Get push notification token
   */
  getToken(): Promise<string | null>;

  /**
   * Send push notification (usually handled by backend, this is for local testing)
   */
  sendNotification(payload: PushNotificationPayload): Promise<void>;

  /**
   * Handle notification received in foreground
   */
  onNotificationReceived(callback: (payload: PushNotificationPayload) => void): () => void;

  /**
   * Handle notification tapped/opened
   */
  onNotificationOpened(callback: (payload: PushNotificationPayload) => void): () => void;
}

// Export adapter instance (will be set based on environment)
export let pushAdapter: IPushAdapter;

export const setPushAdapter = (impl: IPushAdapter) => {
  pushAdapter = impl;
};