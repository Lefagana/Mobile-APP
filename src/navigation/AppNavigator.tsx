import React, { useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import type { RootStackParamList } from './types';
import { AuthStack } from './AuthStack';
import { CustomerStack } from './CustomerStack';
import { VendorStack } from './VendorStack';
import { useEffect, useState } from 'react';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { isLoading, user } = useAuth();
  const navigationRef = useRef<any>(null);

  // Determine which stack to show based on user role
  const getInitialRouteName = (): 'Auth' | 'Customer' | 'Vendor' => {
    if (!user) return 'Auth';

    // Role-based routing
    switch (user.role) {
      case 'vendor':
        return 'Vendor';
      case 'rider':
        // For now, riders go to customer (will add RiderStack later)
        return 'Customer';
      case 'customer':
      default:
        return 'Customer';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={getInitialRouteName()}
      >
        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen name="Customer" component={CustomerStack} />
        <Stack.Screen name="Vendor" component={VendorStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});
