// Shim for React Native's NativeSourceCode TurboModule in bridgeless mode
// Provides minimal constants used by dev server detection and asset resolution.

function getDefaultScriptURL() {
  if (typeof global.__bundleUrl === 'string') {
    return global.__bundleUrl;
  }
  if (typeof location !== 'undefined' && location && location.href) {
    return location.href;
  }
  return 'http://localhost:8081/index.bundle?platform=android&dev=true&minify=false';
}

const shim = {
  getConstants() {
    return { scriptURL: getDefaultScriptURL() };
  },
};

export default shim;
module.exports = shim;


