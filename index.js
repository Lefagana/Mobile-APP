// Load critical polyfills BEFORE React Native / Expo
require('./src/polyfills/platformConstants.early');

// Hand off to Expo's default entry
require('expo/AppEntry');


