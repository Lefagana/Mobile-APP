import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import {
  Text,
  useTheme,
  Card,
  IconButton,
  Chip,
  Button,
  FAB,
} from 'react-native-paper';
import { ScreenContainer, EmptyState } from '../../components/common';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account' | 'wallet';
  name: string;
  last4?: string;
  is_default: boolean;
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm_001',
    type: 'card',
    name: 'Visa •••• 1234',
    last4: '1234',
    is_default: true,
  },
  {
    id: 'pm_002',
    type: 'bank_account',
    name: 'GTBank •••• 5678',
    last4: '5678',
    is_default: false,
  },
  {
    id: 'pm_003',
    type: 'wallet',
    name: 'Wakanda Wallet',
    is_default: false,
  },
];

const PaymentMethods: React.FC = () => {
  const theme = useTheme();
  const [paymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);

  const handleAddMethod = () => {
    console.log('Add payment method');
  };

  const handleSetDefault = (methodId: string) => {
    console.log('Set default payment method', methodId);
  };

  const handleDeleteMethod = (methodId: string) => {
    console.log('Delete payment method', methodId);
  };

  const getMethodIcon = (type: PaymentMethod['type']) => {
    switch (type) {
      case 'card':
        return 'credit-card';
      case 'bank_account':
        return 'bank';
      default:
        return 'wallet';
    }
  };

  const renderPaymentMethod = useCallback(
    ({ item }: { item: PaymentMethod }) => {
      return (
        <Card style={[styles.methodCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.methodHeader}>
            <View style={styles.methodInfo}>
              <IconButton
                icon={getMethodIcon(item.type)}
                size={32}
                iconColor={theme.colors.primary}
              />
              <View style={styles.methodDetails}>
                <View style={styles.methodNameRow}>
                  <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                    {item.name}
                  </Text>
                  {item.is_default && (
                    <Chip
                      style={[styles.defaultChip, { backgroundColor: theme.colors.primaryContainer }]}
                      textStyle={{ color: theme.colors.onPrimaryContainer, fontSize: 10 }}
                    >
                      Default
                    </Chip>
                  )}
                </View>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                  {item.type === 'card' && 'Debit Card'}
                  {item.type === 'bank_account' && 'Bank Account'}
                  {item.type === 'wallet' && 'Digital Wallet'}
                </Text>
              </View>
            </View>
            <View style={styles.methodActions}>
              {!item.is_default && (
                <IconButton
                  icon="star-outline"
                  size={24}
                  iconColor={theme.colors.onSurfaceVariant}
                  onPress={() => handleSetDefault(item.id)}
                />
              )}
              <IconButton
                icon="delete"
                size={24}
                iconColor={theme.colors.error}
                onPress={() => handleDeleteMethod(item.id)}
              />
            </View>
          </View>
        </Card>
      );
    },
    [theme]
  );

  return (
    <ScreenContainer scrollable={false} showOfflineBanner={true}>
      <FlatList
        data={paymentMethods}
        renderItem={renderPaymentMethod}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentContainer}
        ListEmptyComponent={
          <EmptyState
            icon="credit-card-outline"
            title="No payment methods"
            description="Add a payment method to make checkout faster."
          />
        }
        showsVerticalScrollIndicator={false}
      />
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleAddMethod}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  methodCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  methodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  methodInfo: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  methodDetails: {
    flex: 1,
  },
  methodNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  defaultChip: {
    height: 20,
  },
  methodActions: {
    flexDirection: 'row',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 80,
  },
});

export default PaymentMethods;

