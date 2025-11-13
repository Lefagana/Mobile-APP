import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Linking, Alert } from 'react-native';
import {
  Text,
  useTheme,
  IconButton,
  Card,
  Button,
  Avatar,
  Chip,
  Divider,
} from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { CustomerStackParamList } from '../../navigation/types';
import { ScreenContainer, EmptyState, LoadingSkeleton } from '../../components/common';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';

type LocalDeliveryDriversNavigationProp = StackNavigationProp<
  CustomerStackParamList,
  'LocalDeliveryDrivers'
>;
type LocalDeliveryDriversRouteProp = RouteProp<CustomerStackParamList, 'LocalDeliveryDrivers'>;

interface Driver {
  id: string;
  name: string;
  phone: string;
  photo?: string;
  rating?: number;
  vehicle_type?: string;
  vehicle_number?: string;
  is_available: boolean;
  current_location?: {
    lat: number;
    lng: number;
  };
  distance_km?: number;
  estimated_arrival?: string;
}

// Mock drivers data (would come from API)
const MOCK_DRIVERS: Driver[] = [
  {
    id: 'driver_001',
    name: 'Ibrahim Musa',
    phone: '+234 801 234 5678',
    photo: undefined,
    rating: 4.8,
    vehicle_type: 'Motorcycle',
    vehicle_number: 'ABC 123 XY',
    is_available: true,
    distance_km: 2.5,
    estimated_arrival: '15 min',
  },
  {
    id: 'driver_002',
    name: 'Ahmad Abdullahi',
    phone: '+234 802 345 6789',
    photo: undefined,
    rating: 4.9,
    vehicle_type: 'Motorcycle',
    vehicle_number: 'DEF 456 YZ',
    is_available: true,
    distance_km: 3.2,
    estimated_arrival: '20 min',
  },
  {
    id: 'driver_003',
    name: 'Yusuf Bello',
    phone: '+234 803 456 7890',
    photo: undefined,
    rating: 4.7,
    vehicle_type: 'Tricycle',
    vehicle_number: 'GHI 789 AB',
    is_available: true,
    distance_km: 1.8,
    estimated_arrival: '12 min',
  },
  {
    id: 'driver_004',
    name: 'Musa Danladi',
    phone: '+234 804 567 8901',
    photo: undefined,
    rating: 4.6,
    vehicle_type: 'Motorcycle',
    vehicle_number: 'JKL 012 CD',
    is_available: false,
    distance_km: 5.0,
    estimated_arrival: '30 min',
  },
  {
    id: 'driver_005',
    name: 'Aliyu Shehu',
    phone: '+234 805 678 9012',
    photo: undefined,
    rating: 4.9,
    vehicle_type: 'Motorcycle',
    vehicle_number: 'MNO 345 EF',
    is_available: true,
    distance_km: 4.1,
    estimated_arrival: '25 min',
  },
];

