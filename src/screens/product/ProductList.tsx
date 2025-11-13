import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import {
  Text,
  useTheme,
  IconButton,
  Menu,
  Chip,
  Divider,
  Button,
  Searchbar,
} from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { CustomerStackParamList } from '../../navigation/types';
import { ScreenContainer, ErrorState, EmptyState } from '../../components/common';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { ProductCard } from '../../components/product';
import { Product } from '../../types';
import { api } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

type ProductListNavigationProp = StackNavigationProp<CustomerStackParamList, 'ProductList'>;
type ProductListRouteProp = RouteProp<CustomerStackParamList, 'ProductList'>;

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'rating';
type ViewMode = 'grid' | 'list';

const CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'kids', name: 'Kids' },
  { id: 'shoes', name: 'Shoes' },
  { id: 'groceries', name: 'Groceries' },
  { id: 'local_mart', name: 'Local Mart' },
];

const SORT_OPTIONS: { id: SortOption; label: string; icon: string }[] = [
  { id: 'newest', label: 'Newest', icon: 'clock-outline' },
  { id: 'price_asc', label: 'Price: Low to High', icon: 'arrow-up' },
  { id: 'price_desc', label: 'Price: High to Low', icon: 'arrow-down' },
  { id: 'rating', label: 'Highest Rated', icon: 'star' },
];

