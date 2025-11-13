// CRITICAL: Entry polyfills are loaded via index.js before this file
// NOTE: In SDK 54, registerWebModule should be available, so polyfill may not be needed
// Temporarily disabled to test if SDK 54 has registerWebModule built-in
// if (typeof window !== 'undefined') {
//   require('./src/polyfills/expo-modules-core.web');
// }

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import './src/i18n'; // Initialize i18n

// Theme
import { lightTheme } from './src/theme/theme';

// Contexts
import { ConfigProvider } from './src/contexts/ConfigContext';
import { NetworkProvider } from './src/contexts/NetworkContext';
import { AuthProvider } from './src/contexts/AuthContext';
import { CartProvider } from './src/contexts/CartContext';
import { LocalizationProvider } from './src/contexts/LocalizationContext';

// Navigation
import { AppNavigator } from './src/navigation/AppNavigator';

// Error Boundary
import { ErrorBoundary } from './src/components/common/ErrorBoundary';
import { registerActionHandlers } from './src/services/actionHandlers';
import { registerActionHandler } from './src/hooks/useOfflineQueue';

// Create TanStack Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

export default function App() {
  // Register offline queue action handlers on app initialization
  React.useEffect(() => {
    registerActionHandlers(registerActionHandler);
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <ConfigProvider>
          <NetworkProvider>
            <AuthProvider>
              <CartProvider>
                <LocalizationProvider>
                  <QueryClientProvider client={queryClient}>
                    <PaperProvider theme={lightTheme}>
                      <StatusBar style="auto" />
                      <ErrorBoundary>
                        <AppNavigator />
                      </ErrorBoundary>
                    </PaperProvider>
                  </QueryClientProvider>
                </LocalizationProvider>
              </CartProvider>
            </AuthProvider>
          </NetworkProvider>
        </ConfigProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
