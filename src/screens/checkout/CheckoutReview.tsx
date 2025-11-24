import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import {
  Text,
  useTheme,
  Button,
  Divider,
  IconButton,
  ActivityIndicator,
  Card,
  TextInput,
  RadioButton,
  Chip,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { CustomerStackParamList } from '../../navigation/types';
import { ScreenContainer, ErrorState } from '../../components/common';
import { api } from '../../services/api';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNetwork } from '../../contexts/NetworkContext';
import { useOfflineQueue } from '../../hooks/useOfflineQueue';
import { formatCurrency } from '../../utils/formatters';
import { Product } from '../../types';

type CheckoutReviewNavigationProp = StackNavigationProp<CustomerStackParamList, 'CheckoutReview'>;

const CheckoutReview: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<CheckoutReviewNavigationProp>();
  const { cart } = useCart();
  const { user } = useAuth();
  const { isOnline } = useNetwork();
  const { queueAction, isProcessing: queueProcessing } = useOfflineQueue();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddressSelection = useCallback(() => {
    navigation.navigate('AddressSelection');
  }, [navigation]);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('wallet');
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [deliveryType, setDeliveryType] = useState<'standard' | 'local'>('standard');
  const [deliverySlot, setDeliverySlot] = useState<'asap' | 'scheduled'>('asap');
  const [scheduledDate, setScheduledDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [deliveryInstructions, setDeliveryInstructions] = useState<string>('');
  const [selectedDriver, setSelectedDriver] = useState<any>(null);

  const handlePaymentSelection = useCallback(() => {
    navigation.navigate('PaymentSelection');
  }, [navigation]);

  const handleDeliveryTypeChange = useCallback((type: 'standard' | 'local') => {
    setDeliveryType(type);
    if (type === 'local' && !selectedDriver) {
      navigation.navigate('LocalDeliveryDrivers');
    }
  }, [navigation, selectedDriver]);

  const handleSelectDriver = useCallback(() => {
    navigation.navigate('LocalDeliveryDrivers');
  }, [navigation]);

  const handleDateChange = useCallback((event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      if (date) {
        setScheduledDate(date);
        setShowTimePicker(true);
      }
    } else {
      // iOS: date picker is always shown
      if (date) {
        setScheduledDate(date);
      }
    }
  }, []);

  const handleTimeChange = useCallback((event: any, time?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (time) {
      const newDate = new Date(scheduledDate);
      newDate.setHours(time.getHours());
      newDate.setMinutes(time.getMinutes());
      setScheduledDate(newDate);
    }
    if (Platform.OS === 'ios') {
      setShowTimePicker(false);
    }
  }, [scheduledDate]);

  // Get payment method and driver from route params
  const route = useRoute();
  const paymentMethodParam = (route.params as any)?.paymentMethod;
  const driverParam = (route.params as any)?.selectedDriver;

  React.useEffect(() => {
    if (paymentMethodParam) {
      setSelectedPaymentMethod(paymentMethodParam);
    }
  }, [paymentMethodParam]);

  React.useEffect(() => {
    if (driverParam) {
      setSelectedDriver(driverParam);
      setDeliveryType('local');
    }
  }, [driverParam]);

  // Get buyNowProduct from route params
  const buyNowData = (route.params as any)?.buyNowProduct;

  // Determine checkout items: Buy Now product OR cart items
  const checkoutItems = React.useMemo(() => {
    if (buyNowData) {
      // Buy Now flow: single product
      return [{
        product_id: buyNowData.product.id,
        product: buyNowData.product,
        variant_id: buyNowData.variant?.id,
        quantity: buyNowData.quantity,
        price: buyNowData.variant?.price || buyNowData.product.price || 0,
      }];
    }
    // Regular cart checkout
    return cart.items;
  }, [buyNowData, cart.items]);

  // Calculate total from checkout items
  const checkoutTotal = React.useMemo(() => {
    return checkoutItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [checkoutItems]);

  const handlePlaceOrder = useCallback(async () => {
    if (checkoutItems.length === 0) return;

    setIsProcessing(true);
    let orderData: any;
    try {
      // Prepare order data
      orderData = {
        user_id: user?.id || 'user_001',
        items: checkoutItems.map(item => ({
          product_id: item.product_id,
          qty: item.quantity,
          price: item.price,
          variant_id: item.variant_id,
        })),
        delivery_address: selectedAddress || {
          lat: 6.5244,
          lng: 3.3792,
          text: '123 Main Street, Lagos, Nigeria',
        },
        payment_method: selectedPaymentMethod,
        delivery_type: deliveryType,
        delivery_slot: deliverySlot === 'asap' ? 'ASAP' : scheduledDate.toISOString(),
        delivery_instructions: deliveryInstructions,
        rider_id: deliveryType === 'local' && selectedDriver ? selectedDriver.id : undefined,
        meta: {
          delivery_slot: deliverySlot === 'asap' ? 'ASAP' : scheduledDate.toISOString(),
          instructions: deliveryInstructions,
          delivery_type: deliveryType,
          selected_driver: selectedDriver,
        },
      };

      // If offline, queue the order
      if (!isOnline) {
        const actionId = await queueAction('order:place', orderData);
        setIsProcessing(false);
        Alert.alert(
          'Order Queued',
          'Your order has been queued and will be placed when you\'re back online. You can check the status in your orders.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Clear cart and navigate to orders
                navigation.navigate('OrdersList');
              },
            },
          ]
        );
        return;
      }

      // Create order (online)
      const orderResponse = await api.orders.create(orderData);

      // Handle payment based on method
      if (selectedPaymentMethod === 'paystack') {
        // Initiate Paystack payment
        const paymentResponse = await api.payments.initiate(
          orderResponse.order_id,
          cart.total
        );

        if (paymentResponse.authorization_url) {
          // Navigate to payment webview
          navigation.navigate('PaymentWebview', {
            url: paymentResponse.authorization_url,
            reference: paymentResponse.reference || orderResponse.order_id,
          });
        } else {
          throw new Error('Failed to initiate payment');
        }
      } else if (selectedPaymentMethod === 'wallet') {
        // For wallet, order is already created and paid
        // Navigate directly to confirmation
        navigation.replace('Confirmation', {
          orderId: orderResponse.order_id,
        });
      } else {
        // For COD and USSD, order is created but payment pending
        navigation.replace('Confirmation', {
          orderId: orderResponse.order_id,
        });
      }
    } catch (error: any) {
      setIsProcessing(false);
      console.error('Failed to place order:', error);

      // If error and offline, try to queue it
      if (!isOnline) {
        try {
          await queueAction('order:place', orderData);
          Alert.alert(
            'Order Queued',
            'Your order has been queued and will be placed when you\'re back online.',
            [{ text: 'OK' }]
          );
          return;
        } catch (queueError) {
          console.error('Failed to queue order:', queueError);
        }
      }

      Alert.alert(
        'Order Failed',
        error?.message || 'Unable to place order. Please try again.',
        [{ text: 'OK' }]
      );
    }
  }, [cart, user, selectedPaymentMethod, selectedAddress, deliveryType, deliverySlot, scheduledDate, deliveryInstructions, selectedDriver, navigation, isOnline, queueAction]);

  return (
    <ScreenContainer scrollable={false} showOfflineBanner={true}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Delivery Address Section */}
        <Card style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.sectionHeader}>
            <IconButton icon="map-marker" size={24} iconColor={theme.colors.primary} />
            <View style={styles.sectionTitle}>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                Delivery Address
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Tap to change address
              </Text>
            </View>
            <IconButton
              icon="chevron-right"
              size={24}
              iconColor={theme.colors.onSurface}
              onPress={handleAddressSelection}
              accessibilityLabel="Change delivery address"
              accessibilityRole="button"
              accessibilityHint="Opens address selection screen"
            />
          </View>
          <Divider style={styles.divider} />
          <TouchableOpacity
            onPress={handleAddressSelection}
            accessibilityRole="button"
            accessibilityLabel="Delivery address"
            accessibilityHint="Tap to change delivery address"
          >
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
              {user?.name || 'Your Name'}
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
              123 Main Street{'\n'}
              Lagos, Nigeria
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.primary, marginTop: 8 }}>
              +234 123 456 7890
            </Text>
          </TouchableOpacity>
        </Card>

        {/* Order Items Section */}
        <Card style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.sectionHeader}>
            <IconButton icon="package-variant" size={24} iconColor={theme.colors.primary} />
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
              Order Items ({checkoutItems.length})
            </Text>
          </View>
          <Divider style={styles.divider} />
          {checkoutItems.map((item, index) => {
            const product = item.product as Product;
            return (
              <View key={`${item.product_id}-${item.variant_id || 'default'}-${index}`}>
                <View style={styles.orderItem}>
                  <View style={styles.itemInfo}>
                    <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                      {product.name || product.title}
                    </Text>
                    {item.variant_id && (
                      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                        Variant: {product.variants?.find(v => v.id === item.variant_id)?.label}
                      </Text>
                    )}
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                      Qty: {item.quantity} × {formatCurrency(item.price, product.currency || 'NGN')}
                    </Text>
                  </View>
                  <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                    {formatCurrency(item.price * item.quantity, product.currency || 'NGN')}
                  </Text>
                </View>
                {index < checkoutItems.length - 1 && <Divider style={styles.itemDivider} />}
              </View>
            );
          })}
        </Card>

        {/* Delivery Type Section */}
        <Card style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.sectionHeader}>
            <IconButton icon="truck-delivery" size={24} iconColor={theme.colors.primary} />
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
              Delivery Type
            </Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.deliveryTypeContainer}>
            <TouchableOpacity
              onPress={() => handleDeliveryTypeChange('standard')}
              style={styles.deliveryTypeOption}
              accessibilityRole="radio"
              accessibilityLabel="Standard delivery"
              accessibilityHint="Select standard e-commerce delivery"
              accessibilityState={{ checked: deliveryType === 'standard' }}
            >
              <RadioButton
                value="standard"
                status={deliveryType === 'standard' ? 'checked' : 'unchecked'}
                onPress={() => handleDeliveryTypeChange('standard')}
              />
              <View style={styles.deliveryTypeInfo}>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                  Standard Delivery
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Standard e-commerce delivery
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleDeliveryTypeChange('local')}
              style={styles.deliveryTypeOption}
              accessibilityRole="radio"
              accessibilityLabel="Local delivery"
              accessibilityHint="Select local driver delivery"
              accessibilityState={{ checked: deliveryType === 'local' }}
            >
              <RadioButton
                value="local"
                status={deliveryType === 'local' ? 'checked' : 'unchecked'}
                onPress={() => handleDeliveryTypeChange('local')}
              />
              <View style={styles.deliveryTypeInfo}>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                  Local Delivery
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Arrange with local driver
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Local Driver Selection */}
          {deliveryType === 'local' && (
            <>
              <Divider style={styles.divider} />
              {selectedDriver ? (
                <View style={styles.selectedDriverContainer}>
                  <View style={styles.selectedDriverInfo}>
                    <IconButton icon="check-circle" size={24} iconColor={theme.colors.primary} disabled />
                    <View style={styles.driverDetails}>
                      <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                        {selectedDriver.name}
                      </Text>
                      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                        {selectedDriver.phone}
                      </Text>
                    </View>
                  </View>
                  <Button
                    mode="outlined"
                    compact
                    onPress={handleSelectDriver}
                    accessibilityLabel="Change selected driver"
                    accessibilityRole="button"
                    accessibilityHint="Opens driver selection screen"
                  >
                    Change
                  </Button>
                </View>
              ) : (
                <Button
                  mode="outlined"
                  icon="account-multiple"
                  onPress={handleSelectDriver}
                  style={styles.selectDriverButton}
                  accessibilityLabel="Select local driver"
                  accessibilityRole="button"
                  accessibilityHint="Opens screen to select a local delivery driver"
                >
                  Select Local Driver
                </Button>
              )}
            </>
          )}
        </Card>

        {/* Delivery Slot Section */}
        <Card style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.sectionHeader}>
            <IconButton icon="clock-outline" size={24} iconColor={theme.colors.primary} />
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
              Delivery Time
            </Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.deliverySlotContainer}>
            <TouchableOpacity
              onPress={() => setDeliverySlot('asap')}
              style={styles.deliverySlotOption}
              accessibilityRole="radio"
              accessibilityLabel="ASAP delivery"
              accessibilityHint="Select as soon as possible delivery"
              accessibilityState={{ checked: deliverySlot === 'asap' }}
            >
              <RadioButton
                value="asap"
                status={deliverySlot === 'asap' ? 'checked' : 'unchecked'}
                onPress={() => setDeliverySlot('asap')}
              />
              <View style={styles.deliverySlotInfo}>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                  ASAP
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  As soon as possible
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setDeliverySlot('scheduled')}
              style={styles.deliverySlotOption}
              accessibilityRole="radio"
              accessibilityLabel="Scheduled delivery"
              accessibilityHint="Select scheduled delivery date and time"
              accessibilityState={{ checked: deliverySlot === 'scheduled' }}
            >
              <RadioButton
                value="scheduled"
                status={deliverySlot === 'scheduled' ? 'checked' : 'unchecked'}
                onPress={() => setDeliverySlot('scheduled')}
              />
              <View style={styles.deliverySlotInfo}>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                  Scheduled
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Choose specific date and time
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Scheduled Date/Time Picker */}
          {deliverySlot === 'scheduled' && (
            <>
              <Divider style={styles.divider} />
              <View style={styles.scheduledContainer}>
                <Button
                  mode="outlined"
                  icon="calendar"
                  onPress={() => {
                    if (Platform.OS === 'ios') {
                      setShowDatePicker(true);
                    } else {
                      setShowDatePicker(true);
                    }
                  }}
                  style={styles.dateButton}
                  accessibilityLabel={`Select delivery date, current date ${scheduledDate.toLocaleDateString()}`}
                  accessibilityRole="button"
                  accessibilityHint="Opens date picker to select delivery date"
                >
                  {scheduledDate.toLocaleDateString()}
                </Button>
                {Platform.OS === 'android' && (
                  <Button
                    mode="outlined"
                    icon="clock"
                    onPress={() => setShowTimePicker(true)}
                    style={styles.timeButton}
                    accessibilityLabel={`Select delivery time, current time ${scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                    accessibilityRole="button"
                    accessibilityHint="Opens time picker to select delivery time"
                  >
                    {scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Button>
                )}
              </View>
              {Platform.OS === 'ios' && (
                <View style={styles.iosTimeContainer}>
                  <Button
                    mode="outlined"
                    icon="clock"
                    onPress={() => setShowTimePicker(true)}
                    style={styles.timeButton}
                    accessibilityLabel={`Select delivery time, current time ${scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                    accessibilityRole="button"
                    accessibilityHint="Opens time picker to select delivery time"
                  >
                    {scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Button>
                </View>
              )}
            </>
          )}
        </Card>

        {/* Delivery Instructions Section */}
        <Card style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.sectionHeader}>
            <IconButton icon="note-text" size={24} iconColor={theme.colors.primary} />
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
              Delivery Instructions
            </Text>
          </View>
          <Divider style={styles.divider} />
          <TextInput
            mode="outlined"
            placeholder="Add special instructions for delivery (optional)"
            value={deliveryInstructions}
            onChangeText={setDeliveryInstructions}
            multiline
            numberOfLines={4}
            style={styles.instructionsInput}
          />
        </Card>

        {/* Payment Method Section */}
        <Card style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.sectionHeader}>
            <IconButton icon="credit-card" size={24} iconColor={theme.colors.primary} />
            <View style={styles.sectionTitle}>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                Payment Method
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Tap to change payment method
              </Text>
            </View>
            <IconButton
              icon="chevron-right"
              size={24}
              iconColor={theme.colors.onSurface}
              onPress={handlePaymentSelection}
              accessibilityLabel="Change payment method"
              accessibilityRole="button"
              accessibilityHint="Opens payment method selection screen"
            />
          </View>
          <Divider style={styles.divider} />
          <TouchableOpacity
            onPress={handlePaymentSelection}
            accessibilityRole="button"
            accessibilityLabel="Payment method"
            accessibilityHint="Tap to change payment method"
          >
            <View style={styles.paymentMethod}>
              <IconButton icon="wallet" size={24} iconColor={theme.colors.primary} />
              <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                Wallet
              </Text>
            </View>
          </TouchableOpacity>
        </Card>

        {/* Order Summary */}
        <Card style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
            Order Summary
          </Text>
          <Divider style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
              Subtotal
            </Text>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
              {formatCurrency(checkoutTotal, 'NGN')}
            </Text>
          </View>

          {cart.delivery_fee && cart.delivery_fee > 0 && (
            <View style={styles.summaryRow}>
              <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
                Delivery Fee
              </Text>
              <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                {formatCurrency(cart.delivery_fee, 'NGN')}
              </Text>
            </View>
          )}

          {cart.discount && cart.discount > 0 && (
            <View style={styles.summaryRow}>
              <Text variant="bodyLarge" style={{ color: theme.colors.error }}>
                Discount
              </Text>
              <Text variant="bodyLarge" style={{ color: theme.colors.error }}>
                -{formatCurrency(cart.discount, 'NGN')}
              </Text>
            </View>
          )}

          <Divider style={styles.summaryDivider} />

          <View style={styles.summaryRow}>
            <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
              Total
            </Text>
            <Text variant="titleLarge" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
              {formatCurrency(checkoutTotal + (cart.delivery_fee || 0) - (cart.discount || 0), 'NGN')}
            </Text>
          </View>
        </Card>
        {/* Actions */}
        <View style={[styles.bottomAction, { backgroundColor: theme.colors.surface }]}>
          <Button
            mode="contained"
            onPress={handlePlaceOrder}
            loading={isProcessing}
            disabled={(isProcessing || queueProcessing) || checkoutItems.length === 0}
            icon="check"
            style={styles.placeOrderButton}
            accessibilityLabel={`Place order, total ${formatCurrency(checkoutTotal + (cart.delivery_fee || 0) - (cart.discount || 0), 'NGN')}`}
            accessibilityRole="button"
            accessibilityHint="Places your order and processes payment"
            accessibilityState={{ disabled: (isProcessing || queueProcessing) || checkoutItems.length === 0 }}
          >
            {isProcessing || queueProcessing
              ? isOnline
                ? 'Placing Order...'
                : 'Queuing Order...'
              : `Place Order - ${formatCurrency(checkoutTotal + (cart.delivery_fee || 0) - (cart.discount || 0), 'NGN')}`}
          </Button>
        </View>
      </ScrollView>

      {/* Date/Time Pickers */}
      {showDatePicker && (
        <DateTimePicker
          value={scheduledDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {showTimePicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={scheduledDate}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}

      {showTimePicker && Platform.OS === 'ios' && (
        <DateTimePicker
          value={scheduledDate}
          mode="time"
          display="spinner"
          onChange={handleTimeChange}
        />
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    flex: 1,
    marginLeft: 8,
  },
  divider: {
    marginVertical: 12,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  itemInfo: {
    flex: 1,
    marginRight: 16,
  },
  itemDivider: {
    marginVertical: 8,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryDivider: {
    marginVertical: 12,
  },
  bottomAction: {
    padding: 16,
    marginTop: 12,
  },
  placeOrderButton: {
    paddingVertical: 4,
  },
  deliveryTypeContainer: {
    gap: 8,
  },
  deliveryTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  deliveryTypeInfo: {
    flex: 1,
    marginLeft: 8,
  },
  selectedDriverContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  selectedDriverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  driverDetails: {
    marginLeft: 8,
  },
  selectDriverButton: {
    marginTop: 8,
  },
  deliverySlotContainer: {
    gap: 8,
  },
  deliverySlotOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  deliverySlotInfo: {
    flex: 1,
    marginLeft: 8,
  },
  scheduledContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  dateButton: {
    flex: 1,
  },
  timeButton: {
    flex: 1,
  },
  instructionsInput: {
    marginTop: 8,
  },
  iosTimeContainer: {
    marginTop: 8,
  },
});

export default CheckoutReview;

