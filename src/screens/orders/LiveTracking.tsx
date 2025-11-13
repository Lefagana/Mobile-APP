import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Dimensions, Linking } from 'react-native';
import { Text, useTheme, IconButton, ActivityIndicator, Card, Chip } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { CustomerStackParamList } from '../../navigation/types';
import { ScreenContainer, ErrorState } from '../../components/common';
import { Order } from '../../types';
import { api } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

const { width, height } = Dimensions.get('window');

type LiveTrackingRouteProp = {
  params: {
    orderId: string;
  };
};

type LiveTrackingNavigationProp = StackNavigationProp<CustomerStackParamList, 'LiveTracking'>;

const LiveTracking: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<LiveTrackingNavigationProp>();
  const route = useRoute<LiveTrackingRouteProp>();
  const { orderId } = route.params;
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

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

  // Simulate live location updates (mock)
  useEffect(() => {
    if (!order?.rider?.lat || !order?.rider?.lng) return;

    // Set initial location
    setCurrentLocation({
      lat: order.rider.lat,
      lng: order.rider.lng,
    });

    // Simulate location updates every 5 seconds
    const interval = setInterval(() => {
      // In real app, this would fetch from a WebSocket or API
      // For mock, we'll slightly adjust the position
      setCurrentLocation((prev) => {
        if (!prev) return null;
        return {
          lat: prev.lat + (Math.random() - 0.5) * 0.001,
          lng: prev.lng + (Math.random() - 0.5) * 0.001,
        };
      });
    }, 5000);

    return () => clearInterval(interval);
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

  const renderMapPlaceholder = () => {
    return (
      <View style={[styles.mapContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
        <View style={styles.mapPlaceholder}>
          <IconButton
            icon="map"
            size={64}
            iconColor={theme.colors.onSurfaceVariant}
            style={styles.mapIcon}
          />
          <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
            Map View
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
            In production, this would show a real-time map with rider location
          </Text>
        </View>

        {/* Mock markers */}
        {order?.delivery_address && currentLocation && (
          <>
            {/* Delivery destination marker */}
            <View style={[styles.marker, styles.destinationMarker, { top: '60%', left: '70%' }]}>
              <IconButton icon="map-marker" size={32} iconColor="#4CAF50" />
            </View>
            {/* Rider location marker */}
            <View style={[styles.marker, styles.riderMarker, { top: '40%', left: '30%' }]}>
              <IconButton icon="bike" size={32} iconColor={theme.colors.primary} />
            </View>
          </>
        )}
      </View>
    );
  };

  const calculateETA = (): string => {
    if (!order?.eta) return 'Calculating...';
    return order.eta;
  };

  const calculateDistance = (): string => {
    // Mock distance calculation
    // In real app, would calculate using coordinates
    return '2.5 km';
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
          message="Unable to load tracking information. Please try again."
          onRetry={refetch}
        />
      </ScreenContainer>
    );
  }

  if (order.status !== 'out_for_delivery') {
    return (
      <ScreenContainer scrollable={false}>
        <View style={styles.errorContainer}>
          <IconButton icon="alert-circle" size={64} iconColor={theme.colors.error} />
          <Text variant="titleLarge" style={{ color: theme.colors.onSurface, marginTop: 16 }}>
            Tracking Not Available
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
            Live tracking is only available when your order is out for delivery.
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable={false} showOfflineBanner={true}>
      {/* Map View */}
      {renderMapPlaceholder()}

      {/* Tracking Info Card */}
      <Card style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.trackingHeader}>
          <View style={styles.trackingInfo}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
              {order.order_id}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
              Estimated delivery: {calculateETA()}
            </Text>
          </View>
          <Chip
            icon="clock-outline"
            style={[styles.etaChip, { backgroundColor: theme.colors.primaryContainer }]}
            textStyle={{ color: theme.colors.onPrimaryContainer }}
          >
            {calculateETA()}
          </Chip>
        </View>

        {/* Rider Info */}
        {order.rider && (
          <View style={styles.riderSection}>
            <View style={styles.riderHeader}>
              <View style={styles.riderInfo}>
                <IconButton icon="bike" size={24} iconColor={theme.colors.primary} />
                <View style={styles.riderDetails}>
                  <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                    {order.rider.name}
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {calculateDistance()} away
                  </Text>
                </View>
              </View>
              <View style={styles.riderActions}>
                <IconButton icon="phone" size={24} onPress={handleCallRider} />
                <IconButton icon="message-text" size={24} onPress={handleChatRider} />
              </View>
            </View>
          </View>
        )}

        {/* Delivery Address */}
        <View style={styles.addressSection}>
          <IconButton icon="map-marker" size={24} iconColor={theme.colors.primary} />
          <View style={styles.addressText}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              Delivering to
            </Text>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, marginTop: 4 }}>
              {order.delivery_address.text}
            </Text>
            {order.delivery_address.landmark && (
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                {order.delivery_address.landmark}
              </Text>
            )}
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.summarySection}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Order Total
          </Text>
          <Text variant="titleLarge" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
            {formatCurrency(order.total, order.currency)}
          </Text>
        </View>
      </Card>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  mapContainer: {
    width: width,
    height: height * 0.5,
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapIcon: {
    margin: 0,
  },
  marker: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 4,
  },
  destinationMarker: {
    elevation: 4,
  },
  riderMarker: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  infoCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 4,
  },
  trackingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  trackingInfo: {
    flex: 1,
  },
  etaChip: {
    height: 32,
  },
  riderSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  riderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  riderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  riderDetails: {
    marginLeft: 8,
    flex: 1,
  },
  riderActions: {
    flexDirection: 'row',
  },
  addressSection: {
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  addressText: {
    flex: 1,
    marginLeft: 8,
  },
  summarySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
});

export default LiveTracking;

