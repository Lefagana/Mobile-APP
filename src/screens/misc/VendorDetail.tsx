import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, FlatList, TouchableOpacity, Image } from 'react-native';
import {
  Text,
  useTheme,
  IconButton,
  Chip,
  Divider,
  ActivityIndicator,
  Button,
} from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { CustomerStackParamList } from '../../navigation/types';
import { ScreenContainer, ErrorState, EmptyState } from '../../components/common';
import { ProductCard } from '../../components/product';
import { Vendor, Product } from '../../types';
import { api } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

type VendorDetailRouteProp = {
  params: {
    vendorId: string;
  };
};

type VendorDetailNavigationProp = StackNavigationProp<CustomerStackParamList, 'VendorDetail'>;

const VendorDetail: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<VendorDetailNavigationProp>();
  const route = useRoute<VendorDetailRouteProp>();
  const { vendorId } = route.params;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Fetch vendor details
  const {
    data: vendor,
    isLoading: isLoadingVendor,
    isError: isErrorVendor,
    refetch: refetchVendor,
  } = useQuery({
    queryKey: ['vendor', vendorId],
    queryFn: () => api.vendors.getById(vendorId),
  });

  // Fetch vendor products
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ['products', 'vendor', vendorId, selectedCategory],
    queryFn: async () => {
      const result = await api.products.list({
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        page: 1,
      });
      // Filter products by vendor_id
      return {
        ...result,
        items: result.items.filter((p: Product) => p.vendor_id === vendorId),
      };
    },
  });

  const vendorProducts = productsData?.items || [];

  const categories = ['all', 'fashion', 'electronics', 'kids', 'shoes', 'groceries'];
  const categoryLabels: Record<string, string> = {
    all: 'All',
    fashion: 'Fashion',
    electronics: 'Electronics',
    kids: 'Kids',
    shoes: 'Shoes',
    groceries: 'Groceries',
  };

  const handleProductPress = useCallback(
    (product: Product) => {
      navigation.navigate('ProductDetail', { productId: product.id });
    },
    [navigation]
  );

  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
  }, []);

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
      {/* Vendor Info */}
      <View style={styles.vendorInfo}>
        <View style={[styles.vendorLogo, { backgroundColor: theme.colors.primaryContainer }]}>
          <Text variant="headlineMedium" style={{ color: theme.colors.onPrimaryContainer }}>
            {vendor?.shop_name?.[0]?.toUpperCase() || 'S'}
          </Text>
        </View>
        <View style={styles.vendorDetails}>
          <Text variant="headlineSmall" style={{ color: theme.colors.onSurface }}>
            {vendor?.shop_name || 'Store'}
          </Text>
          {vendor?.rating && (
            <View style={styles.ratingRow}>
              <IconButton icon="star" size={20} iconColor="#FFD700" />
              <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                {vendor.rating.toFixed(1)}
              </Text>
            </View>
          )}
          {vendor?.address_text && (
            <View style={styles.locationRow}>
              <IconButton icon="map-marker" size={16} iconColor={theme.colors.onSurfaceVariant} />
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                {vendor.address_text}
              </Text>
            </View>
          )}
        </View>
      </View>

      <Divider style={styles.divider} />

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <Chip
            key={category}
            mode={selectedCategory === category ? 'flat' : 'outlined'}
            selected={selectedCategory === category}
            onPress={() => handleCategorySelect(category)}
            style={[
              styles.categoryChip,
              selectedCategory === category && {
                backgroundColor: theme.colors.primaryContainer,
                borderColor: theme.colors.primary,
              },
            ]}
            textStyle={{
              color:
                selectedCategory === category
                  ? theme.colors.onPrimaryContainer
                  : theme.colors.onSurface,
              fontWeight: selectedCategory === category ? '600' : '400',
            }}
          >
            {categoryLabels[category]}
          </Chip>
        ))}
      </ScrollView>

      <Divider style={styles.divider} />

      {/* Products Count */}
      <View style={styles.productsHeader}>
        <Text variant="titleLarge" style={{ color: theme.colors.onSurface }}>
          Products ({vendorProducts.length})
        </Text>
      </View>
    </View>
  );

  const renderProductItem = useCallback(
    ({ item }: { item: Product }) => (
      <View style={styles.productItem}>
        <ProductCard product={item} onPress={handleProductPress} />
      </View>
    ),
    [handleProductPress]
  );

  if (isLoadingVendor) {
    return (
      <ScreenContainer scrollable={false}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  if (isErrorVendor || !vendor) {
    return (
      <ScreenContainer scrollable={false}>
        <ErrorState
          title="Vendor Not Found"
          message="Unable to load vendor details. Please try again."
          onRetry={refetchVendor}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable={false} showOfflineBanner={true}>
      <FlatList
        data={vendorProducts}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          isLoadingProducts ? (
            <View style={styles.emptyContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          ) : (
            <EmptyState
              icon="package-variant"
              title="No Products Found"
              description="This vendor doesn't have any products in this category yet."
            />
          )
        }
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
  },
  vendorInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  vendorLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vendorDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  divider: {
    marginVertical: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 4,
    gap: 8,
  },
  categoryChip: {
    marginRight: 8,
  },
  productsHeader: {
    marginTop: 8,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  productItem: {
    flex: 1,
    margin: 8,
    maxWidth: '48%',
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
});

export default VendorDetail;

