// Learn more https://docs.expo.io/guides/customizing-metro
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Workaround for Node.js v24 compatibility on Windows
// The issue is with Metro trying to create externals with 'node:sea' which contains invalid colon character
config.resolver = {
  ...config.resolver,
  // Let Metro/Expo resolve package exports as defined by the package.
  // The previous custom resolver forced `expo-modules-core/build/index.js`,
  // which breaks with SDK 54 where exports are defined differently.
  unstable_enablePackageExports: true,
  // Provide a targeted alias for RN's PlatformConstants TurboModule on Android
  resolveRequest: (context, moduleName, platform) => {
    const shimPlatformConstants = path.join(__dirname, 'src/shims/NativePlatformConstantsAndroid.js');
    const shimNativeSourceCode = path.join(__dirname, 'src/shims/NativeSourceCode.js');

    // Case 1: Absolute/aliased import
    if (platform === 'android') {
      if (
        moduleName === 'react-native/Libraries/Utilities/NativePlatformConstantsAndroid' ||
        moduleName.endsWith('/Libraries/Utilities/NativePlatformConstantsAndroid')
      ) {
        return { type: 'sourceFile', filePath: shimPlatformConstants };
      }
      if (
        moduleName === 'react-native/Libraries/NativeModules/specs/NativeSourceCode' ||
        moduleName.endsWith('/Libraries/NativeModules/specs/NativeSourceCode')
      ) {
        return { type: 'sourceFile', filePath: shimNativeSourceCode };
      }

      // Case 2: Relative import from RN's Platform.android.js
      // When Platform.android.js does: `import ... from './NativePlatformConstantsAndroid'`
      // we detect the origin and redirect to our shim.
      const origin = context?.originModulePath || '';
      if (
        origin.endsWith(
          `${path.sep}react-native${path.sep}Libraries${path.sep}Utilities${path.sep}Platform.android.js`
        ) &&
        (moduleName === './NativePlatformConstantsAndroid' ||
          moduleName === './NativePlatformConstantsAndroid.js')
      ) {
        return { type: 'sourceFile', filePath: shimPlatformConstants };
      }

      // Case 3: Relative import to NativeSourceCode from inside RN
      if (
        origin.includes(`${path.sep}react-native${path.sep}Libraries${path.sep}`) &&
        (moduleName === '../NativeModules/specs/NativeSourceCode' ||
          moduleName === './specs/NativeSourceCode' ||
          moduleName.endsWith('/specs/NativeSourceCode'))
      ) {
        return { type: 'sourceFile', filePath: shimNativeSourceCode };
      }
    }
    // Defer to the default resolver
    if (context.resolveRequest) {
      return context.resolveRequest(context, moduleName, platform);
    }
    try {
      const { resolve } = require('metro-resolver');
      return resolve(context, moduleName, platform);
    } catch (_e) {
      return null;
    }
  },
};

// Additional workaround: configure server to avoid problematic externals
if (config.server) {
  config.server.enhanceMiddleware = (middleware) => {
    return middleware;
  };
}

module.exports = config;

