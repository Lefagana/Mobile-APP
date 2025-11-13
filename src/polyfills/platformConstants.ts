// Polyfill for PlatformConstants in bridgeless mode
// This provides PlatformConstants through Platform.constants when NativeModules.PlatformConstants is not available
// This must be loaded before any modules that use PlatformConstants (e.g., react-native-gesture-handler, react-native-paper)

import { NativeModules, Platform } from 'react-native';

// Get Platform.constants as the source of truth
const platformConstants = Platform.constants || {};

// Create a polyfill object that matches the expected PlatformConstants interface
const PlatformConstantsPolyfill = {
  ...platformConstants,
  // Ensure required properties exist
  forceTouchAvailable: platformConstants.forceTouchAvailable || false,
  reactNativeVersion: platformConstants.reactNativeVersion || {
    major: 0,
    minor: 73,
    patch: 6,
    prerelease: null,
  },
};

// Patch NativeModules to include PlatformConstants if it's missing
if (NativeModules && !NativeModules.PlatformConstants) {
  Object.defineProperty(NativeModules, 'PlatformConstants', {
    value: PlatformConstantsPolyfill,
    writable: false,
    enumerable: true,
    configurable: false,
  });
}

// Patch TurboModuleRegistry and its internal requireModule function
// This intercepts getEnforcing calls for PlatformConstants
// Since TurboModule interop is disabled, we need to patch the internal requireModule
try {
  // Patch global.__turboModuleProxy to handle PlatformConstants
  const globalObj = global as any;
  const originalTurboModuleProxy = globalObj.__turboModuleProxy;
  if (originalTurboModuleProxy) {
    globalObj.__turboModuleProxy = function(name: string) {
      if (name === 'PlatformConstants') {
        return PlatformConstantsPolyfill;
      }
      return originalTurboModuleProxy(name);
    };
  }

  // Also patch TurboModuleRegistry methods directly
  const ReactNative = require('react-native');
  
  // Try to get TurboModuleRegistry as a namespace
  let TurboModuleRegistry: any = null;
  try {
    TurboModuleRegistry = require('react-native').TurboModuleRegistry;
  } catch (e) {
    // Try alternative import path
    try {
      TurboModuleRegistry = ReactNative.TurboModuleRegistry;
    } catch (e2) {
      // Not available
    }
  }

  if (TurboModuleRegistry) {
    const originalGet = TurboModuleRegistry.get;
    const originalGetEnforcing = TurboModuleRegistry.getEnforcing;

    // Patch get method
    if (originalGet) {
      TurboModuleRegistry.get = function<T>(name: string): T | null {
        if (name === 'PlatformConstants') {
          return PlatformConstantsPolyfill as T;
        }
        return originalGet.call(this, name);
      };
    }

    // Patch getEnforcing method (this is what's causing the error)
    if (originalGetEnforcing) {
      TurboModuleRegistry.getEnforcing = function<T>(name: string): T {
        if (name === 'PlatformConstants') {
          return PlatformConstantsPolyfill as T;
        }
        return originalGetEnforcing.call(this, name);
      };
    }

    // Also patch on ReactNative object if it exists there
    if (ReactNative.TurboModuleRegistry && ReactNative.TurboModuleRegistry !== TurboModuleRegistry) {
      if (originalGet) {
        ReactNative.TurboModuleRegistry.get = TurboModuleRegistry.get;
      }
      if (originalGetEnforcing) {
        ReactNative.TurboModuleRegistry.getEnforcing = TurboModuleRegistry.getEnforcing;
      }
    }
  }
} catch (e) {
  // TurboModuleRegistry might not be available yet, that's okay
  // The polyfill will still work through NativeModules
  console.warn('PlatformConstants polyfill: Could not patch TurboModuleRegistry', e);
}

export default PlatformConstantsPolyfill;

