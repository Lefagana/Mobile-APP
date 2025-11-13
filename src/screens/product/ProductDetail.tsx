import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Share,
  Alert,
  Linking,
} from 'react-native';
import {
  Text,
  useTheme,
  IconButton,
  Button,
  Chip,
  Divider,
  ActivityIndicator,
  Menu,
} from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { CustomerStackParamList } from '../../navigation/types';
import { ScreenContainer, ErrorState, EmptyState, LoginPromptModal } from '../../components/common';
import { Product, ProductVariant, ProductReview } from '../../types';
import { api } from '../../services/api';
import { useCart } from '../../contexts/CartContext';
import { formatCurrency, formatRelativeTime } from '../../utils/formatters';
import { useAuthGuard } from '../../utils/authGuard';
import { ProductCard } from '../../components/product';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type ProductDetailRouteProp = {
  params: {
    productId: string;
  };
};

type ProductDetailNavigationProp = StackNavigationProp<CustomerStackParamList, 'ProductDetail'>;

const ProductDetail: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<ProductDetailNavigationProp>();
  const route = useRoute<ProductDetailRouteProp>();
  const insets = useSafeAreaInsets();
  const { productId } = route.params;
  const { addItem } = useCart();
  const {
    requireAuth,
    showLoginPrompt,
    actionMessage,
    handleLoginSuccess,
    dismissLoginPrompt,
  } = useAuthGuard();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [contactMenuVisible, setContactMenuVisible] = useState(false);

  // Fetch product details
  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => api.products.getById(productId),
  });

  // Fetch reviews
  const {
    data: reviewsData,
    isLoading: isLoadingReviews,
  } = useQuery({
    queryKey: ['product-reviews', productId, reviewsPage],
    queryFn: () => api.products.getReviews(productId, reviewsPage),
    enabled: !!productId,
  });

  // Fetch related products
  const {
    data: relatedProducts,
    isLoading: isLoadingRelated,
  } = useQuery({
    queryKey: ['product-related', productId],
    queryFn: () => api.products.getRelated(productId, 6),
    enabled: !!productId,
  });

  const displayPrice = selectedVariant?.price || product?.price || 0;
  const displayImages = product?.images || (product?.image_url ? [product.image_url] : []);
  const hasVariants = product?.variants && product.variants.length > 0;

  const handleVariantSelect = useCallback((variant: ProductVariant) => {
    setSelectedVariant(variant);
    setQuantity(1); // Reset quantity when variant changes
  }, []);

  const handleQuantityChange = useCallback(
    (delta: number) => {
      const newQuantity = Math.max(1, quantity + delta);
      setQuantity(newQuantity);
    },
    [quantity]
  );

  const handleAddToCart = useCallback(() => {
    if (!product) return;

    requireAuth(() => {
      addItem(product, quantity, selectedVariant?.id);
      // Show success feedback (can be enhanced with a toast/snackbar)
      console.log(`Added ${quantity} x ${product.name || product.title} to cart`);
    }, 'add items to cart');
  }, [product, quantity, selectedVariant, addItem, requireAuth]);

  const handleBuyNow = useCallback(() => {
    if (!product) return;

    requireAuth(() => {
      addItem(product, quantity, selectedVariant?.id);
      // Navigate to checkout
      // navigation.navigate('CheckoutReview');
      console.log('Navigate to checkout');
    }, 'purchase items');
  }, [product, quantity, selectedVariant, addItem, requireAuth]);

  const handleShare = useCallback(async () => {
    if (!product) return;

    try {
      const productUrl = `https://wakanda-x.app/products/${product.id}`;
      const shareMessage = `Check out ${product.name || product.title} on Wakanda-X!\n${productUrl}`;

      const result = await Share.share({
        message: shareMessage,
        title: product.name || product.title,
      });

      if (result.action === Share.sharedAction) {
        console.log('Product shared successfully');
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to share product. Please try again.');
      console.error('Share error:', error);
    }
  }, [product]);

  const vendorId: any = (product as any)?.vendor?.id || (product as any)?.vendor_id || (product as any)?.vendorId;
  const vendorPhone: string | undefined = (product as any)?.vendor?.phone || (product as any)?.vendor_phone || (product as any)?.contact_phone;

  const handleGoToVendor = useCallback(() => {
    if (vendorId) {
      navigation.navigate('VendorDetail', { vendorId } as any);
    } else {
      Alert.alert('Vendor', 'Vendor details not available');
    }
  }, [navigation, vendorId]);

  const handleCallVendor = useCallback(() => {
    if (vendorPhone) {
      Linking.openURL(`tel:${vendorPhone}`).catch(() => Alert.alert('Call', 'Unable to open dialer'));
    } else {
      Alert.alert('Call', 'Vendor phone number not available');
    }
  }, [vendorPhone]);

  const handleMessageVendor = useCallback(() => {
    // Require auth then navigate to Messages (or dedicated chat screen if wired)
    requireAuth(() => {
      navigation.navigate('Messages');
    }, 'message the vendor');
  }, [navigation, requireAuth]);

  const renderImageGallery = () => {
    if (displayImages.length === 0) {
      return (
        <View
          style={[
            styles.imageContainer,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
        >
          <IconButton icon="image-off" size={48} iconColor={theme.colors.onSurfaceVariant} />
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            No image available
          </Text>
        </View>
      );
    }

    return (
      <View>
        {/* Main Image */}
        <View style={styles.mainImageContainer}>
          <Image
            source={{ uri: displayImages[selectedImageIndex] }}
            style={styles.mainImage}
            resizeMode="cover"
          />
        </View>

        {/* Thumbnail Gallery */}
        {displayImages.length > 1 && (
          <FlatList
            data={displayImages}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailContainer}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => setSelectedImageIndex(index)}
                style={[
                  styles.thumbnail,
                  selectedImageIndex === index && {
                    borderColor: theme.colors.primary,
                    borderWidth: 2,
                  },
                ]}
              >
                <Image source={{ uri: item }} style={styles.thumbnailImage} resizeMode="cover" />
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => `thumb-${index}`}
          />
        )}
      </View>
    );
  };

  const renderVariants = () => {
    if (!hasVariants) return null;

    return (
      <View style={styles.section}>
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Select Variant
        </Text>
        <View style={styles.variantsContainer}>
          {product?.variants?.map((variant) => (
            <Chip
              key={variant.id}
              mode={selectedVariant?.id === variant.id ? 'flat' : 'outlined'}
              selected={selectedVariant?.id === variant.id}
              onPress={() => handleVariantSelect(variant)}
              style={[
                styles.variantChip,
                selectedVariant?.id === variant.id && {
                  backgroundColor: theme.colors.primaryContainer,
                },
              ]}
              textStyle={{
                color:
                  selectedVariant?.id === variant.id
                    ? theme.colors.onPrimaryContainer
                    : theme.colors.onSurface,
              }}
            >
              {variant.label} - {formatCurrency(variant.price, product?.currency || 'NGN')}
            </Chip>
          ))}
        </View>
      </View>
    );
  };

  const renderReviewsSection = () => {
    if (isLoadingReviews) {
      return (
        <View style={styles.section}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Reviews
          </Text>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      );
    }

    if (!reviewsData || reviewsData.reviews.length === 0) {
      return (
        <View style={styles.section}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Reviews
          </Text>
          <EmptyState
            icon="comment-outline"
            title="No reviews yet"
            message="Be the first to review this product!"
          />
        </View>
      );
    }

    return (
      <View style={styles.section}>
        <View style={styles.reviewsHeader}>
          <View>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Reviews ({reviewsData.meta.total})
            </Text>
            {reviewsData.meta.average_rating && (
              <View style={styles.ratingSummary}>
                <IconButton icon="star" size={20} iconColor="#FFD700" />
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                  {reviewsData.meta.average_rating.toFixed(1)}
                </Text>
              </View>
            )}
          </View>
        </View>

        {reviewsData.reviews.map((review: ProductReview) => (
          <View key={review.id} style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
              <View style={styles.reviewUserInfo}>
                {review.user_avatar ? (
                  <Image source={{ uri: review.user_avatar }} style={styles.reviewAvatar} />
                ) : (
                  <View style={[styles.reviewAvatar, { backgroundColor: theme.colors.surfaceVariant }]}>
                    <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
                      {review.user_name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                <View style={styles.reviewUserDetails}>
                  <View style={styles.reviewUserRow}>
                    <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                      {review.user_name}
                    </Text>
                    {review.verified_purchase && (
                      <Chip
                        mode="flat"
                        compact
                        style={[styles.verifiedChip, { backgroundColor: theme.colors.primaryContainer }]}
                        textStyle={{ color: theme.colors.onPrimaryContainer, fontSize: 10 }}
                      >
                        Verified
                      </Chip>
                    )}
                  </View>
                  <View style={styles.reviewRatingRow}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <IconButton
                        key={star}
                        icon={star <= review.rating ? 'star' : 'star-outline'}
                        size={14}
                        iconColor={star <= review.rating ? '#FFD700' : theme.colors.surfaceVariant}
                        style={styles.starIcon}
                      />
                    ))}
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginLeft: 4 }}>
                      {formatRelativeTime(review.created_at)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {review.title && (
              <Text variant="titleSmall" style={{ color: theme.colors.onSurface, marginTop: 8, fontWeight: '600' }}>
                {review.title}
              </Text>
            )}

            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, marginTop: 4 }}>
              {review.comment}
            </Text>

            {review.images && review.images.length > 0 && (
              <FlatList
                data={review.images}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.reviewImages}
                renderItem={({ item }) => (
                  <Image source={{ uri: item }} style={styles.reviewImage} />
                )}
                keyExtractor={(item, index) => `review-img-${index}`}
              />
            )}

            {review.helpful_count !== undefined && review.helpful_count > 0 && (
              <View style={styles.reviewFooter}>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {review.helpful_count} people found this helpful
                </Text>
              </View>
            )}

            <Divider style={styles.reviewDivider} />
          </View>
        ))}

        {reviewsData.meta.total > reviewsData.reviews.length && (
          <Button
            mode="outlined"
            onPress={() => setReviewsPage(prev => prev + 1)}
            style={styles.loadMoreButton}
          >
            Load More Reviews
          </Button>
        )}
      </View>
    );
  };

  const renderRelatedProducts = () => {
    if (isLoadingRelated) {
      return (
        <View style={styles.section}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Related Products
          </Text>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      );
    }

    if (!relatedProducts || relatedProducts.length === 0) {
      return null;
    }

    return (
      <View style={styles.section}>
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Related Products
        </Text>
        <FlatList
          data={relatedProducts}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.relatedProductsList}
          renderItem={({ item }) => (
            <View style={styles.relatedProductItem}>
              <ProductCard product={item} variant="grid" onPress={() => {
                navigation.replace('ProductDetail', { productId: item.id });
              }} />
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  };

  const renderQuantitySelector = () => {
    return (
      <View style={styles.quantityContainer}>
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Quantity
        </Text>
        <View style={styles.quantityControls}>
          <IconButton
            icon="minus"
            size={20}
            iconColor={theme.colors.onSurface}
            onPress={() => handleQuantityChange(-1)}
            style={[
              styles.quantityButton,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
            disabled={quantity <= 1}
            accessibilityLabel="Decrease quantity"
            accessibilityRole="button"
            accessibilityHint="Decreases the quantity by one"
          />
          <Text 
            variant="titleMedium" 
            style={{ color: theme.colors.onSurface, minWidth: 40, textAlign: 'center' }}
            accessibilityRole="text"
            accessibilityLabel={`Quantity: ${quantity}`}
          >
            {quantity}
          </Text>
          <IconButton
            icon="plus"
            size={20}
            iconColor={theme.colors.onSurface}
            onPress={() => handleQuantityChange(1)}
            style={[
              styles.quantityButton,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
            accessibilityLabel="Increase quantity"
            accessibilityRole="button"
            accessibilityHint="Increases the quantity by one"
          />
        </View>
      </View>
    );
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

  if (isError || !product) {
    return (
      <ScreenContainer scrollable={false}>
        <ErrorState
          title="Product Not Found"
          message="Unable to load product details. Please try again."
          onRetry={refetch}
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
        {/* Image Gallery */}
        {renderImageGallery()}

        {/* Product Info */}
        <View style={styles.productInfo}>
          <View style={styles.headerRow}>
            <View style={styles.titleContainer}>
              <Text variant="headlineSmall" style={{ color: theme.colors.onSurface }}>
                {product.name || product.title}
              </Text>
              {product.is_low_price && (
                <Chip
                  mode="flat"
                  style={[
                    styles.lowPriceBadge,
                    { backgroundColor: theme.colors.errorContainer },
                  ]}
                  textStyle={{ color: theme.colors.onErrorContainer, fontSize: 10 }}
                >
                  Low Price
                </Chip>
              )}
            </View>
            <View style={styles.headerActions}>
              <Menu
                visible={contactMenuVisible}
                onDismiss={() => setContactMenuVisible(false)}
                anchor={
                  <IconButton
                    icon="account-box-outline"
                    size={24}
                    iconColor={theme.colors.onSurface}
                    onPress={() => setContactMenuVisible(true)}
                    accessibilityLabel="Contact vendor"
                    accessibilityRole="button"
                    accessibilityHint="Opens options to call or message the vendor"
                  />
                }
                contentStyle={{ minWidth: 220 }}
              >
                <Menu.Item onPress={handleCallVendor} leadingIcon="phone" title="Call vendor" />
                <Menu.Item onPress={handleMessageVendor} leadingIcon="message" title="Message vendor" />
              </Menu>
              <IconButton
                icon="share-variant"
                size={24}
                iconColor={theme.colors.onSurface}
                onPress={handleShare}
                accessibilityLabel="Share product"
                accessibilityRole="button"
                accessibilityHint="Shares this product with others"
              />
              <IconButton
                icon="heart-outline"
                size={24}
                iconColor={theme.colors.onSurface}
                onPress={() => console.log('Add to favorites')}
                accessibilityLabel="Add to favorites"
                accessibilityRole="button"
                accessibilityHint="Adds this product to your favorites"
              />
            </View>
          </View>

          {/* Price */}
          <Text
            variant="headlineMedium"
            style={[styles.price, { color: theme.colors.primary }]}
          >
            {formatCurrency(displayPrice, product.currency)}
          </Text>

          {/* Vendor Info */}
          {product.vendor && (
            <TouchableOpacity
              style={styles.vendorInfo}
              onPress={handleGoToVendor}
            >
              <IconButton icon="store" size={20} iconColor={theme.colors.primary} />
              <Text variant="bodyMedium" style={{ color: theme.colors.primary, textDecorationLine: 'underline' }}>
                {product.vendor.shop_name || product.vendor_name}
              </Text>
              {product.vendor.rating && (
                <View style={styles.ratingContainer}>
                  <IconButton icon="star" size={16} iconColor="#FFD700" />
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurface }}>
                    {product.vendor.rating.toFixed(1)}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          {/* Rating */}
          {product.rating && (
            <View style={styles.ratingRow}>
              <IconButton icon="star" size={20} iconColor="#FFD700" />
              <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                {product.rating.toFixed(1)}
              </Text>
              {product.review_count && (
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  ({product.review_count} reviews)
                </Text>
              )}
            </View>
          )}

          {/* Actions */}
          <View style={styles.bottomActions}>
            <Button
              mode="outlined"
              onPress={handleAddToCart}
              icon="cart-outline"
              style={styles.cartButton}
            >
              Add to Cart
            </Button>
            <Button
              mode="contained"
              onPress={handleBuyNow}
              icon="flash"
              style={styles.buyButton}
            >
              Buy Now
            </Button>
          </View>
          <Divider style={styles.divider} />

          {/* Product Details */}
          <View style={styles.section}>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Product Details
            </Text>
            {product.inventory !== undefined && (
              <View style={styles.detailRow}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Stock:
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                  {product.inventory > 0 ? `${product.inventory} available` : 'Out of stock'}
                </Text>
              </View>
            )}
            {product.category && (
              <View style={styles.detailRow}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Category:
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                  {product.category}
                </Text>
              </View>
            )}
          </View>

          <Divider style={styles.divider} />

          {/* Reviews Section */}
          {renderReviewsSection()}

          <Divider style={styles.divider} />

          {/* Related Products */}
          {renderRelatedProducts()}
        </View>
      </ScrollView>

      {/* Login Prompt Modal */}
      <LoginPromptModal
        visible={showLoginPrompt}
        onDismiss={dismissLoginPrompt}
        message={actionMessage}
        onLoginSuccess={handleLoginSuccess}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 16, // Reduced since there's no fixed bottom bar
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainImageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  lowPriceBadge: {
    height: 24,
    marginLeft: 8,
  },
  price: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  vendorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  variantsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  variantChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  quantityContainer: {
    marginBottom: 16,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 8,
  },
  quantityButton: {
    margin: 0,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  cartButton: {
    flex: 1,
    marginRight: 8,
  },
  buyButton: {
    flex: 1,
    marginLeft: 8,
  },
  reviewsHeader: {
    marginBottom: 16,
  },
  ratingSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  reviewItem: {
    marginBottom: 16,
  },
  reviewHeader: {
    marginBottom: 8,
  },
  reviewUserInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewUserDetails: {
    flex: 1,
  },
  reviewUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  verifiedChip: {
    height: 20,
  },
  reviewRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  starIcon: {
    margin: 0,
    width: 14,
    height: 14,
  },
  reviewImages: {
    marginTop: 12,
    gap: 8,
  },
  reviewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
  },
  reviewFooter: {
    marginTop: 8,
  },
  reviewDivider: {
    marginTop: 16,
    marginBottom: 0,
  },
  loadMoreButton: {
    marginTop: 8,
  },
  relatedProductsList: {
    paddingVertical: 8,
    gap: 12,
  },
  relatedProductItem: {
    width: 180,
    marginRight: 12,
  },
});

export default ProductDetail;

