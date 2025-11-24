import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Text, Platform } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import type { CustomerStackParamList } from '../../navigation/types';
import type { StackNavigationProp } from '@react-navigation/stack';
import { ScreenContainer, ProductCardSkeleton } from '../../components/common';
import { ProductCard } from '../../components/product';
import { Product } from '../../types';
import { api } from '../../services/api';
import GuestPrefsModal from '../../components/common/GuestPrefsModal';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '../../contexts/AuthContext';
import {
  HomeHeader,
  HomeTabBar,
  MartSelector,
  LogisticsButton,
  ExploreSection,
  // BrandCarousel,
  CategoryTabs,
  FeaturedProductsBanner,
  AICartFAB,
  AIPersonsChoice,
  type MartType,
} from '../../components/home';

type HomeScreenNavigationProp = StackNavigationProp<CustomerStackParamList>;

const HomeFeed: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const isFocused = useIsFocused();
  const { user } = useAuth();
  const [selectedMart, setSelectedMart] = useState<MartType>('local');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [showGuestPrefs, setShowGuestPrefs] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('[HomeFeed] Component mounted');
    return () => {
      console.log('[HomeFeed] Component unmounting');
    };
  }, []);

  // Show guest preferences modal if user is not authenticated and not seen before (with slight delay)
  useEffect(() => {
    let mounted = true;
    let timer: NodeJS.Timeout | null = null;
    (async () => {
      try {
        if (!user) {
          const seen = await SecureStore.getItemAsync('wakanda_guest_prefs_seen').catch(() => null);
          if (mounted && !seen) {
            timer = setTimeout(() => {
              if (mounted) setShowGuestPrefs(true);
            }, 2000);
          }
        }
      } catch { }
    })();
    return () => { mounted = false; if (timer) clearTimeout(timer); };
  }, [user]);

  // Fetch products
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ['products', selectedMart, selectedCategory],
    queryFn: () =>
      api.products.list({
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        page: 1,
      }),
    retry: 1,
    staleTime: 30000,
  });

  // Fetch vendors for explore section
  const { data: vendorsData } = useQuery({
    queryKey: ['vendors', 'explore'],
    queryFn: () => api.vendors.list(),
    retry: 1,
    staleTime: 30000,
  });

  // Fetch featured products (using same products list but filtered client-side for now)
  const { data: featuredProductsData } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => api.products.list({ page: 1 }),
    retry: 1,
    staleTime: 30000,
  });

  const products = productsData?.items || [];
  const vendors = (vendorsData || []).slice(0, 10);
  const allProducts = featuredProductsData?.items || [];
  const featuredProducts = allProducts.slice(0, 5);
  const featuredBrands = vendors.slice(0, 6);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchProducts()]);
    setRefreshing(false);
  }, [refetchProducts]);

  const handleProductPress = useCallback(
    (product: Product) => {
      navigation.navigate('ProductDetail', { productId: product.id });
    },
    [navigation]
  );

  const handleVendorPress = useCallback(
    (vendorId: string) => {
      navigation.navigate('VendorDetail', { vendorId });
    },
    [navigation]
  );

  const handleSearchPress = useCallback(() => {
    navigation.navigate('Search');
  }, [navigation]);

  const handleCameraPress = useCallback(() => {
    navigation.navigate('CameraSearch');
  }, [navigation]);

  const handleAICartPress = useCallback(() => {
    // Navigate to Cart page
    navigation.navigate('Cart');
  }, [navigation]);

  const renderProductItem = useCallback(
    ({ item }: { item: Product }) => (
      <View style={styles.productItem}>
        <ProductCard product={item} onPress={handleProductPress} />
      </View>
    ),
    [handleProductPress]
  );

  const renderHeader = () => (
    <View>
      <MartSelector selected={selectedMart} onSelect={setSelectedMart} />
      <LogisticsButton />
      <ExploreSection
        vendors={vendors.slice(0, 6)}
        onVendorPress={vendor => handleVendorPress(vendor.id)}
        onBrowseAllPress={() => navigation.navigate('Vendors')}
      />
      {/* <BrandCarousel
        brands={featuredBrands}
        onBrandPress={vendor => handleVendorPress(vendor.id)}
      /> */}
      {featuredProducts.length > 0 && (
        <FeaturedProductsBanner
          products={featuredProducts}
          onProductPress={handleProductPress}
        />
      )}
      <CategoryTabs
        selectedCategoryId={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      {products.length > 0 && (
        <AIPersonsChoice
          products={products.slice(0, 10)}
          personalizedProducts={products.slice(0, 5)}
          onProductPress={handleProductPress}
        />
      )}
    </View>
  );

  const renderEmpty = () => {
    if (isLoadingProducts) {
      return (
        <View style={styles.emptyContainer}>
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </View>
      );
    }
    return null;
  };

  return (
    <ScreenContainer scrollable={false} showOfflineBanner={true}>
      <View style={styles.container}>
        <HomeHeader
          onSearchPress={handleSearchPress}
          onCameraPress={handleCameraPress}
        />
        <HomeTabBar />
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={true}
          style={styles.list}
          removeClippedSubviews={Platform.OS !== 'web'}
          scrollEnabled={true}
        />
      </View>

      {/* VoiceBottomBar is now global in MainLayout */}

      {isFocused && products.length > 0 && (
        <AICartFAB onPress={handleAICartPress} visible={true} />
      )}

      <GuestPrefsModal
        visible={showGuestPrefs}
        onDismiss={() => setShowGuestPrefs(false)}
        onSaved={() => setShowGuestPrefs(false)}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    ...(Platform.OS === 'web' && { minHeight: 0 }),
  },
  list: {
    flex: 1,
    width: '100%',
    ...(Platform.OS === 'web' && { minHeight: 0 }),
  },
  contentContainer: {
    paddingBottom: 16, // Reduced padding since ScreenContainer handles it
    flexGrow: 1,
  },
  productItem: {
    flex: 1,
    marginHorizontal: 8,
    marginBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  footer: {
    marginTop: 8,
  },
  emptyContainer: {
    padding: 16,
    gap: 16,
  },
});

export default HomeFeed;
