import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
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
      <TouchableOpacity
        onPress={handlePress}
        style={[
          styles.listContainer,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.outlineVariant,
          },
        ]}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`${product.name || product.title} from ${vendorName}, price ${formatCurrency(price)}`}
        accessibilityHint="Double tap to view product details"
      >
        <View style={styles.listImageContainer}>
          {displayImage && (
            <Image 
              source={displayImage} 
              style={styles.listImage} 
              resizeMode="cover"
              accessibilityLabel={`${product.name || product.title} product image`}
              accessibilityRole="image"
              onError={() => {
                // Silently handle image loading errors
              }}
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
          <Text variant="bodyMedium" style={[styles.productTitle, { color: theme.colors.onSurface }]} numberOfLines={2}>
            {product.name || product.title}
          </Text>
          <Text variant="titleMedium" style={[styles.price, { color: theme.colors.primary }]}>
            {formatCurrency(price)}
          </Text>
          <View style={[styles.storeChip, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Text variant="labelSmall" style={[styles.storeChipText, { color: theme.colors.onSurfaceVariant }]}>
              {vendorName}
            </Text>
          </View>
          {showAddToCart && (
            <Button
              mode="contained-tonal"
              onPress={handleAddToCart}
              style={styles.addButton}
              compact
              accessibilityLabel={`${t('home.addToCart')}: ${product.name || product.title}`}
              accessibilityRole="button"
              accessibilityHint={t('cart.title')}
            >
              {t('home.addToCart')}
            </Button>
          )}
        </View>

        {/* Login Prompt Modal */}
        <LoginPromptModal
          visible={showLoginPrompt}
          onDismiss={dismissLoginPrompt}
          message={actionMessage}
          onLoginSuccess={handleLoginSuccess}
        />
      </TouchableOpacity>
    );
  }

  // Grid variant (default)
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.gridContainer,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outlineVariant,
        },
      ]}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${product.name || product.title} from ${vendorName}, price ${formatCurrency(price)}`}
      accessibilityHint="Double tap to view product details"
    >
      <View style={styles.header}>
        <Text variant="labelSmall" style={[styles.vendorName, { color: theme.colors.onSurfaceVariant }]} numberOfLines={1}>
          {vendorName}
        </Text>
        {product.is_low_price && (
          <View style={[styles.lowPriceBadge, { backgroundColor: theme.colors.error }]}> 
            <Text style={styles.lowPriceText}>{t('home.lowPrice')}</Text>
          </View>
        )}
      </View>

      <View style={styles.imageContainer}>
        {displayImage ? (
          <Image 
            source={displayImage} 
            style={styles.image} 
            resizeMode="cover"
            accessibilityLabel={`${product.name || product.title} product image`}
            accessibilityRole="image"
            onError={() => {
              // Silently handle image loading errors
            }}
          />
        ) : (
          <View
            style={[styles.imagePlaceholder, { backgroundColor: theme.colors.surfaceVariant }]}
            accessibilityLabel="Product image not available"
            accessibilityRole="image"
          >
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              No Image
            </Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text variant="bodySmall" style={[styles.productTitle, { color: theme.colors.onSurface }]} numberOfLines={2}>
          {product.name || product.title}
        </Text>
        <Text variant="titleSmall" style={[styles.price, { color: theme.colors.primary }]}>
          {formatCurrency(price)}
        </Text>
        <View style={[styles.storeChip, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Text variant="labelSmall" style={[styles.storeChipText, { color: theme.colors.onSurfaceVariant }]}>
            {vendorName}
          </Text>
        </View>
        {showAddToCart && (
          <Button
            mode="contained-tonal"
            onPress={handleAddToCart}
            style={styles.addButton}
            compact
            accessibilityLabel={`${t('home.addToCart')}: ${product.name || product.title}`}
            accessibilityRole="button"
            accessibilityHint={t('cart.title')}
          >
            {t('home.addToCart')}
          </Button>
        )}
      </View>

      {/* Login Prompt Modal */}
      <LoginPromptModal
        visible={showLoginPrompt}
        onDismiss={dismissLoginPrompt}
        message={actionMessage}
        onLoginSuccess={handleLoginSuccess}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
  listContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 12,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  vendorName: {
    fontSize: 10,
    flex: 1,
  },
  lowPriceBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 4,
  },
  lowPriceText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
  imageContainer: {
    width: '100%',
    height: 150,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
    position: 'relative',
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
    padding: 8,
  },
  listContent: {
    flex: 1,
  },
  productTitle: {
    marginBottom: 4,
    minHeight: 32,
  },
  price: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  storeChip: {
    alignSelf: 'flex-start',
    marginBottom: 8,
    height: 24,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeChipText: {
    fontSize: 10,
  },
  addButton: {
    width: '100%',
  },
});

export default ProductCard;
