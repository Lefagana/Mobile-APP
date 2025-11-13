import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import {
  Text,
  useTheme,
  IconButton,
  Button,
  Divider,
  TextInput,
  Chip,
  ActivityIndicator,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { CustomerStackParamList } from '../../navigation/types';
import { ScreenContainer, EmptyState } from '../../components/common';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useCart } from '../../contexts/CartContext';
import { formatCurrency } from '../../utils/formatters';
import { Product } from '../../types';

type CartScreenNavigationProp = StackNavigationProp<CustomerStackParamList, 'Cart'>;

const Cart: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<CartScreenNavigationProp>();
  const { cart, updateQuantity, removeItem, updateItemNotes, applyCoupon, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const { t } = useLocalization();

  const handleQuantityChange = useCallback(
    (productId: string, variantId: string | undefined, currentQuantity: number, delta: number) => {
      const newQuantity = Math.max(1, currentQuantity + delta);
      updateQuantity(productId, newQuantity, variantId);
    },
    [updateQuantity]
  );

  const handleRemoveItem = useCallback(
    (productId: string, variantId: string | undefined) => {
      removeItem(productId, variantId);
    },
    [removeItem]
  );

  const handleApplyCoupon = useCallback(async () => {
    if (!couponCode.trim()) return;

    setApplyingCoupon(true);
    const success = await applyCoupon(couponCode.trim());
    setApplyingCoupon(false);

    if (success) {
      setCouponCode('');
    } else {
      // Show error message (can be enhanced with toast/snackbar)
      console.log('Invalid coupon code');
    }
  }, [couponCode, applyCoupon]);

  const handleCheckout = useCallback(() => {
    navigation.navigate('CheckoutReview', {});
  }, [navigation]);

  const handleClearCart = useCallback(() => {
    clearCart();
  }, [clearCart]);

  const renderCartItem = useCallback(
    (item: typeof cart.items[0], index: number) => {
      const product = item.product as Product;
      const displayImage =
        product.image_url || product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop';
      const displayName = product.name || product.title || 'Product';

      return (
        <View key={`${item.product_id}-${item.variant_id || 'default'}`} style={styles.cartItem}>
          <Image source={{ uri: displayImage }} style={styles.productImage} resizeMode="cover" />
          <View style={styles.itemDetails}>
            <View style={styles.itemHeader}>
              <View style={styles.itemInfo}>
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface }} numberOfLines={2}>
                  {displayName}
                </Text>
                {item.variant_id && (
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    Variant: {product.variants?.find(v => v.id === item.variant_id)?.label}
                  </Text>
                )}
                <Text variant="titleMedium" style={{ color: theme.colors.primary, marginTop: 4 }}>
                  {formatCurrency(item.price, product.currency || 'NGN')}
                </Text>
              </View>
              <IconButton
                icon="delete-outline"
                size={20}
                iconColor={theme.colors.error}
                onPress={() => handleRemoveItem(item.product_id, item.variant_id)}
                accessibilityLabel={`Remove ${product.name || product.title} from cart`}
                accessibilityRole="button"
                accessibilityHint="Removes this item from your shopping cart"
              />
            </View>

            {/* Quantity Controls */}
            <View style={styles.quantityRow}>
              <View style={styles.quantityControls}>
                <IconButton
                  icon="minus"
                  size={18}
                  iconColor={theme.colors.onSurface}
                  onPress={() => handleQuantityChange(item.product_id, item.variant_id, item.quantity, -1)}
                  style={[styles.quantityButton, { backgroundColor: theme.colors.surfaceVariant }]}
                  disabled={item.quantity <= 1}
                  accessibilityLabel={`Decrease quantity of ${product.name || product.title}`}
                  accessibilityRole="button"
                  accessibilityHint="Decreases the quantity of this item by one"
                  accessibilityState={{ disabled: item.quantity <= 1 }}
                />
                <Text
                  variant="bodyLarge"
                  style={{ color: theme.colors.onSurface, minWidth: 30, textAlign: 'center' }}
                  accessibilityLabel={`Quantity: ${item.quantity}`}
                  accessibilityRole="text"
                >
                  {item.quantity}
                </Text>
                <IconButton
                  icon="plus"
                  size={18}
                  iconColor={theme.colors.onSurface}
                  onPress={() => handleQuantityChange(item.product_id, item.variant_id, item.quantity, 1)}
                  style={[styles.quantityButton, { backgroundColor: theme.colors.surfaceVariant }]}
                  accessibilityLabel={`Increase quantity of ${product.name || product.title}`}
                  accessibilityRole="button"
                  accessibilityHint="Increases the quantity of this item by one"
                />
              </View>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                {formatCurrency(item.price * item.quantity, product.currency || 'NGN')}
              </Text>
            </View>

            {/* Notes Input */}
            <TextInput
              label="Add notes (optional)"
              value={item.notes || ''}
              onChangeText={(text) => updateItemNotes(item.product_id, text, item.variant_id)}
              mode="outlined"
              dense
              style={styles.notesInput}
              placeholder="Special instructions..."
            />
          </View>
        </View>
      );
    },
    [theme, handleQuantityChange, handleRemoveItem, updateItemNotes]
  );

  if (cart.items.length === 0) {
    return (
      <ScreenContainer scrollable={true} showOfflineBanner={true}>
        <EmptyState
          icon="cart-outline"
          title={t('cart.empty')}
          description={t('home.explore')}
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
        {/* Cart Items */}
        <View style={styles.itemsContainer}>
          {cart.items.map((item, index) => (
            <View key={index}>
              {renderCartItem(item, index)}
              {index < cart.items.length - 1 && <Divider />}
            </View>
          ))}
        </View>

        {/* Coupon Section */}
        <View style={[styles.couponSection, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 8 }}>
            {t('cart.applyCoupon')}
          </Text>
          <View style={styles.couponRow}>
            <TextInput
              mode="outlined"
              placeholder={t('cart.couponCode')}
              value={couponCode}
              onChangeText={setCouponCode}
              style={styles.couponInput}
              dense
            />
            <Button
              mode="contained"
              onPress={handleApplyCoupon}
              disabled={!couponCode.trim() || applyingCoupon}
              loading={applyingCoupon}
              style={styles.applyButton}
              accessibilityLabel="Apply coupon code"
              accessibilityRole="button"
              accessibilityHint="Applies the entered coupon code to your cart"
              accessibilityState={{ disabled: !couponCode.trim() || applyingCoupon }}
            >
              {t('cart.applyCoupon')}
            </Button>
          </View>
          {cart.coupon_code && (
            <Chip
              icon="check-circle"
              onClose={() => {
                // Remove coupon (would need to extend CartContext)
                console.log('Remove coupon');
              }}
              style={styles.couponChip}
            >
              {cart.coupon_code}
            </Chip>
          )}
        </View>

        {/* Order Summary */}
        <View style={[styles.summarySection, { backgroundColor: theme.colors.surface }]}>
          <Text variant="titleLarge" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
            {t('checkout.orderSummary')}
          </Text>

          <View style={styles.summaryRow}>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
              {t('cart.subtotal')}
            </Text>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
              {formatCurrency(cart.subtotal, 'NGN')}
            </Text>
          </View>

          {cart.delivery_fee > 0 && (
            <View style={styles.summaryRow}>
              <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
                {t('cart.deliveryFee')}
              </Text>
              <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                {formatCurrency(cart.delivery_fee, 'NGN')}
              </Text>
            </View>
          )}

          {cart.discount > 0 && (
            <View style={styles.summaryRow}>
              <Text variant="bodyLarge" style={{ color: theme.colors.error }}>
                {t('cart.discount')}
              </Text>
              <Text variant="bodyLarge" style={{ color: theme.colors.error }}>
                -{formatCurrency(cart.discount, 'NGN')}
              </Text>
            </View>
          )}

          <Divider style={styles.summaryDivider} />

          <View style={styles.summaryRow}>
            <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
              {t('cart.total')}
            </Text>
            <Text variant="titleLarge" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
              {formatCurrency(cart.total, 'NGN')}
            </Text>
          </View>
          <View style={styles.summaryActions}>
            <Button
              mode="outlined"
              onPress={handleClearCart}
              icon="delete-outline"
              style={styles.clearButton}
              textColor={theme.colors.error}
              accessibilityLabel="Clear shopping cart"
              accessibilityRole="button"
              accessibilityHint="Removes all items from your shopping cart"
            >
              {t('common.delete')}
            </Button>
            <Button
              mode="contained"
              onPress={handleCheckout}
              icon="arrow-right"
              style={styles.checkoutButton}
              accessibilityLabel={`Proceed to checkout, total ${formatCurrency(cart.total, 'NGN')}`}
              accessibilityRole="button"
              accessibilityHint="Proceeds to checkout to complete your order"
            >
              {t('cart.proceedToCheckout')}
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
    paddingBottom: 120,
  },
  itemsContainer: {
    paddingVertical: 8,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  itemDetails: {
    flex: 1,
    gap: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemInfo: {
    flex: 1,
  },
  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    margin: 0,
  },
  notesInput: {
    marginTop: 4,
  },
  couponSection: {
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
  couponRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  couponInput: {
    flex: 1,
  },
  applyButton: {
    marginTop: 8,
  },
  couponChip: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  summarySection: {
    padding: 16,
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryDivider: {
    marginVertical: 12,
  },
  summaryActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 32,
    gap: 12,
  },
  clearButton: {
    flex: 1,
  },
  checkoutButton: {
    flex: 2,
  },
});

export default Cart;

