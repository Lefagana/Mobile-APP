import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../contexts/AuthContext';
import type { AuthStackParamList } from '../../navigation/types';

type SplashScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Splash'>;

const Splash: React.FC = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      // Navigate based on auth status
      if (isAuthenticated) {
        // Will be handled by AppNavigator
        return;
      }
      
      // Small delay for splash effect
      const timer = setTimeout(() => {
        navigation.replace('RoleSelector');
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isLoading, isAuthenticated, navigation]);

  return (
    <View style={styles.container}>
      {/* App Logo/Branding */}
      <View style={styles.brandContainer}>
        <Text style={styles.brandText}>Wakanda-X</Text>
        <Text style={styles.tagline}>Your One-Stop Shop</Text>
      </View>

      <ActivityIndicator size="large" color="#FF6B35" style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  brandText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#666666',
  },
  loader: {
    marginTop: 24,
  },
});

export default Splash;
