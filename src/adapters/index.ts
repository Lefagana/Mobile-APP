/**
 * Adapter Layer - Pluggable Integrations
 * 
 * This module exports all adapters (Paystack, Maps, OTP, Push, Analytics, Monitoring)
 * and initializes them based on the MOCK_MODE configuration.
 * 
 * To use adapters:
 * ```typescript
 * import { paystackAdapter, mapsAdapter } from '@/adapters';
 * 
 * const result = await paystackAdapter.initiatePayment({ email, amount });
 * ```
 */

// Paystack
export type { IPaystackAdapter, PaystackInitiateRequest, PaystackInitiateResponse, PaystackVerifyResponse } from './paystackAdapter';
export { paystackAdapter, setPaystackAdapter } from './paystackAdapter';
export { paystackAdapterMock } from './paystackAdapter.mock';
export { paystackAdapterProd } from './paystackAdapter.prod';

// Maps
export type { IMapsAdapter, GeocodeRequest, GeocodeResponse, ReverseGeocodeRequest, ReverseGeocodeResponse, AddressSuggestion } from './mapsAdapter';
export { mapsAdapter, setMapsAdapter } from './mapsAdapter';
export { mapsAdapterMock } from './mapsAdapter.mock';
export { mapsAdapterProd } from './mapsAdapter.prod';

// OTP
export type { IOTPAdapter, SendOTPRequest, SendOTPResponse, VerifyOTPRequest, VerifyOTPResponse } from './otpAdapter';
export { otpAdapter, setOTPAdapter } from './otpAdapter';
export { otpAdapterMock } from './otpAdapter.mock';
export { otpAdapterProd } from './otpAdapter.prod';

// Push Notifications
export type { IPushAdapter, PushNotificationPayload, PushSubscription } from './pushAdapter';
export { pushAdapter, setPushAdapter } from './pushAdapter';
export { pushAdapterMock } from './pushAdapter.mock';
export { pushAdapterProd } from './pushAdapter.prod';

// Analytics
export type { IAnalyticsAdapter, AnalyticsEvent } from './analyticsAdapter';
export { analyticsAdapter, setAnalyticsAdapter } from './analyticsAdapter';
export { analyticsAdapterMock } from './analyticsAdapter.mock';
export { analyticsAdapterProd } from './analyticsAdapter.prod';

// Monitoring
export type { IMonitoringAdapter, ErrorContext } from './monitoringAdapter';
export { monitoringAdapter, setMonitoringAdapter } from './monitoringAdapter';
export { monitoringAdapterMock } from './monitoringAdapter.mock';
export { monitoringAdapterProd } from './monitoringAdapter.prod';

/**
 * Initialize adapters based on MOCK_MODE
 * This should be called in ConfigContext when the app starts
 */
export const initializeAdapters = (mockMode: boolean) => {
  // Get setter functions locally to avoid relying on top-level imports here
  const { setPaystackAdapter } = require('./paystackAdapter');
  const { setMapsAdapter } = require('./mapsAdapter');
  const { setOTPAdapter } = require('./otpAdapter');
  const { setPushAdapter } = require('./pushAdapter');
  const { setAnalyticsAdapter } = require('./analyticsAdapter');
  const { setMonitoringAdapter } = require('./monitoringAdapter');

  // Resolve implementations lazily to keep bundles small
  const paystackImpl = mockMode
    ? require('./paystackAdapter.mock').paystackAdapterMock
    : require('./paystackAdapter.prod').paystackAdapterProd;
  setPaystackAdapter(paystackImpl);

  const mapsImpl = mockMode
    ? require('./mapsAdapter.mock').mapsAdapterMock
    : require('./mapsAdapter.prod').mapsAdapterProd;
  setMapsAdapter(mapsImpl);

  const otpImpl = mockMode
    ? require('./otpAdapter.mock').otpAdapterMock
    : require('./otpAdapter.prod').otpAdapterProd;
  setOTPAdapter(otpImpl);

  const pushImpl = mockMode
    ? require('./pushAdapter.mock').pushAdapterMock
    : require('./pushAdapter.prod').pushAdapterProd;
  setPushAdapter(pushImpl);

  const analyticsImpl = mockMode
    ? require('./analyticsAdapter.mock').analyticsAdapterMock
    : require('./analyticsAdapter.prod').analyticsAdapterProd;
  setAnalyticsAdapter(analyticsImpl);

  const monitoringImpl = mockMode
    ? require('./monitoringAdapter.mock').monitoringAdapterMock
    : require('./monitoringAdapter.prod').monitoringAdapterProd;
  setMonitoringAdapter(monitoringImpl);

  console.log(`[Adapters] Initialized in ${mockMode ? 'MOCK' : 'PRODUCTION'} mode`);
};
