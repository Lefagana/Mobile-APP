import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import {
  Text,
  useTheme,
  Chip,
  Divider,
  ActivityIndicator,
  Card,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { CustomerStackParamList } from '../../navigation/types';
import { ScreenContainer, EmptyState, ErrorState } from '../../components/common';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Order, OrderStatus } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

type OrdersListNavigationProp = StackNavigationProp<CustomerStackParamList, 'OrdersList'>;

type OrderTab = 'active' | 'completed' | 'cancelled';

const OrdersList: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<OrdersListNavigationProp>();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<OrderTab>('active');

  // Fetch orders
  const {
    data: orders,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: () => api.orders.list(user?.id || 'user_001'),
    enabled: !!user?.id,
  });

  const filterOrders = (orders: Order[] | undefined, tab: OrderTab): Order[] => {
    if (!orders) return [];

    switch (tab) {
      case 'active':
        return orders.filter(
          (o) =>
            o.status === 'pending' ||
            o.status === 'accepted' ||
            o.status === 'preparing' ||
            o.status === 'out_for_delivery'
        );
      case 'completed':
        return orders.filter((o) => o.status === 'delivered');
      case 'cancelled':
        return orders.filter((o) => o.status === 'cancelled' || o.status === 'refunded');
      default:
        return orders;
    }
  };

  const filteredOrders = filterOrders(orders, activeTab);

  const handleOrderPress = useCallback(
    (order: Order) => {
      navigation.navigate('OrderDetail', { orderId: order.id });
    },
    [navigation]
  );

  const renderOrderCard = useCallback(
    ({ item }: { item: Order }) => {
      const firstProduct = item.items[0]?.product;
      const displayImage =
        firstProduct?.image_url ||
        firstProduct?.images?.[0] ||
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop';
      const itemsCount = item.items.reduce((sum, i) => sum + i.qty, 0);

      return (
        <Card
          style={[styles.orderCard, { backgroundColor: theme.colors.surface }]}
          onPress={() => handleOrderPress(item)}
          accessibilityRole="button"
          accessibilityLabel={`Order ${item.order_id}, ${item.status}, total ${formatCurrency(item.total, item.currency)}`}
          accessibilityHint="Tap to view order details"
        >
          <View style={styles.orderHeader}>
            <View style={styles.orderInfo}>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                {item.order_id}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                {formatDate(item.created_at)}
              </Text>
            </View>
            <StatusBadge status={item.status as OrderStatus} size="small" />
          </View>

          <Divider style={styles.divider} />

          <View style={styles.orderContent}>
            <Image source={{ uri: displayImage }} style={styles.productImage} resizeMode="cover" />
            <View style={styles.orderDetails}>
              <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                {firstProduct?.name || firstProduct?.title || 'Product'}
                {itemsCount > 1 && ` + ${itemsCount - 1} more`}
              </Text>
              {item.vendor && (
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                  {item.vendor.shop_name}
                </Text>
              )}
              <Text
                variant="titleMedium"
                style={{ color: theme.colors.primary, marginTop: 8, fontWeight: '600' }}
              >
                {formatCurrency(item.total, item.currency)}
              </Text>
            </View>
          </View>

          {item.status === 'out_for_delivery' && (
            <View style={styles.trackButton}>
              <Chip
                icon="map-marker"
                onPress={() => navigation.navigate('LiveTracking', { orderId: item.id })}
                style={[styles.trackChip, { backgroundColor: theme.colors.primaryContainer }]}
                textStyle={{ color: theme.colors.onPrimaryContainer }}
                accessibilityLabel="Track order"
                accessibilityRole="button"
                accessibilityHint="Opens live tracking screen for this order"
              >
                Track Order
              </Chip>
            </View>
          )}
        </Card>
      );
    },
    [theme, handleOrderPress, navigation]
  );

  const renderTabs = () => (
    <View style={[styles.tabContainer, { backgroundColor: theme.colors.surface }]}>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'active' && [styles.activeTab, { borderBottomColor: theme.colors.primary }],
        ]}
        onPress={() => setActiveTab('active')}
        accessibilityRole="tab"
        accessibilityLabel="Active orders"
        accessibilityState={{ selected: activeTab === 'active' }}
        accessibilityHint="Shows active orders"
      >
        <Text
          variant="labelLarge"
          style={[
            styles.tabText,
            activeTab === 'active' && { color: theme.colors.primary, fontWeight: '600' },
            activeTab !== 'active' && { color: theme.colors.onSurfaceVariant },
          ]}
        >
          Active
        </Text>
        {activeTab === 'active' && filteredOrders.length > 0 && (
          <Chip
            style={[styles.tabBadge, { backgroundColor: theme.colors.primaryContainer }]}
            textStyle={{ color: theme.colors.onPrimaryContainer, fontSize: 10 }}
          >
            {filteredOrders.length}
          </Chip>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'completed' && [styles.activeTab, { borderBottomColor: theme.colors.primary }],
        ]}
        onPress={() => setActiveTab('completed')}
        accessibilityRole="tab"
        accessibilityLabel="Completed orders"
        accessibilityState={{ selected: activeTab === 'completed' }}
        accessibilityHint="Shows completed orders"
      >
        <Text
          variant="labelLarge"
          style={[
            styles.tabText,
            activeTab === 'completed' && { color: theme.colors.primary, fontWeight: '600' },
            activeTab !== 'completed' && { color: theme.colors.onSurfaceVariant },
          ]}
        >
          Completed
        </Text>
        {activeTab === 'completed' && filteredOrders.length > 0 && (
          <Chip
            style={[styles.tabBadge, { backgroundColor: theme.colors.primaryContainer }]}
            textStyle={{ color: theme.colors.onPrimaryContainer, fontSize: 10 }}
          >
            {filteredOrders.length}
          </Chip>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'cancelled' && [styles.activeTab, { borderBottomColor: theme.colors.primary }],
        ]}
        onPress={() => setActiveTab('cancelled')}
        accessibilityRole="tab"
        accessibilityLabel="Cancelled orders"
        accessibilityState={{ selected: activeTab === 'cancelled' }}
        accessibilityHint="Shows cancelled orders"
      >
        <Text
          variant="labelLarge"
          style={[
            styles.tabText,
            activeTab === 'cancelled' && { color: theme.colors.primary, fontWeight: '600' },
            activeTab !== 'cancelled' && { color: theme.colors.onSurfaceVariant },
          ]}
        >
          Cancelled
        </Text>
        {activeTab === 'cancelled' && filteredOrders.length > 0 && (
          <Chip
            style={[styles.tabBadge, { backgroundColor: theme.colors.primaryContainer }]}
            textStyle={{ color: theme.colors.onPrimaryContainer, fontSize: 10 }}
          >
            {filteredOrders.length}
          </Chip>
        )}
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <ScreenContainer scrollable={false}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  if (isError) {
    return (
      <ScreenContainer scrollable={false}>
        <ErrorState
          title="Failed to Load Orders"
          message="Unable to load your orders. Please try again."
          onRetry={refetch}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable={false} showOfflineBanner={true}>
      {renderTabs()}
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentContainer}
        ListEmptyComponent={
          <EmptyState
            icon="package-variant-closed"
            title={`No ${activeTab} orders`}
            description={`You don't have any ${activeTab} orders yet.`}
          />
        }
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={refetch}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
  },
  tabBadge: {
    height: 18,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  orderCard: {
    padding: 16,
    marginBottom: 12,
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
  divider: {
    marginVertical: 12,
  },
  orderContent: {
    flexDirection: 'row',
    gap: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  orderDetails: {
    flex: 1,
  },
  trackButton: {
    marginTop: 12,
    alignItems: 'flex-start',
  },
  trackChip: {
    height: 32,
  },
});

export default OrdersList;


