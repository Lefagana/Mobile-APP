import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import {
  Text,
  useTheme,
  Button,
  Card,
  Divider,
  IconButton,
  Checkbox,
  TextInput,
  RadioButton,
  Chip,
  ActivityIndicator,
} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { CustomerStackParamList } from '../../navigation/types';
import { ScreenContainer, ErrorState } from '../../components/common';
import { api } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import { Order, OrderItem } from '../../types';

type ReturnRequestNavigationProp = StackNavigationProp<CustomerStackParamList, 'ReturnRequest'>;
type ReturnRequestRouteProp = RouteProp<CustomerStackParamList, 'ReturnRequest'>;

type ReturnReason =
  | 'defective'
  | 'wrong_item'
  | 'damaged'
  | 'not_as_described'
  | 'changed_mind'
  | 'other';

type ResolutionPreference = 'refund' | 'store_credit' | 'exchange';

const RETURN_REASONS: { id: ReturnReason; label: string; description: string }[] = [
  { id: 'defective', label: 'Defective Item', description: 'Product is faulty or not working' },
  { id: 'wrong_item', label: 'Wrong Item', description: 'Received different item than ordered' },
  { id: 'damaged', label: 'Damaged in Transit', description: 'Item arrived damaged' },
  { id: 'not_as_described', label: 'Not as Described', description: 'Item differs from description' },
  { id: 'changed_mind', label: 'Changed Mind', description: 'No longer want the item' },
  { id: 'other', label: 'Other', description: 'Other reason' },
];

