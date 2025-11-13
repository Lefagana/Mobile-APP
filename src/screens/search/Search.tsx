import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, TextInput as RNTextInput, ScrollView } from 'react-native';
import { Text, useTheme, IconButton, Chip, ActivityIndicator } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { CustomerStackParamList } from '../../navigation/types';
import { ScreenContainer, EmptyState, ErrorState } from '../../components/common';
import { ProductCard } from '../../components/product';
import { Product } from '../../types';
import { api } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SearchScreenNavigationProp = StackNavigationProp<CustomerStackParamList, 'Search'>;

const RECENT_SEARCHES_KEY = 'wakanda_recent_searches';
const MAX_RECENT_SEARCHES = 5;

const CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'kids', name: 'Kids' },
  { id: 'shoes', name: 'Shoes' },
  { id: 'groceries', name: 'Groceries' },
];

const Search: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchInputRef = React.useRef<RNTextInput>(null);

  // Load recent searches on mount
  useEffect(() => {
    loadRecentSearches();
  }, []);

  // Auto-focus search input when screen is focused
  useFocusEffect(
    useCallback(() => {
      // Small delay to ensure keyboard shows properly
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }, [])
  );

  const loadRecentSearches = async () => {
    try {
      const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load recent searches:', error);
    }
  };

  const saveRecentSearch = async (query: string) => {
    if (!query.trim()) return;

    try {
      const updated = [
        query.trim(),
        ...recentSearches.filter(s => s.toLowerCase() !== query.trim().toLowerCase()),
      ].slice(0, MAX_RECENT_SEARCHES);

      setRecentSearches(updated);
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save recent search:', error);
    }
  };

  // Fetch search results
  const {
    data: searchResults,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['products', 'search', searchQuery, selectedCategory],
    queryFn: () =>
      api.products.list({
        q: searchQuery,
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        page: 1,
      }),
    enabled: searchQuery.trim().length > 0,
  });

  const products = searchResults?.items || [];

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (query.trim()) {
        saveRecentSearch(query);
      }
    },
    [recentSearches]
  );

  const handleRecentSearchPress = useCallback(
    (query: string) => {
      setSearchQuery(query);
      saveRecentSearch(query);
      searchInputRef.current?.focus();
    },
    [recentSearches]
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  }, []);

  const handleProductPress = useCallback(
    (product: Product) => {
      navigation.navigate('ProductDetail', { productId: product.id });
    },
    [navigation]
  );

  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
  }, []);

  const handleCameraPress = useCallback(() => {
    navigation.navigate('CameraSearch');
  }, [navigation]);

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
        <IconButton icon="magnify" size={24} iconColor={theme.colors.onSurfaceVariant} />
        <RNTextInput
          ref={searchInputRef}
          style={[styles.searchInput, { color: theme.colors.onSurface }]}
          placeholder="Search products..."
          placeholderTextColor={theme.colors.onSurfaceVariant}
          value={searchQuery}
          onChangeText={handleSearch}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <IconButton
            icon="close-circle"
            size={20}
            iconColor={theme.colors.onSurfaceVariant}
            onPress={handleClearSearch}
          />
        )}
        <IconButton
          icon="camera"
          size={24}
          iconColor={theme.colors.primary}
          onPress={handleCameraPress}
        />
      </View>

      {/* Recent Searches */}
      {searchQuery.length === 0 && recentSearches.length > 0 && (
        <View style={styles.recentSearchesContainer}>
          <View style={styles.sectionHeader}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
              Recent Searches
            </Text>
            <TouchableOpacity
              onPress={async () => {
                setRecentSearches([]);
                try {
                  await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
                } catch (error) {
                  console.error('Failed to clear recent searches:', error);
                }
              }}
            >
              <Text variant="bodySmall" style={{ color: theme.colors.primary }}>
                Clear
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.recentSearches}>
            {recentSearches.map((search, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.recentSearchChip,
                  { backgroundColor: theme.colors.surfaceVariant },
                ]}
                onPress={() => handleRecentSearchPress(search)}
              >
                <IconButton
                  icon="clock-outline"
                  size={16}
                  iconColor={theme.colors.onSurfaceVariant}
                />
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                  {search}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Category Filters */}
      {searchQuery.length > 0 && (
        <View style={styles.categoriesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {CATEGORIES.map(category => (
              <Chip
                key={category.id}
                mode={selectedCategory === category.id ? 'flat' : 'outlined'}
                selected={selectedCategory === category.id}
                onPress={() => handleCategorySelect(category.id)}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && {
                    backgroundColor: theme.colors.primaryContainer,
                    borderColor: theme.colors.primary,
                  },
                ]}
                textStyle={{
                  color:
                    selectedCategory === category.id
                      ? theme.colors.onPrimaryContainer
                      : theme.colors.onSurface,
                  fontWeight: selectedCategory === category.id ? '600' : '400',
                }}
              >
                {category.name}
              </Chip>
            ))}
          </ScrollView>
        </View>
      )}
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

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, marginTop: 16 }}>
            Searching...
          </Text>
        </View>
      );
    }

    if (isError) {
      return (
        <ErrorState
          title="Search Error"
          message="Failed to search products. Please try again."
          onRetry={refetch}
        />
      );
    }

    if (searchQuery.trim().length === 0) {
      return (
        <EmptyState
          icon="magnify"
          title="Search Products"
          description="Start typing to search for products across all categories"
        />
      );
    }

    return (
      <EmptyState
        icon="magnify"
        title="No Results Found"
        description={`No products found for "${searchQuery}". Try a different search term.`}
      />
    );
  };

  return (
    <ScreenContainer scrollable={false} showOfflineBanner={true}>
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[
          styles.contentContainer,
          products.length === 0 && styles.emptyContentContainer,
        ]}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    paddingHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  recentSearchesContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recentSearches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recentSearchChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  categoriesContainer: {
    marginTop: 8,
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    marginRight: 8,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  emptyContentContainer: {
    flexGrow: 1,
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
});

export default Search;
