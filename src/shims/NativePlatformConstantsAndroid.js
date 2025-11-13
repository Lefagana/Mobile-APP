// Shim for React Native's NativePlatformConstantsAndroid TurboModule in bridgeless mode
// Provides minimal constants to satisfy Platform.android consumers and libraries.

const DEFAULTS = {
  isTesting: false,
  reactNativeVersion: { major: 0, minor: 73, patch: 6, prerelease: null },
  Version: 30,
  Release: '11',
  Serial: 'unknown',
  Fingerprint: 'unknown',
  Model: 'Generic',
  ServerHost: undefined,
  uiMode: 'normal',
  Brand: 'Generic',
  Manufacturer: 'Generic',
};

const shim = {
  getConstants() {
    return DEFAULTS;
  },
  getAndroidID() {
    return 'unknown';
  },
};

export default shim;
// Also provide CommonJS default for RN consumers
module.exports = shim;


