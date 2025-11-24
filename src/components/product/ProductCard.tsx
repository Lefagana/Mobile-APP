import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ImageSourcePropType, Animated, Platform } from 'react-native';
import { Text, Button, useTheme, Surface } from 'react-native-paper';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../contexts/CartContext';
import { useAuthGuard } from '../../utils/authGuard';
import { LoginPromptModal } from '../common';
import { useLocalization } from '../../contexts/LocalizationContext';

export interface ProductCardProps {
  product: Product;
  variant?: 'grid' | 'list';
  onPress?: (product: Product) => void;
  showAddToCart?: boolean;
  imageSource?: ImageSourcePropType;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variant = 'grid',
  onPress,
  showAddToCart = true,
  imageSource,
}) => {
  const theme = useTheme();
  const { addItem } = useCart();
  const { t } = useLocalization();
  const {
    requireAuth,
    showLoginPrompt,
    actionMessage,
    handleLoginSuccess,
    dismissLoginPrompt,
  } = useAuthGuard();

  // Animation value for press effect
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const handlePress = () => {
    if (onPress) {
      onPress(product);
    }
  };

  const handleAddToCart = (e: any) => {
    e.stopPropagation();
    requireAuth(() => {
      addItem(product, 1);
      console.log(`Added ${product.name || product.title} to cart`);
    }, 'add items to cart');
  };

  const displayImage =
    imageSource ||
    (product.image_url ? { uri: product.image_url } : undefined) ||
    (product.images?.[0] ? { uri: product.images[0] } : undefined);
  const price = product.variants?.[0]?.price || product.price || 0;
  const vendorName = product.vendor?.shop_name || product.vendor_name || 'Store';

  if (variant === 'list') {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
          accessibilityRole="button"
          accessibilityLabel={`${product.name || product.title} from ${vendorName}, price ${formatCurrency(price)}`}
          accessibilityHint="Double tap to view product details"
        >
          <Surface style={[styles.listContainer, { backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.md }]} elevation={1}>
            <View style={styles.listImageContainer}>
              {displayImage && (
                <Image
                  source={displayImage}
                  style={styles.listImage}
                  resizeMode="cover"
                  accessibilityLabel={`${product.name || product.title} product image`}
                  accessibilityRole="image"
                  onError={() => { }}
                />
              )}
              {product.is_low_price && (
                <View style={[styles.lowPriceBadge, { backgroundColor: theme.colors.error }]}>
                  <Text variant="labelSmall" style={styles.lowPriceText}>{t('home.lowPrice')}</Text>
                </View>
              )}
            </View>
            <View style={styles.listContent}>
              <Text variant="labelSmall" style={[styles.vendorName, { color: theme.colors.onSurfaceVariant }]}>
                {vendorName}
              </Text>
              <Text variant="titleMedium" style={[styles.productTitle, { color: theme.colors.onSurface }]} numberOfLines={2}>
                {product.name || product.title}
              </Text>
              <Text variant="titleLarge" style={[styles.price, { color: theme.colors.primary }]}>
                {formatCurrency(price)}
              </Text>

              {showAddToCart && (
                <Button
                  mode="contained-tonal"
                  onPress={handleAddToCart}
                  style={styles.addButton}
                  contentStyle={{ height: 36 }}
                  labelStyle={{ fontSize: 12 }}
                  compact
                  accessibilityLabel={`${t('home.addToCart')}: ${product.name || product.title}`}
                  accessibilityRole="button"
                >
                  {t('home.addToCart')}
                </Button>
              )}
            </View>
          </Surface>

          <LoginPromptModal
            visible={showLoginPrompt}
            onDismiss={dismissLoginPrompt}
            message={actionMessage}
            onLoginSuccess={handleLoginSuccess}
          />
        </TouchableOpacity>
      </Animated.View>
    );
  }

  // Grid variant (default)
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], flex: 1 }}>
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={{ flex: 1 }}
        accessibilityRole="button"
        accessibilityLabel={`${product.name || product.title} from ${vendorName}, price ${formatCurrency(price)}`}
        accessibilityHint="Double tap to view product details"
      >
        <Surface style={[styles.gridContainer, { backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg }]} elevation={2}>
          <View style={styles.imageContainer}>
            {displayImage ? (
              <Image
                source={displayImage}
                style={styles.image}
                resizeMode="cover"
                accessibilityLabel={`${product.name || product.title} product image`}
                accessibilityRole="image"
                onError={() => { }}
              />
            ) : (
              <View
                style={[styles.imagePlaceholder, { backgroundColor: theme.colors.surfaceVariant }]}
              >
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  No Image
                </Text>
              </View>
            )}
            {product.is_low_price && (
              <View style={[styles.lowPriceBadgeAbsolute, { backgroundColor: theme.colors.error }]}>
                <Text style={styles.lowPriceText}>{t('home.lowPrice')}</Text>
              </View>
            )}
          </View>

          <View style={styles.content}>
            <Text variant="labelSmall" style={[styles.vendorName, { color: theme.colors.onSurfaceVariant }]} numberOfLines={1}>
              {vendorName}
            </Text>
            <Text variant="bodyMedium" style={[styles.productTitle, { color: theme.colors.onSurface }]} numberOfLines={2}>
              {product.name || product.title}
            </Text>
            <View style={styles.priceRow}>
              <Text variant="titleMedium" style={[styles.price, { color: theme.colors.primary, marginBottom: 0 }]}>
                {formatCurrency(price)}
              </Text>

              {showAddToCart && (
                <Button
                  mode="contained"
                  onPress={handleAddToCart}
                  style={styles.addButton}
                  contentStyle={{ height: 32, width: 32 }}
                  labelStyle={{ marginHorizontal: 0, marginVertical: 0 }}
                  compact
                  icon="cart"
                  accessibilityLabel={`${t('home.addToCart')}: ${product.name || product.title}`}
                  accessibilityRole="button"
                >
                  {""}
                </Button>
              )}
            </View>
          </View>
        </Surface>

        <LoginPromptModal
          visible={showLoginPrompt}
          onDismiss={dismissLoginPrompt}
          message={actionMessage}
          onLoginSuccess={handleLoginSuccess}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    overflow: 'hidden',
    marginBottom: 16,
    flex: 1,
  },
  listContainer: {
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 12,
    padding: 12,
  },
  vendorName: {
    marginBottom: 2,
    opacity: 0.8,
  },
  lowPriceBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  lowPriceBadgeAbsolute: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  lowPriceText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  listImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  listImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 12,
    flex: 1,
    justifyContent: 'space-between',
  },
  listContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productTitle: {
    marginBottom: 4,
    fontWeight: '500',
    minHeight: 40,
  },
  price: {
    fontWeight: '700',
    marginBottom: 8,
  },
  addButton: {
    borderRadius: 100,
    minWidth: 0,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
});

export default ProductCard;
