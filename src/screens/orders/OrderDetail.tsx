import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Linking, Alert, Platform } from 'react-native';
import {
  Text,
  useTheme,
  IconButton,
  Button,
  Divider,
  ActivityIndicator,
  Card,
} from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { CustomerStackParamList } from '../../navigation/types';
import { ScreenContainer, ErrorState } from '../../components/common';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Order, OrderStatus } from '../../types';
import { api } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';

type OrderDetailRouteProp = {
  params: {
    orderId: string;
  };
};

type OrderDetailNavigationProp = StackNavigationProp<CustomerStackParamList, 'OrderDetail'>;

const ORDER_STATUS_STEPS: OrderStatus[] = [
  'pending',
  'accepted',
  'preparing',
  'out_for_delivery',
  'delivered',
];

const OrderDetail: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<OrderDetailNavigationProp>();
  const route = useRoute<OrderDetailRouteProp>();
  const { orderId } = route.params;

  // Fetch order details
  const {
    data: order,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => api.orders.getById(orderId),
  });

  const handleCallVendor = useCallback(() => {
    if (order?.vendor?.id) {
      // In real app, would use Linking to call phone number
      Linking.openURL(`tel:+2341234567890`);
    }
  }, [order]);

  const handleChatVendor = useCallback(() => {
    // navigation.navigate('ChatWindow', { chatId: `vendor_${order?.vendor_id}` });
    console.log('Navigate to chat with vendor');
  }, [order]);

  const handleCallRider = useCallback(() => {
    if (order?.rider?.phone) {
      Linking.openURL(`tel:${order.rider.phone}`);
    }
  }, [order]);

  const handleChatRider = useCallback(() => {
    // navigation.navigate('ChatWindow', { chatId: `rider_${order?.rider?.id}` });
    console.log('Navigate to chat with rider');
  }, [order]);

  const handleTrackOrder = useCallback(() => {
    if (order?.status === 'out_for_delivery') {
      navigation.navigate('LiveTracking', { orderId: order.id });
    }
  }, [order, navigation]);

  const handleReorder = useCallback(() => {
    // TODO: Add items to cart and navigate to cart
    console.log('Reorder items');
  }, []);

  const handleInitiateReturn = useCallback(() => {
    if (order.status === 'delivered') {
      navigation.navigate('ReturnRequest', { orderId: order.id });
    }
  }, [order, navigation]);

  const [downloadingReceipt, setDownloadingReceipt] = useState(false);

  const handleDownloadReceipt = useCallback(async () => {
    if (!order) return;

    setDownloadingReceipt(true);
    try {
      // In a real app, this would:
      // 1. Call API to generate/download receipt PDF
      // 2. Save to device storage
      // 3. Open/share the file
      
      // Mock implementation
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Simulate receipt generation
      const receiptData = {
        orderId: order.order_id,
        date: formatDate(order.created_at),
        items: order.items,
        total: order.total,
        currency: order.currency,
        paymentMethod: order.payment_info?.method || 'N/A',
        status: order.status,
      };

      // In production, this would use a library like react-native-fs or expo-file-system
      // to save the PDF, or use expo-sharing to share it
      Alert.alert(
        'Receipt Downloaded',
        `Receipt for order ${order.order_id} has been saved to your device.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error downloading receipt:', error);
      Alert.alert('Error', 'Failed to download receipt. Please try again.');
    } finally {
      setDownloadingReceipt(false);
    }
  }, [order]);

  const canReturn = order?.status === 'delivered';

  const getStatusStep = (status: OrderStatus): number => {
    return ORDER_STATUS_STEPS.indexOf(status);
  };

  const renderStatusTimeline = () => {
    if (!order) return null;

    const currentStep = getStatusStep(order.status);
    const isCancelled = order.status === 'cancelled' || order.status === 'refunded';

    if (isCancelled) {
      return (
        <Card style={[styles.section, { backgroundColor: theme.colors.errorContainer }]}>
          <View style={styles.cancelledStatus}>
            <IconButton icon="close-circle" size={32} iconColor={theme.colors.onErrorContainer} />
            <Text variant="titleMedium" style={{ color: theme.colors.onErrorContainer }}>
              {order.status === 'cancelled' ? 'Order Cancelled' : 'Order Refunded'}
            </Text>
          </View>
        </Card>
      );
    }

    return (
      <Card style={[styles.section, { backgroundColor: theme.colors.surface }]}>
        <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
          Order Status
        </Text>
        {ORDER_STATUS_STEPS.map((stepStatus, index) => {
          const isCompleted = index <= currentStep;
          const isCurrent = index === currentStep;

          return (
            <View key={stepStatus} style={styles.timelineItem}>
              <View style={styles.timelineLine}>
                <View
                  style={[
                    styles.timelineDot,
                    isCompleted && { backgroundColor: theme.colors.primary },
                    !isCompleted && { backgroundColor: theme.colors.surfaceVariant },
                  ]}
                >
                  {isCompleted && (
                    <IconButton
                      icon="check"
                      size={16}
                      iconColor={theme.colors.onPrimary}
                      style={styles.checkIcon}
                    />
                  )}
                </View>
                {index < ORDER_STATUS_STEPS.length - 1 && (
                  <View
                    style={[
                      styles.timelineConnector,
                      isCompleted && { backgroundColor: theme.colors.primary },
                      !isCompleted && { backgroundColor: theme.colors.surfaceVariant },
                    ]}
                  />
                )}
              </View>
              <View style={styles.timelineContent}>
                <Text
                  variant="bodyLarge"
                  style={[
                    { color: isCurrent ? theme.colors.primary : theme.colors.onSurface },
                    isCurrent && { fontWeight: '600' },
                  ]}
                >
                  {stepStatus === 'pending' && 'Order Pending'}
                  {stepStatus === 'accepted' && 'Order Accepted'}
                  {stepStatus === 'preparing' && 'Preparing Order'}
                  {stepStatus === 'out_for_delivery' && 'Out for Delivery'}
                  {stepStatus === 'delivered' && 'Delivered'}
                </Text>
                {isCurrent && order.eta && (
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                    ETA: {order.eta}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </Card>
    );
  };

  const renderOrderItems = () => {
    if (!order) return null;

    return (
      <Card style={[styles.section, { backgroundColor: theme.colors.surface }]}>
        <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
          Order Items ({order.items.length})
        </Text>
        {order.items.map((item, index) => {
          const product = item.product;
          const displayImage =
            product.image_url || product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop';

          return (
            <View key={item.id}>
              <View style={styles.orderItem}>
                <Image source={{ uri: displayImage }} style={styles.itemImage} resizeMode="cover" />
                <View style={styles.itemDetails}>
                  <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                    {product.name || product.title}
                  </Text>
                  {item.variant_id && (
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                      Variant: {product.variants?.find(v => v.id === item.variant_id)?.label}
                    </Text>
                  )}
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                    Qty: {item.qty} × {formatCurrency(item.price, order.currency)}
                  </Text>
                </View>
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                  {formatCurrency(item.price * item.qty, order.currency)}
                </Text>
              </View>
              {index < order.items.length - 1 && <Divider style={styles.itemDivider} />}
            </View>
          );
        })}
      </Card>
    );
  };

  if (isLoading) {
    return (
      <ScreenContainer scrollable={false}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  if (isError || !order) {
    return (
      <ScreenContainer scrollable={false}>
        <ErrorState
          title="Order Not Found"
          message="Unable to load order details. Please try again."
          onRetry={refetch}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable={false} showOfflineBanner={true}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Header */}
        <Card style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.orderHeader}>
            <View style={styles.orderInfo}>
              <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                {order.order_id}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                Placed on {formatDate(order.created_at)}
              </Text>
            </View>
            <StatusBadge status={order.status as OrderStatus} />
          </View>
        </Card>

        {/* Status Timeline */}
        {renderStatusTimeline()}

        {/* Order Items */}
        {renderOrderItems()}

        {/* Vendor Info */}
        {order.vendor && (
          <Card style={[styles.section, { backgroundColor: theme.colors.surface }]}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
              Vendor Information
            </Text>
            <View style={styles.vendorInfo}>
              <View style={styles.vendorDetails}>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                  {order.vendor.shop_name}
                </Text>
                {order.vendor.address_text && (
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                    {order.vendor.address_text}
                  </Text>
                )}
              </View>
              <View style={styles.vendorActions}>
                <Button
                  mode="outlined"
                  icon="phone"
                  onPress={handleCallVendor}
                  style={styles.actionButton}
                >
                  Call
                </Button>
                <Button
                  mode="outlined"
                  icon="message-text"
                  onPress={handleChatVendor}
                  style={styles.actionButton}
                >
                  Chat
                </Button>
              </View>
            </View>
          </Card>
        )}

        {/* Rider Info */}
        {order.rider && (
          <Card style={[styles.section, { backgroundColor: theme.colors.surface }]}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
              Delivery Rider
            </Text>
            <View style={styles.riderInfo}>
              {order.rider.photo && (
                <Image source={{ uri: order.rider.photo }} style={styles.riderPhoto} />
              )}
              <View style={styles.riderDetails}>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                  {order.rider.name}
                </Text>
                {order.rider.phone && (
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                    {order.rider.phone}
                  </Text>
                )}
              </View>
              <View style={styles.riderActions}>
                <IconButton icon="phone" size={24} onPress={handleCallRider} />
                <IconButton icon="message-text" size={24} onPress={handleChatRider} />
              </View>
            </View>
          </Card>
        )}

        {/* Delivery Address */}
        <Card style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
            Delivery Address
          </Text>
          <View style={styles.addressInfo}>
            <IconButton icon="map-marker" size={24} iconColor={theme.colors.primary} />
            <View style={styles.addressText}>
              <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                {order.delivery_address.text}
              </Text>
              {order.delivery_address.landmark && (
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                  {order.delivery_address.landmark}
                </Text>
              )}
              {order.delivery_address.instructions && (
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                  Note: {order.delivery_address.instructions}
                </Text>
              )}
            </View>
          </View>
        </Card>

        {/* Payment Info */}
        {order.payment_info && (
          <Card style={[styles.section, { backgroundColor: theme.colors.surface }]}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
              Payment Information
            </Text>
            <View style={styles.paymentInfo}>
              <View style={styles.paymentRow}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Method:
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                  {order.payment_info.method.toUpperCase()}
                </Text>
              </View>
              {order.payment_info.reference && (
                <View style={styles.paymentRow}>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                    Reference:
                  </Text>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                    {order.payment_info.reference}
                  </Text>
                </View>
              )}
              {order.payment_info.status && (
                <View style={styles.paymentRow}>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                    Status:
                  </Text>
                  <StatusBadge
                    status={order.payment_info.status === 'success' ? 'delivered' : 'pending'}
                    size="small"
                  />
                </View>
              )}
            </View>
          </Card>
        )}

        {/* Return Status (if applicable) */}
        {order.status === 'delivered' && (
          <Card style={[styles.section, { backgroundColor: theme.colors.secondaryContainer }]}>
            <View style={styles.returnStatusContainer}>
              <IconButton
                icon="package-variant"
                size={24}
                iconColor={theme.colors.onSecondaryContainer}
                disabled
              />
              <View style={styles.returnStatusInfo}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSecondaryContainer }}>
                  You can request a return within 7 days of delivery
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSecondaryContainer, marginTop: 4 }}>
                  Select items and provide a reason to initiate return
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Order Summary */}
        <Card style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.summaryHeader}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
              Order Summary
            </Text>
            <Button
              mode="outlined"
              icon="download"
              onPress={handleDownloadReceipt}
              loading={downloadingReceipt}
              disabled={downloadingReceipt}
              compact
            >
              {downloadingReceipt ? 'Downloading...' : 'Receipt'}
            </Button>
          </View>
          <View style={styles.summaryRow}>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
              Subtotal
            </Text>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
              {formatCurrency(order.total, order.currency)}
            </Text>
          </View>
          <Divider style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
              Total
            </Text>
            <Text variant="titleLarge" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
              {formatCurrency(order.total, order.currency)}
            </Text>
          </View>
        </Card>
        {/* Actions */}
        <View style={[styles.bottomActions, { backgroundColor: theme.colors.surface }]}>
          {order.status === 'out_for_delivery' && (
            <Button
              mode="contained"
              icon="map-marker"
              onPress={handleTrackOrder}
              style={styles.trackButton}
            >
              Track Order
            </Button>
          )}
          {order.status === 'delivered' && (
            <>
              <Button
                mode="contained"
                icon="package-variant"
                onPress={handleInitiateReturn}
                style={styles.returnButton}
              >
                Initiate Return
              </Button>
              <Button
                mode="outlined"
                icon="cart"
                onPress={handleReorder}
                style={styles.actionButton}
              >
                Reorder
              </Button>
            </>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderInfo: {
    flex: 1,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineLine: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    margin: 0,
  },
  timelineConnector: {
    width: 2,
    height: 40,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 4,
  },
  cancelledStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  orderItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  itemDetails: {
    flex: 1,
  },
  itemDivider: {
    marginVertical: 12,
  },
  vendorInfo: {
    gap: 12,
  },
  vendorDetails: {
    marginBottom: 8,
  },
  vendorActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  riderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  riderPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
  },
  riderDetails: {
    flex: 1,
  },
  riderActions: {
    flexDirection: 'row',
  },
  addressInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressText: {
    flex: 1,
    marginTop: 4,
  },
  paymentInfo: {
    gap: 12,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryDivider: {
    marginVertical: 12,
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 12,
    marginTop: 12,
  },
  trackButton: {
    flex: 1,
    paddingVertical: 4,
  },
  returnButton: {
    flex: 1,
    paddingVertical: 4,
  },
  returnStatusContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  returnStatusInfo: {
    flex: 1,
    marginLeft: 4,
  },
});

export default OrderDetail;