const ReturnRequest: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<ReturnRequestNavigationProp>();
  const route = useRoute<ReturnRequestRouteProp>();
  const { orderId } = route.params;
  const queryClient = useQueryClient();

  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [selectedReason, setSelectedReason] = useState<ReturnReason | null>(null);
  const [customReason, setCustomReason] = useState<string>('');
  const [resolutionPreference, setResolutionPreference] = useState<ResolutionPreference>('refund');
  const [description, setDescription] = useState<string>('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch order details
  const order = queryClient.getQueryData<Order>(['order', orderId]);

  const handleItemToggle = useCallback((itemId: string) => {
    setSelectedItems(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (!order) return;
    if (selectedItems.size === order.items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(order.items.map(item => item.id)));
    }
  }, [order, selectedItems.size]);

  const handlePickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera roll permission to upload photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const newPhotos = result.assets.map(asset => asset.uri);
      setPhotos(prev => [...prev, ...newPhotos]);
    }
  }, []);

  const handleRemovePhoto = useCallback((index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (selectedItems.size === 0) {
      Alert.alert('No Items Selected', 'Please select at least one item to return');
      return;
    }

    if (!selectedReason) {
      Alert.alert('Reason Required', 'Please select a reason for return');
      return;
    }

    if (selectedReason === 'other' && !customReason.trim()) {
      Alert.alert('Reason Required', 'Please provide a reason for return');
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare return request data
      const returnData = {
        order_id: orderId,
        items: Array.from(selectedItems),
        reason: selectedReason === 'other' ? customReason : selectedReason,
        description: description.trim(),
        resolution_preference: resolutionPreference,
        photos: photos, // In real app, these would be uploaded to server
      };

      // TODO: Call API to submit return request
      // await api.orders.initiateReturn(returnData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      Alert.alert(
        'Return Request Submitted',
        'Your return request has been submitted. We will review it and get back to you within 24-48 hours.',
        [
          {
            text: 'OK',
            onPress: () => {
              queryClient.invalidateQueries({ queryKey: ['order', orderId] });
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to submit return request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [
    selectedItems,
    selectedReason,
    customReason,
    description,
    resolutionPreference,
    photos,
    orderId,
    queryClient,
    navigation,
  ]);

  if (!order) {
    return (
      <ScreenContainer>
        <ErrorState message="Order not found" onRetry={() => navigation.goBack()} />
      </ScreenContainer>
    );
  }

  const eligibleItems = order.items; // All items are eligible for return (could filter based on status)

  return (
    <ScreenContainer scrollable={false} showOfflineBanner={true}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Instructions */}
        <Card style={[styles.section, { backgroundColor: theme.colors.secondaryContainer }]}>
          <View style={styles.infoContent}>
            <IconButton
              icon="information"
              size={24}
              iconColor={theme.colors.onSecondaryContainer}
              disabled
            />
            <View style={styles.infoText}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSecondaryContainer }}>
                You can return items within 7 days of delivery. Select items, provide reason, and choose your preferred resolution.
              </Text>
            </View>
          </View>
        </Card>

        {/* Select Items */}
        <Card style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
              Select Items to Return
            </Text>
            <Button mode="text" compact onPress={handleSelectAll}>
              {selectedItems.size === eligibleItems.length ? 'Deselect All' : 'Select All'}
            </Button>
          </View>
          <Divider style={styles.divider} />
          {eligibleItems.map((item, index) => {
            const isSelected = selectedItems.has(item.id);
            const product = item.product;

            return (
              <View key={item.id}>
                <TouchableOpacity
                  onPress={() => handleItemToggle(item.id)}
                  style={styles.itemRow}
                >
                  <Checkbox
                    status={isSelected ? 'checked' : 'unchecked'}
                    onPress={() => handleItemToggle(item.id)}
                  />
                  <Image
                    source={{
                      uri: product.image_url || product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=60&h=60&fit=crop',
                    }}
                    style={styles.itemImage}
                  />
                  <View style={styles.itemInfo}>
                    <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                      {product.name || product.title}
                    </Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                      Qty: {item.qty} × {formatCurrency(item.price, order.currency)}
                    </Text>
                  </View>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                    {formatCurrency(item.price * item.qty, order.currency)}
                  </Text>
                </TouchableOpacity>
                {index < eligibleItems.length - 1 && <Divider style={styles.itemDivider} />}
              </View>
            );
          })}
        </Card>

        {/* Return Reason */}
        <Card style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
            Reason for Return
          </Text>
          <Divider style={styles.divider} />
          {RETURN_REASONS.map(reason => (
            <TouchableOpacity
              key={reason.id}
              onPress={() => setSelectedReason(reason.id)}
              style={styles.reasonOption}
            >
              <RadioButton
                value={reason.id}
                status={selectedReason === reason.id ? 'checked' : 'unchecked'}
                onPress={() => setSelectedReason(reason.id)}
              />
              <View style={styles.reasonInfo}>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                  {reason.label}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {reason.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}

          {selectedReason === 'other' && (
            <View style={styles.customReasonContainer}>
              <TextInput
                mode="outlined"
                placeholder="Please specify the reason"
                value={customReason}
                onChangeText={setCustomReason}
                multiline
                numberOfLines={3}
                style={styles.customReasonInput}
              />
            </View>
          )}
        </Card>

        {/* Resolution Preference */}
        <Card style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
            Preferred Resolution
          </Text>
          <Divider style={styles.divider} />
          <TouchableOpacity
            onPress={() => setResolutionPreference('refund')}
            style={styles.resolutionOption}
          >
            <RadioButton
              value="refund"
              status={resolutionPreference === 'refund' ? 'checked' : 'unchecked'}
              onPress={() => setResolutionPreference('refund')}
            />
            <View style={styles.resolutionInfo}>
              <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                Full Refund
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Money will be refunded to your original payment method
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setResolutionPreference('store_credit')}
            style={styles.resolutionOption}
          >
            <RadioButton
              value="store_credit"
              status={resolutionPreference === 'store_credit' ? 'checked' : 'unchecked'}
              onPress={() => setResolutionPreference('store_credit')}
            />
            <View style={styles.resolutionInfo}>
              <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                Store Credit
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Credit will be added to your wallet for future purchases
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setResolutionPreference('exchange')}
            style={styles.resolutionOption}
          >
            <RadioButton
              value="exchange"
              status={resolutionPreference === 'exchange' ? 'checked' : 'unchecked'}
              onPress={() => setResolutionPreference('exchange')}
            />
            <View style={styles.resolutionInfo}>
              <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                Exchange
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Replace with a different item or variant
              </Text>
            </View>
          </TouchableOpacity>
        </Card>

        {/* Additional Description */}
        <Card style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
            Additional Details (Optional)
          </Text>
          <Divider style={styles.divider} />
          <TextInput
            mode="outlined"
            placeholder="Provide any additional information about the return..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={styles.descriptionInput}
          />
        </Card>

        {/* Photos */}
        <Card style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
            Photos (Optional)
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 12 }}>
            Upload photos of the item(s) to help us process your return faster
          </Text>
          <Divider style={styles.divider} />
          <View style={styles.photosContainer}>
            {photos.map((photo, index) => (
              <View key={index} style={styles.photoWrapper}>
                <Image source={{ uri: photo }} style={styles.photo} />
                <IconButton
                  icon="close-circle"
                  size={20}
                  iconColor={theme.colors.error}
                  style={styles.removePhotoButton}
                  onPress={() => handleRemovePhoto(index)}
                />
              </View>
            ))}
            {photos.length < 5 && (
              <TouchableOpacity
                onPress={handlePickImage}
                style={[styles.addPhotoButton, { borderColor: theme.colors.outline }]}
              >
                <IconButton icon="camera" size={32} iconColor={theme.colors.primary} />
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Add Photo
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Card>
        {/* Actions */}
        <View style={[styles.bottomAction, { backgroundColor: theme.colors.surface }]}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting || selectedItems.size === 0 || !selectedReason}
            icon="send"
            style={styles.submitButton}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Return Request'}
          </Button>
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
  section: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  divider: {
    marginVertical: 12,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    marginLeft: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  itemInfo: {
    flex: 1,
  },
  itemDivider: {
    marginVertical: 8,
  },
  reasonOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  reasonInfo: {
    flex: 1,
    marginLeft: 8,
  },
  customReasonContainer: {
    marginTop: 12,
    marginLeft: 40,
  },
  customReasonInput: {
    marginTop: 8,
  },
  resolutionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  resolutionInfo: {
    flex: 1,
    marginLeft: 8,
  },
  descriptionInput: {
    marginTop: 8,
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoWrapper: {
    position: 'relative',
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    margin: 0,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  addPhotoButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomAction: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    marginTop: 12,
  },
  submitButton: {
    paddingVertical: 4,
  },
});

export default ReturnRequest;

