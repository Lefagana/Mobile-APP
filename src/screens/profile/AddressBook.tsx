import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import {
  Text,
  useTheme,
  Card,
  IconButton,
  Chip,
  ActivityIndicator,
  FAB,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { ScreenContainer, EmptyState, ErrorState } from '../../components/common';
import { SavedAddress } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

// Mock addresses - in real app would fetch from API
const mockAddresses: SavedAddress[] = [
  {
    id: 'addr_001',
    type: 'home',
    text: 'Wuse 2, Near Mosque, Abuja',
    landmark: 'Opposite Zenith Bank',
    is_default: true,
    location: {
      lat: 9.0765,
      lng: 7.3986,
    },
  },
  {
    id: 'addr_002',
    type: 'work',
    text: 'Plot 123, Garki II, Abuja',
    landmark: 'Near Wuse Market',
    is_default: false,
    location: {
      lat: 9.0700,
      lng: 7.3900,
    },
  },
  {
    id: 'addr_003',
    type: 'other',
    text: 'Block 45, Wuse Zone 3, Abuja',
    is_default: false,
    location: {
      lat: 9.0765,
      lng: 7.3986,
    },
  },
];

const AddressBook: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { user } = useAuth();
  const [addresses] = useState<SavedAddress[]>(mockAddresses);

  const handleAddAddress = () => {
    // Navigate to add address screen
    console.log('Add new address');
  };

  const handleEditAddress = (address: SavedAddress) => {
    // Navigate to edit address screen
    console.log('Edit address', address.id);
  };

  const handleDeleteAddress = (addressId: string) => {
    // Delete address
    console.log('Delete address', addressId);
  };

  const handleSetDefault = (addressId: string) => {
    // Set as default address
    console.log('Set default address', addressId);
  };

  const getAddressIcon = (type: SavedAddress['type']) => {
    switch (type) {
      case 'home':
        return 'home';
      case 'work':
        return 'briefcase';
      default:
        return 'map-marker';
    }
  };

  const renderAddress = useCallback(
    ({ item }: { item: SavedAddress }) => {
      return (
        <Card style={[styles.addressCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.addressHeader}>
            <View style={styles.addressInfo}>
              <IconButton
                icon={getAddressIcon(item.type)}
                size={24}
                iconColor={theme.colors.primary}
              />
              <View style={styles.addressDetails}>
                <View style={styles.addressTypeRow}>
                  <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
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
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, marginTop: 4 }}>
                  {item.text}
                </Text>
                {item.landmark && (
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                    {item.landmark}
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.addressActions}>
              {!item.is_default && (
                <IconButton
                  icon="star-outline"
                  size={24}
                  iconColor={theme.colors.onSurfaceVariant}
                  onPress={() => handleSetDefault(item.id)}
                />
              )}
              <IconButton
                icon="pencil"
                size={24}
                iconColor={theme.colors.onSurfaceVariant}
                onPress={() => handleEditAddress(item)}
              />
              <IconButton
                icon="delete"
                size={24}
                iconColor={theme.colors.error}
                onPress={() => handleDeleteAddress(item.id)}
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
        data={addresses}
        renderItem={renderAddress}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentContainer}
        ListEmptyComponent={
          <EmptyState
            icon="map-marker-outline"
            title="No addresses"
            description="Add your first delivery address to get started."
          />
        }
        showsVerticalScrollIndicator={false}
      />
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleAddAddress}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
    paddingBottom: 120,
  },
  addressCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  addressInfo: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  addressDetails: {
    flex: 1,
  },
  addressTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  defaultChip: {
    height: 20,
  },
  addressActions: {
    flexDirection: 'row',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 80,
  },
});

export default AddressBook;

