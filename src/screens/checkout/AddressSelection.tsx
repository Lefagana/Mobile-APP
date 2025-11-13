import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import {
  Text,
  useTheme,
  IconButton,
  Button,
  RadioButton,
  Divider,
  FAB,
  Chip,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { CustomerStackParamList } from '../../navigation/types';
import { ScreenContainer, EmptyState } from '../../components/common';
import { SavedAddress } from '../../types';

type AddressSelectionNavigationProp = StackNavigationProp<CustomerStackParamList, 'AddressSelection'>;

// Mock saved addresses
const mockAddresses: SavedAddress[] = [
  {
    id: 'addr_001',
    type: 'home',
    text: '123 Main Street, Victoria Island, Lagos',
    landmark: 'Near Shoprite Mall',
    location: { lat: 6.4281, lng: 3.4219 },
    is_default: true,
  },
  {
    id: 'addr_002',
    type: 'work',
    text: '456 Business District, Ikeja, Lagos',
    landmark: 'Opposite GTB Building',
    location: { lat: 6.5244, lng: 3.3792 },
    is_default: false,
  },
];

const AddressSelection: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<AddressSelectionNavigationProp>();
  const [selectedAddress, setSelectedAddress] = useState<string>(
    mockAddresses.find(addr => addr.is_default)?.id || mockAddresses[0]?.id || ''
  );

  const handleAddressSelect = useCallback((addressId: string) => {
    setSelectedAddress(addressId);
  }, []);

  const handleAddNewAddress = useCallback(() => {
    // navigation.navigate('AddAddress');
    console.log('Navigate to add new address');
  }, []);

  const handleSave = useCallback(() => {
    // Save selected address and go back
    navigation.goBack();
  }, [navigation]);

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home':
        return 'home';
      case 'work':
        return 'briefcase';
      default:
        return 'map-marker';
    }
  };

  const renderAddressItem = useCallback(
    ({ item }: { item: SavedAddress }) => (
      <TouchableOpacity
        style={[
          styles.addressItem,
          {
            backgroundColor: theme.colors.surface,
            borderColor:
              selectedAddress === item.id ? theme.colors.primary : theme.colors.outlineVariant,
            borderWidth: selectedAddress === item.id ? 2 : 1,
          },
        ]}
        onPress={() => handleAddressSelect(item.id)}
      >
        <RadioButton
          value={item.id}
          status={selectedAddress === item.id ? 'checked' : 'unchecked'}
          onPress={() => handleAddressSelect(item.id)}
        />
        <View style={styles.addressContent}>
          <View style={styles.addressHeader}>
            <View style={styles.addressTypeRow}>
              <IconButton
                icon={getAddressIcon(item.type)}
                size={20}
                iconColor={theme.colors.primary}
              />
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
              </Text>
              {item.is_default && (
                <Chip
                  mode="flat"
                  style={[styles.defaultChip, { backgroundColor: theme.colors.primaryContainer }]}
                  textStyle={{ color: theme.colors.onPrimaryContainer, fontSize: 10 }}
                >
                  Default
                </Chip>
              )}
            </View>
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
      </TouchableOpacity>
    ),
    [selectedAddress, theme, handleAddressSelect]
  );

  return (
    <ScreenContainer scrollable={false} showOfflineBanner={true}>
      <FlatList
        data={mockAddresses}
        renderItem={renderAddressItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentContainer}
        ListFooterComponent={
          mockAddresses.length > 0
            ? (
              <View style={[styles.bottomActions, { backgroundColor: theme.colors.surface }]}>
                <Button
                  mode="contained"
                  onPress={handleSave}
                  style={styles.saveButton}
                >
                  Save Address
                </Button>
              </View>
            )
            : null
        }
        ListEmptyComponent={
          <EmptyState
            icon="map-marker-off"
            title="No Saved Addresses"
            description="Add a new address to continue"
          />
        }
        showsVerticalScrollIndicator={false}
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleAddNewAddress}
        label="Add New Address"
      />

    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
    paddingBottom: 120,
  },
  addressItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  addressContent: {
    flex: 1,
    marginLeft: 8,
  },
  addressHeader: {
    marginBottom: 4,
  },
  addressTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  defaultChip: {
    height: 20,
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 80,
  },
  bottomActions: {
    padding: 16,
    marginTop: 12,
  },
  saveButton: {
    paddingVertical: 4,
  },
});

export default AddressSelection;