const ProductList: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<ProductListNavigationProp>();
  const route = useRoute<ProductListRouteProp>();
  
  // Get initial filters from route params
  const initialCategory = route.params?.category || 'all';
  const initialSearch = route.params?.searchQuery || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [priceRange, setPriceRange] = useState<{ min?: number; max?: number }>({});
  const [selectedVendor, setSelectedVendor] = useState<string | undefined>();
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch products
  const {
    data: productsData,
    isLoading,
    isError,
    refetch,
    error,
  } = useQuery({
    queryKey: ['products', 'list', selectedCategory, searchQuery, selectedVendor],
    queryFn: () =>
      api.products.list({
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        q: searchQuery || undefined,
        page: 1,
      }),
    retry: 1,
    staleTime: 30000,
  });

  // Fetch vendors for filter
  const { data: vendorsData } = useQuery({
    queryKey: ['vendors', 'list'],
    queryFn: () => api.vendors.list(),
    retry: 1,
    staleTime: 60000,
  });

  const products = productsData?.items || [];
  const vendors = vendorsData || [];

  // Filter and sort products client-side
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Apply price filter
    if (priceRange.min !== undefined) {
      filtered = filtered.filter(p => p.price >= priceRange.min!);
    }
    if (priceRange.max !== undefined) {
      filtered = filtered.filter(p => p.price <= priceRange.max!);
    }

    // Apply vendor filter
    if (selectedVendor) {
      filtered = filtered.filter(p => p.vendor_id === selectedVendor);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
        default:
          return (
            new Date(b.created_at || 0).getTime() -
            new Date(a.created_at || 0).getTime()
          );
      }
    });

    return filtered;
  }, [products, priceRange, selectedVendor, sortOption]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleProductPress = useCallback(
    (product: Product) => {
      navigation.navigate('ProductDetail', { productId: product.id });
    },
    [navigation]
  );

  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
  }, []);

  const handleSortSelect = useCallback((option: SortOption) => {
    setSortOption(option);
    setSortMenuVisible(false);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedCategory('all');
    setPriceRange({});
    setSelectedVendor(undefined);
    setSearchQuery('');
    setFilterMenuVisible(false);
  }, []);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (priceRange.min !== undefined || priceRange.max !== undefined) count++;
    if (selectedVendor) count++;
    if (searchQuery) count++;
    return count;
  }, [selectedCategory, priceRange, selectedVendor, searchQuery]);

  const renderProductItem = useCallback(
    ({ item }: { item: Product }) => (
      <View style={viewMode === 'grid' ? styles.gridItem : styles.listItem}>
        <ProductCard
          product={item}
          variant={viewMode}
          onPress={handleProductPress}
          showAddToCart={true}
        />
      </View>
    ),
    [viewMode, handleProductPress]
  );

  const renderHeader = () => (
    <View>
      {/* Search Bar */}
      <Searchbar
        placeholder="Search products..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
        icon="magnify"
        clearIcon="close-circle"
        onClearIconPress={() => setSearchQuery('')}
      />

      {/* Category Filter Pills */}
      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          data={CATEGORIES}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Chip
              selected={selectedCategory === item.id}
              onPress={() => handleCategorySelect(item.id)}
              style={[
                styles.categoryChip,
                selectedCategory === item.id && {
                  backgroundColor: theme.colors.primaryContainer,
                },
              ]}
              textStyle={{
                color: selectedCategory === item.id ? theme.colors.onPrimaryContainer : theme.colors.onSurface,
              }}
            >
              {item.name}
            </Chip>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      {/* Toolbar */}
      <View style={[styles.toolbar, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.toolbarLeft}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
            {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'product' : 'products'}
          </Text>
          {activeFiltersCount > 0 && (
            <Chip
              icon="filter"
              onPress={() => setFilterMenuVisible(true)}
              style={styles.filterChip}
              compact
            >
              {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''}
            </Chip>
          )}
        </View>

        <View style={styles.toolbarRight}>
          <Menu
            visible={sortMenuVisible}
            onDismiss={() => setSortMenuVisible(false)}
            anchor={
              <IconButton
                icon="sort"
                size={24}
                iconColor={theme.colors.onSurface}
                onPress={() => setSortMenuVisible(true)}
              />
            }
          >
            {SORT_OPTIONS.map(option => (
              <Menu.Item
                key={option.id}
                onPress={() => handleSortSelect(option.id)}
                title={option.label}
                leadingIcon={option.icon}
                titleStyle={
                  sortOption === option.id
                    ? { color: theme.colors.primary, fontWeight: '600' }
                    : {}
                }
              />
            ))}
          </Menu>

          <IconButton
            icon={viewMode === 'grid' ? 'view-list' : 'view-grid'}
            size={24}
            iconColor={theme.colors.onSurface}
            onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          />
        </View>
      </View>

      <Divider />
    </View>
  );

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <LoadingSkeleton width="100%" height={200} style={{ marginBottom: 16 }} />
          <LoadingSkeleton width="100%" height={200} style={{ marginBottom: 16 }} />
          <LoadingSkeleton width="100%" height={200} />
        </View>
      );
    }

    return (
      <EmptyState
        icon="package-variant-closed"
        title="No products found"
        message={
          activeFiltersCount > 0
            ? 'Try adjusting your filters to see more results'
            : 'No products available at the moment'
        }
        action={
          activeFiltersCount > 0 ? (
            <Button mode="outlined" onPress={handleClearFilters}>
              Clear Filters
            </Button>
          ) : undefined
        }
      />
    );
  };

  if (isError) {
    return (
      <ScreenContainer>
        <ErrorState
          message="Failed to load products"
          onRetry={() => refetch()}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable={false} showOfflineBanner={true}>
      {renderHeader()}
      <FlatList
        data={filteredAndSortedProducts}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        numColumns={viewMode === 'grid' ? 2 : 1}
        columnWrapperStyle={viewMode === 'grid' ? styles.row : undefined}
        contentContainerStyle={styles.contentContainer}
        ListEmptyComponent={renderEmpty}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={true}
        key={viewMode} // Force re-render when view mode changes
      />

      {/* Filter Menu */}
      <Menu
        visible={filterMenuVisible}
        onDismiss={() => setFilterMenuVisible(false)}
        anchor={<View style={styles.hiddenAnchor} />}
        contentStyle={styles.filterMenu}
      >
        <Menu.Item
          onPress={() => {
            // TODO: Implement price range picker
            setFilterMenuVisible(false);
          }}
          title="Price Range"
          leadingIcon="currency-ngn"
        />
        <Menu.Item
          onPress={() => {
            // TODO: Implement vendor picker
            setFilterMenuVisible(false);
          }}
          title="Vendor"
          leadingIcon="store"
        />
        {activeFiltersCount > 0 && (
          <>
            <Divider />
            <Menu.Item
              onPress={handleClearFilters}
              title="Clear All Filters"
              leadingIcon="filter-remove"
              titleStyle={{ color: theme.colors.error }}
            />
          </>
        )}
      </Menu>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  searchbar: {
    margin: 16,
    marginBottom: 8,
  },
  categoryContainer: {
    marginVertical: 8,
  },
  categoryList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    marginRight: 8,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  toolbarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toolbarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterChip: {
    height: 28,
  },
  contentContainer: {
    padding: 8,
    paddingBottom: 100,
  },
  gridItem: {
    flex: 1,
    margin: 4,
    maxWidth: '48%',
  },
  listItem: {
    marginBottom: 8,
  },
  row: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    padding: 16,
    gap: 16,
  },
  filterMenu: {
    minWidth: 200,
  },
  hiddenAnchor: {
    position: 'absolute',
    width: 0,
    height: 0,
  },
});

export default ProductList;

