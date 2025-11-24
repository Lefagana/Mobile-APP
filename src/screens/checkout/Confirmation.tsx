import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import {
  Text,
  useTheme,
  Button,
  Card,
  IconButton,
  Divider,
} from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { CustomerStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/common';
import { useCart } from '../../contexts/CartContext';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type ConfirmationNavigationProp = StackNavigationProp<CustomerStackParamList, 'Confirmation'>;
type ConfirmationRouteProp = RouteProp<CustomerStackParamList, 'Confirmation'>;

const Confirmation: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<ConfirmationNavigationProp>();
  const route = useRoute<ConfirmationRouteProp>();
  const { orderId } = route.params;
  const { clearCart } = useCart();

  const [showAnimation, setShowAnimation] = useState(true);

  // Fetch order details
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => api.orders.getById(orderId),
    enabled: !!orderId,
  });

  // Animation values
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Animate checkmark
    scale.value = withSequence(
      withSpring(1.2, { damping: 8 }),
      withSpring(1, { damping: 8 })
    );
    opacity.value = withTiming(1, { duration: 500 });

    // CRITICAL: Only clear cart if this is NOT a Buy Now order
    const { isBuyNowOrder } = route.params;
    if (!isBuyNowOrder) {
      clearCart();
    }

    // Auto-hide animation after 2 seconds
    setTimeout(() => {
      setShowAnimation(false);
    }, 2000);
  }, [clearCart, route.params]);

  const animatedCheckmarkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handleTrackOrder = () => {
    navigation.navigate('OrderDetail', { orderId });
  };

  const handleContinueShopping = () => {
    navigation.navigate('Home');
  };

  const handleViewOrders = () => {
    navigation.navigate('OrdersList');
  };

  // Calculate ETA (mock calculation - would come from API)
  const getETA = () => {
    if (order?.eta) {
      return new Date(order.eta);
    }
    // Default: 30 minutes from now
    const eta = new Date();
    eta.setMinutes(eta.getMinutes() + 30);
    return eta;
  };

  const eta = getETA();

  return (
    <ScreenContainer scrollable={false} showOfflineBanner={false}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Animation */}
        {showAnimation && (
          <View style={styles.animationContainer}>
            <Animated.View style={[styles.checkmarkContainer, animatedCheckmarkStyle]}>
              <IconButton
                icon="check-circle"
                size={120}
                iconColor={theme.colors.primary}
                style={styles.checkmark}
              />
            </Animated.View>
          </View>
        )}

        {/* Success Message */}
        <Card style={[styles.successCard, { backgroundColor: theme.colors.surface }]}>
          <Text variant="headlineSmall" style={{ color: theme.colors.primary, textAlign: 'center' }}>
            Order Placed Successfully!
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 8 }}
          >
            Thank you for your order. We've sent a confirmation to your phone.
          </Text>
        </Card>

        {/* Order Summary */}
        {order && (
          <Card style={[styles.summaryCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.summaryHeader}>
              <IconButton icon="receipt" size={24} iconColor={theme.colors.primary} disabled />
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                Order Summary
              </Text>
            </View>
            <Divider style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Order ID
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                {order.id}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Order Date
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                {formatDate(order.created_at || new Date().toISOString())}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Total Amount
              </Text>
              <Text
                variant="titleMedium"
                style={{ color: theme.colors.primary, fontWeight: 'bold' }}
              >
                {formatCurrency(order.total, order.currency || 'NGN')}
              </Text>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Estimated Delivery
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.primary, fontWeight: '600' }}>
                {formatDate(eta.toISOString(), { timeStyle: 'short' })}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Payment Method
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                {order.payment_info?.method || 'Wallet'}
              </Text>
            </View>
          </Card>
        )}

        {/* Order Items Preview */}
        {order && order.items && order.items.length > 0 && (
          <Card style={[styles.itemsCard, { backgroundColor: theme.colors.surface }]}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 12 }}>
              Items ({order.items.length})
            </Text>
            <Divider style={styles.divider} />
            {order.items.slice(0, 3).map((item: any, index: number) => (
              <View key={index}>
                <View style={styles.itemRow}>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, flex: 1 }}>
                    {item.product?.name || item.product?.title || 'Product'}
                  </Text>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                    × {item.quantity}
                  </Text>
                </View>
                {index < Math.min(order.items.length, 3) - 1 && <Divider style={styles.itemDivider} />}
              </View>
            ))}
            {order.items.length > 3 && (
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.primary, marginTop: 8, textAlign: 'center' }}
              >
                +{order.items.length - 3} more items
              </Text>
            )}
          </Card>
        )}

        {/* Help Section */}
        <Card style={[styles.helpCard, { backgroundColor: theme.colors.secondaryContainer }]}>
          <View style={styles.helpContent}>
            <IconButton
              icon="help-circle"
              size={24}
              iconColor={theme.colors.onSecondaryContainer}
              disabled
            />
            <View style={styles.helpText}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSecondaryContainer }}>
                Need help with your order?
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSecondaryContainer, marginTop: 4 }}>
                Contact support or track your order status in real-time.
              </Text>
            </View>
          </View>
        </Card>
        {/* Actions */}
        <View style={[styles.bottomActions, { backgroundColor: theme.colors.surface }]}>
          <Button
            mode="contained"
            onPress={handleTrackOrder}
            icon="map-marker-path"
            style={styles.trackButton}
            contentStyle={styles.buttonContent}
          >
            Track Order
          </Button>
          <View style={styles.secondaryButtons}>
            <Button
              mode="outlined"
              onPress={handleViewOrders}
              icon="format-list-bulleted"
              style={styles.secondaryButton}
            >
              View Orders
            </Button>
            <Button
              mode="outlined"
              onPress={handleContinueShopping}
              icon="shopping"
              style={styles.secondaryButton}
            >
              Continue Shopping
            </Button>
          </View>
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
    paddingBottom: 200,
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  checkmarkContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    margin: 0,
  },
  successCard: {
    padding: 24,
    marginBottom: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  summaryCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  divider: {
    marginVertical: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  itemsCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  itemDivider: {
    marginVertical: 4,
  },
  helpCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  helpContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  helpText: {
    flex: 1,
    marginLeft: 4,
  },
  bottomActions: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    marginTop: 12,
  },
  trackButton: {
    marginBottom: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
  },
});

export default Confirmation;

