// Early polyfill for PlatformConstants in bridgeless mode
// IMPORTANT: This file must NOT import 'react-native' or any Expo modules.
// It runs before React Native initializes, so we can intercept TurboModule lookups.
//
// Strategy:
// - Hook global.__turboModuleProxy setter to wrap and provide a stub module
//   whenever 'PlatformConstants' is requested via TurboModuleRegistry.getEnforcing/get.
// - Provide a minimal TurboModule shape with getConstants() returning sane defaults.
//
// This prevents TurboModuleRegistry.getEnforcing('PlatformConstants') from throwing
// during initial module evaluation in React Native.

(function () {
  if (typeof global !== 'object') return;
  const g = global;

  // Minimal constants used by RN Platform.* and common libraries
  function getDefaultAndroidConstants() {
    return {
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
  }

  // Provide a stub TurboModule for PlatformConstants
  const PlatformConstantsModule = {
    getConstants: getDefaultAndroidConstants,
    getAndroidID: function () {
      return 'unknown';
    },
  };

  // Provide a stub TurboModule for SourceCode
  function getDefaultScriptURL() {
    // Try to infer from global/location; fall back to Metro default
    if (typeof global.__bundleUrl === 'string') {
      return global.__bundleUrl;
    }
    if (typeof location !== 'undefined' && location && location.href) {
      return location.href;
    }
    return 'http://localhost:8081/index.bundle?platform=android&dev=true&minify=false';
  }
  const SourceCodeModule = {
    getConstants: function () {
      return { scriptURL: getDefaultScriptURL() };
    },
  };

  // Always provide a wrapper function via an accessor so TurboModuleRegistry
  // observes a callable value even before RN sets the real proxy.
  let delegate = (typeof g.__turboModuleProxy === 'function') ? g.__turboModuleProxy : null;
  const wrapper = function(name) {
    if (name === 'PlatformConstants') {
      return PlatformConstantsModule;
    }
    if (name === 'SourceCode') {
      return SourceCodeModule;
    }
    return typeof delegate === 'function' ? delegate(name) : null;
  };

  try {
    Object.defineProperty(g, '__turboModuleProxy', {
      configurable: true,
      enumerable: false,
      get() {
        return wrapper;
      },
      set(v) {
        // Allow RN to set the real proxy; we just delegate to it.
        delegate = v;
      },
    });
  } catch (e) {
    // Fallback: direct assignment, may be overwritten by RN later.
    g.__turboModuleProxy = wrapper;
  }
})();


