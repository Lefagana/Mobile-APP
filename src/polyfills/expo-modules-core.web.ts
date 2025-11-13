// Polyfill for expo-modules-core registerWebModule on web
// In SDK 54, registerWebModule should be available via the main export
// This file is kept for backward compatibility but may not be needed in SDK 54+
// We avoid importing expo-modules-core here to prevent build/index.js resolution errors

// The polyfill will be applied lazily when expo-modules-core is actually loaded
// by other modules. We use a module interceptor pattern.

if (typeof window !== 'undefined') {
  // Store original require if available
  const originalRequire = (typeof require !== 'undefined' ? require : null) as any;
  
  if (originalRequire) {
    // Intercept module loading to patch expo-modules-core when it's first required
    const setupPolyfill = () => {
      try {
        // Access the module from cache after it's been loaded by another module
        const moduleId = 'expo-modules-core';
        const cachedModule = originalRequire.cache?.[originalRequire.resolve(moduleId)];
        
        if (cachedModule && cachedModule.exports) {
          const expoModulesCore = cachedModule.exports;
          if (expoModulesCore && !expoModulesCore.registerWebModule) {
            // Add registerWebModule polyfill
            expoModulesCore.registerWebModule = function(
              moduleImplementation: any,
              moduleName: string
            ) {
              // Store in global registry
              (window as any).__expoModules = (window as any).__expoModules || {};
              (window as any).__expoModules[moduleName] = moduleImplementation;
              
              // Handle function/class implementations
              if (typeof moduleImplementation === 'function') {
                const isClass = moduleImplementation.prototype && 
                                moduleImplementation.prototype.constructor === moduleImplementation;
                return isClass ? new moduleImplementation() : moduleImplementation();
              }
              return moduleImplementation;
            };
          }
        }
      } catch (e) {
        // Silently fail - registerWebModule might already be available in SDK 54
      }
    };
    
    // Try to set up after modules start loading
    if (typeof setImmediate !== 'undefined') {
      setImmediate(setupPolyfill);
    } else {
      setTimeout(setupPolyfill, 100);
    }
  }
}

export {};

