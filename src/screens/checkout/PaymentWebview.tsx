import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, Linking, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { Text, useTheme, Button, IconButton } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { CustomerStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/common';
import { api } from '../../services/api';
import { paystackAdapter } from '../../adapters/paystackAdapter';

type PaymentWebviewNavigationProp = StackNavigationProp<CustomerStackParamList, 'PaymentWebview'>;
type PaymentWebviewRouteProp = RouteProp<CustomerStackParamList, 'PaymentWebview'>;

const PaymentWebview: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<PaymentWebviewNavigationProp>();
  const route = useRoute<PaymentWebviewRouteProp>();
  const { url, reference } = route.params;

  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'processing' | 'success' | 'failed' | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  // Verify payment after WebBrowser closes
  const verifyPayment = useCallback(async () => {
    setLoading(true);
    try {
      // Verify payment with backend
      const verifyResponse = await api.payments.verify(reference);

      if (verifyResponse.status === 'success') {
        setPaymentStatus('success');
        // Navigate to confirmation after a short delay
        setTimeout(() => {
          // The order ID should come from the payment response
          // For now, we'll use a placeholder
          navigation.replace('Confirmation', {
            orderId: reference || 'ORD-123',
          });
        }, 1500);
      } else {
        setPaymentStatus('failed');
        setError(verifyResponse.message || 'Payment verification failed');
      }
    } catch (err: any) {
      setPaymentStatus('failed');
      setError(err?.message || 'Failed to verify payment');
    } finally {
      setLoading(false);
    }
  }, [reference, navigation]);

  // Open payment URL in browser
  useEffect(() => {
    const openPayment = async () => {
      setLoading(true);
      try {
        const result = await WebBrowser.openBrowserAsync(url, {
          showTitle: true,
          toolbarColor: '#FFFFFF',
          enableBarCollapsing: false,
        });

        // Check if user dismissed the browser
        if (result.type === 'dismiss') {
          handlePaymentCancel();
        } else {
          // Verify payment after browser closes
          await verifyPayment();
        }
      } catch (err: any) {
        setPaymentStatus('failed');
        setError(err?.message || 'Failed to open payment page');
        setLoading(false);
      }
    };

    openPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  const handlePaymentCancel = useCallback(() => {
    Alert.alert(
      'Payment Cancelled',
      'Your payment was cancelled. You can try again or choose another payment method.',
      [
        {
          text: 'Try Again',
          onPress: () => {
            // Reload the webview
            setLoading(true);
            setPaymentStatus(null);
            setError(null);
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  }, [navigation]);

  // Handle deep links (in case payment redirects to app)
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      if (event.url.includes('payment') || event.url.includes('callback')) {
        verifyPayment();
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, [verifyPayment]);

  if (paymentStatus === 'success') {
    return (
      <ScreenContainer>
        <View style={styles.successContainer}>
          <IconButton icon="check-circle" size={64} iconColor={theme.colors.primary} />
          <Text variant="headlineSmall" style={{ color: theme.colors.primary, marginTop: 16 }}>
            Payment Successful!
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
            Redirecting to order confirmation...
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  if (paymentStatus === 'failed' || error) {
    return (
      <ScreenContainer>
        <View style={styles.errorContainer}>
          <IconButton icon="alert-circle" size={64} iconColor={theme.colors.error} />
          <Text variant="headlineSmall" style={{ color: theme.colors.error, marginTop: 16 }}>
            Payment Failed
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
            {error || 'Unable to process payment. Please try again.'}
          </Text>
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={() => {
                setPaymentStatus(null);
                setError(null);
                setLoading(true);
              }}
              style={styles.button}
            >
              Try Again
            </Button>
            <Button
              mode="outlined"
              onPress={() => navigation.goBack()}
              style={styles.button}
            >
              Go Back
            </Button>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable={false}>
      <View style={styles.header}>
        <IconButton
          icon="close"
          size={24}
          onPress={handlePaymentCancel}
          iconColor={theme.colors.onSurface}
        />
        <Text variant="titleMedium" style={{ color: theme.colors.onSurface, flex: 1 }}>
          Complete Payment
        </Text>
        <View style={{ width: 48 }} />
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, marginTop: 16 }}>
            Loading payment page...
          </Text>
        </View>
      )}

      <View style={styles.webview}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, marginTop: 16 }}>
            Opening payment page in browser...
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12,
    width: '100%',
  },
  button: {
    marginTop: 8,
  },
});

export default PaymentWebview;