const LocalDeliveryDrivers: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<LocalDeliveryDriversNavigationProp>();
  const route = useRoute<LocalDeliveryDriversRouteProp>();
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);

  // In a real app, this would fetch from API
  const drivers = MOCK_DRIVERS.filter(d => d.is_available);

  const handleCallDriver = useCallback((phone: string) => {
    const phoneNumber = phone.replace(/\s/g, '');
    Linking.openURL(`tel:${phoneNumber}`).catch(() => {
      Alert.alert('Error', 'Unable to make phone call');
    });
  }, []);

  const handleWhatsAppDriver = useCallback((phone: string) => {
    const phoneNumber = phone.replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    Linking.openURL(whatsappUrl).catch(() => {
      Alert.alert('Error', 'Unable to open WhatsApp');
    });
  }, []);

  const handleSelectDriver = useCallback(
    (driverId: string) => {
      setSelectedDriver(driverId);
      const driver = drivers.find(d => d.id === driverId);
      if (driver) {
        Alert.alert(
          'Driver Selected',
          `You selected ${driver.name}. Contact them to arrange delivery details.`,
          [
            {
              text: 'Select Driver',
              onPress: () => {
                // Navigate back with selected driver
                navigation.navigate('CheckoutReview', {
                  selectedDriver: driver,
                } as any);
              },
            },
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => setSelectedDriver(null),
            },
          ]
        );
      }
    },
    [drivers, navigation]
  );

  const renderDriverCard = useCallback(
    ({ item }: { item: Driver }) => {
      const isSelected = selectedDriver === item.id;

      return (
        <Card
          style={[
            styles.driverCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: isSelected ? theme.colors.primary : theme.colors.outline,
              borderWidth: isSelected ? 2 : 1,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => handleSelectDriver(item.id)}
            activeOpacity={0.7}
          >
            <View style={styles.driverContent}>
              {/* Driver Info */}
              <View style={styles.driverInfo}>
                <Avatar.Text
                  size={56}
                  label={item.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()}
                  style={{ backgroundColor: theme.colors.primaryContainer }}
                />
                <View style={styles.driverDetails}>
                  <View style={styles.driverHeader}>
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                      {item.name}
                    </Text>
                    {item.rating && (
                      <View style={styles.ratingContainer}>
                        <IconButton
                          icon="star"
                          size={16}
                          iconColor={theme.colors.primary}
                          style={styles.ratingIcon}
                          disabled
                        />
                        <Text variant="bodySmall" style={{ color: theme.colors.onSurface }}>
                          {item.rating.toFixed(1)}
                        </Text>
                      </View>
                    )}
                  </View>

                  {item.vehicle_type && (
                    <View style={styles.vehicleInfo}>
                      <IconButton
                        icon="motorbike"
                        size={16}
                        iconColor={theme.colors.onSurfaceVariant}
                        style={styles.vehicleIcon}
                        disabled
                      />
                      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                        {item.vehicle_type}
                        {item.vehicle_number && ` • ${item.vehicle_number}`}
                      </Text>
                    </View>
                  )}

                  {item.distance_km && (
                    <View style={styles.distanceInfo}>
                      <IconButton
                        icon="map-marker-distance"
                        size={16}
                        iconColor={theme.colors.onSurfaceVariant}
                        style={styles.distanceIcon}
                        disabled
                      />
                      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                        {item.distance_km} km away
                        {item.estimated_arrival && ` • ${item.estimated_arrival}`}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <Button
                  mode="outlined"
                  compact
                  icon="phone"
                  onPress={() => handleCallDriver(item.phone)}
                  style={styles.actionButton}
                >
                  Call
                </Button>
                <Button
                  mode="outlined"
                  compact
                  icon="message-text"
                  onPress={() => handleWhatsAppDriver(item.phone)}
                  style={styles.actionButton}
                >
                  WhatsApp
                </Button>
              </View>
            </View>
          </TouchableOpacity>

          {isSelected && (
            <View style={[styles.selectedBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <IconButton
                icon="check-circle"
                size={20}
                iconColor={theme.colors.primary}
                style={styles.selectedIcon}
                disabled
              />
              <Text variant="labelSmall" style={{ color: theme.colors.onPrimaryContainer }}>
                Selected
              </Text>
            </View>
          )}
        </Card>
      );
    },
    [theme, selectedDriver, handleSelectDriver, handleCallDriver, handleWhatsAppDriver]
  );

  return (
    <ScreenContainer scrollable={false} showOfflineBanner={true}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
          iconColor={theme.colors.onSurface}
        />
        <Text variant="titleLarge" style={{ color: theme.colors.onSurface, flex: 1 }}>
          Select Local Driver
        </Text>
        <View style={{ width: 48 }} />
      </View>

      <View style={styles.infoCard}>
        <Card style={{ backgroundColor: theme.colors.secondaryContainer, padding: 12 }}>
          <View style={styles.infoContent}>
            <IconButton
              icon="information"
              size={20}
              iconColor={theme.colors.onSecondaryContainer}
              disabled
            />
            <View style={styles.infoText}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSecondaryContainer }}>
                Contact a driver to arrange local delivery. Tap on a driver to select them, or contact them directly to discuss delivery details.
              </Text>
            </View>
          </View>
        </Card>
      </View>

      {drivers.length === 0 ? (
        <EmptyState
          icon="motorbike-electric"
          title="No drivers available"
          message="Please try again later or use standard delivery"
        />
      ) : (
        <FlatList
          data={drivers}
          renderItem={renderDriverCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={true}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}
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
  infoCard: {
    padding: 16,
    paddingBottom: 8,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    marginLeft: 4,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  driverCard: {
    padding: 16,
    borderRadius: 12,
  },
  driverContent: {
    gap: 12,
  },
  driverInfo: {
    flexDirection: 'row',
    gap: 12,
  },
  driverDetails: {
    flex: 1,
    gap: 4,
  },
  driverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingIcon: {
    margin: 0,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleIcon: {
    margin: 0,
    marginRight: -8,
  },
  distanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceIcon: {
    margin: 0,
    marginRight: -8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  selectedIcon: {
    margin: 0,
    marginRight: -4,
  },
});

export default LocalDeliveryDrivers;

