import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import {
  Text,
  useTheme,
  Button,
  Card,
  IconButton,
  ActivityIndicator,
  Divider,
  RadioButton,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { CustomerStackParamList } from '../../navigation/types';
import { ScreenContainer, ErrorState } from '../../components/common';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

type PaymentSelectionNavigationProp = StackNavigationProp<CustomerStackParamList, 'PaymentSelection'>;

export type PaymentMethod = 'wallet' | 'paystack' | 'cod' | 'ussd';

interface PaymentMethodOption {
  id: PaymentMethod;
  label: string;
  description: string;
  icon: string;
  available: boolean;
  badge?: string;
}

const PaymentSelection: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<PaymentSelectionNavigationProp>();
  const { cart } = useCart();
  const { user } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('wallet');

  // Fetch wallet balance
  const {
    data: wallet,
    isLoading: isLoadingWallet,
    isError: isWalletError,
  } = useQuery({
    queryKey: ['wallet', user?.id],
    queryFn: () => api.wallet.get(user?.id || 'user_001'),
    enabled: !!user?.id,
  });

  const paymentMethods: PaymentMethodOption[] = [
    {
      id: 'wallet',
      label: 'Wallet',
      description: wallet
        ? `Balance: ${formatCurrency(wallet.balance, 'NGN')}`
        : 'Pay from your wallet',
      icon: 'wallet',
      available: true,
      badge: wallet && wallet.balance < cart.total ? 'Insufficient' : undefined,
    },
    {
      id: 'paystack',
      label: 'Card / Bank Transfer',
      description: 'Pay with Paystack (Card, Bank Transfer)',
      icon: 'credit-card',
      available: true,
    },
    {
      id: 'cod',
      label: 'Cash on Delivery',
      description: 'Pay when you receive your order',
      icon: 'cash',
      available: true,
    },
    {
      id: 'ussd',
      label: 'USSD Bank Transfer',
      description: 'Transfer via USSD code',
      icon: 'phone',
      available: true,
    },
  ];

  const handleMethodSelect = useCallback((method: PaymentMethod) => {
    setSelectedMethod(method);
  }, []);

  const handleContinue = useCallback(() => {
    // Navigate back to CheckoutReview with selected payment method
    navigation.navigate('CheckoutReview', {
      paymentMethod: selectedMethod,
    } as any);
  }, [selectedMethod, navigation]);

  const canProceed = () => {
    if (selectedMethod === 'wallet') {
      return wallet && wallet.balance >= cart.total;
    }
    return true;
  };

  return (
    <ScreenContainer scrollable={false} showOfflineBanner={true}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Summary Header */}
        <Card style={[styles.summaryCard, { backgroundColor: theme.colors.surface }]}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 8 }}>
            Order Total
          </Text>
          <Text variant="displaySmall" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
            {formatCurrency(cart.total, 'NGN')}
          </Text>
        </Card>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
            Select Payment Method
          </Text>

          {paymentMethods.map((method, index) => {
            const isSelected = selectedMethod === method.id;
            const isDisabled = method.id === 'wallet' && !canProceed();

            return (
              <TouchableOpacity
                key={method.id}
                onPress={() => method.available && !isDisabled && handleMethodSelect(method.id)}
                disabled={!method.available || isDisabled}
                activeOpacity={0.7}
              >
                <Card
                  style={[
                    styles.methodCard,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: isSelected ? theme.colors.primary : theme.colors.outline,
                      borderWidth: isSelected ? 2 : 1,
                      opacity: isDisabled ? 0.5 : 1,
                    },
                  ]}
                >
                  <View style={styles.methodContent}>
                    <View style={styles.methodLeft}>
                      <RadioButton
                        value={method.id}
                        status={isSelected ? 'checked' : 'unchecked'}
                        onPress={() => method.available && !isDisabled && handleMethodSelect(method.id)}
                        disabled={!method.available || isDisabled}
                      />
                      <IconButton
                        icon={method.icon}
                        size={24}
                        iconColor={isSelected ? theme.colors.primary : theme.colors.onSurfaceVariant}
                        disabled
                      />
                      <View style={styles.methodInfo}>
                        <View style={styles.methodHeader}>
                          <Text
                            variant="titleMedium"
                            style={{
                              color: isSelected ? theme.colors.primary : theme.colors.onSurface,
                              fontWeight: isSelected ? '600' : '400',
                            }}
                          >
                            {method.label}
                          </Text>
                          {method.badge && (
                            <View
                              style={[
                                styles.badge,
                                { backgroundColor: theme.colors.errorContainer },
                              ]}
                            >
                              <Text
                                variant="labelSmall"
                                style={{ color: theme.colors.onErrorContainer }}
                              >
                                {method.badge}
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text
                          variant="bodySmall"
                          style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}
                        >
                          {method.description}
                        </Text>
                      </View>
                    </View>
                    {isSelected && (
                      <IconButton
                        icon="check-circle"
                        size={24}
                        iconColor={theme.colors.primary}
                        disabled
                      />
                    )}
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Wallet Balance Info */}
        {selectedMethod === 'wallet' && wallet && (
          <Card style={[styles.infoCard, { backgroundColor: theme.colors.secondaryContainer }]}>
            <View style={styles.infoContent}>
              <IconButton icon="information" size={20} iconColor={theme.colors.onSecondaryContainer} disabled />
              <View style={styles.infoText}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSecondaryContainer }}>
                  {wallet.balance >= cart.total
                    ? 'Your wallet balance is sufficient for this order.'
                    : `Your wallet balance is ${formatCurrency(wallet.balance, 'NGN')}. Please top up or choose another payment method.`}
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Payment Method Info */}
        {selectedMethod === 'cod' && (
          <Card style={[styles.infoCard, { backgroundColor: theme.colors.secondaryContainer }]}>
            <View style={styles.infoContent}>
              <IconButton icon="information" size={20} iconColor={theme.colors.onSecondaryContainer} disabled />
              <View style={styles.infoText}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSecondaryContainer }}>
                  You will pay cash when your order is delivered. Please ensure you have the exact amount ready.
                </Text>
              </View>
            </View>
          </Card>
        )}

        {selectedMethod === 'ussd' && (
          <Card style={[styles.infoCard, { backgroundColor: theme.colors.secondaryContainer }]}>
            <View style={styles.infoContent}>
              <IconButton icon="information" size={20} iconColor={theme.colors.onSecondaryContainer} disabled />
              <View style={styles.infoText}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSecondaryContainer }}>
                  You will receive USSD instructions after placing your order. Follow the prompts to complete payment.
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Loading State */}
        {isLoadingWallet && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
              Loading wallet balance...
            </Text>
          </View>
        )}

        {/* Error State */}
        {isWalletError && (
          <ErrorState
            message="Failed to load wallet balance"
            onRetry={() => {
              // Refetch will happen automatically
            }}
          />
        )}
        {/* Actions */}
        <View style={[styles.bottomAction, { backgroundColor: theme.colors.surface }]}>
          <Button
            mode="contained"
            onPress={handleContinue}
            disabled={!canProceed() || isLoadingWallet}
            icon="check"
            style={styles.continueButton}
            contentStyle={styles.buttonContent}
          >
            Continue to Review
          </Button>
          <Text
            variant="bodySmall"
            style={{ color: theme.colors.onSurfaceVariant, marginTop: 8, textAlign: 'center' }}
          >
            You can review your order before placing it
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 120,
  },
  summaryCard: {
    padding: 16,
    marginBottom: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  methodCard: {
    marginBottom: 12,
    padding: 4,
    borderRadius: 12,
  },
  methodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodInfo: {
    flex: 1,
    marginLeft: 8,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  infoCard: {
    marginTop: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    marginLeft: 4,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 16,
  },
  bottomAction: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    marginTop: 12,
  },
  continueButton: {
    paddingVertical: 4,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default PaymentSelection;

