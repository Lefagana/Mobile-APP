import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, useWindowDimensions } from 'react-native';
import { Text, Searchbar, IconButton, Surface, useTheme, SegmentedButtons, ActivityIndicator } from 'react-native-paper';
import { ScreenContainer } from '../../../components/common/ScreenContainer';
import { ProductCard } from '../../../components/product/ProductCard';
import { api } from '../../../services/api';
import type { VendorStackParamList } from '../../../navigation/types';
import type { StackScreenProps } from '@react-navigation/stack';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Product } from '../../../types';


type Props = StackScreenProps<VendorStackParamList, 'MarketplaceBrowser'>;

export default function MarketplaceBrowser({ navigation }: Props) {
    const theme = useTheme();
    const { width } = useWindowDimensions();
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [category, setCategory] = useState('all');
    const [refreshing, setRefreshing] = useState(false);

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Responsive grid
    const numColumns = width > 600 ? 3 : 2;

    useEffect(() => {
        fetchProducts();
    }, [searchQuery, category]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params: any = { page: 1 };
            if (searchQuery) params.q = searchQuery;
            if (category !== 'all') params.category = category;

            const response = await api.products.list(params);
            setProducts(response.items);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchProducts();
    };

    const handleProductPress = (productId: string) => {
        // Navigate to customer ProductDetail screen for shopping
        navigation.navigate('CustomerProductDetail' as any, { productId });
    };

    const renderGridItem = ({ item }: any) => (
        <View style={[styles.gridItem, { width: (width - 32 - (numColumns - 1) * 12) / numColumns }]}>
            <ProductCard
                product={item}
                variant="grid"
                onPress={() => handleProductPress(item.id)}
            />
        </View>
    );

    const renderListItem = ({ item }: any) => (
        <View style={styles.listItem}>
            <ProductCard
                product={item}
                variant="list"
                onPress={() => handleProductPress(item.id)}
            />
        </View>
    );

    const renderHeader = () => (
        <View style={styles.header}>
            <Text variant="headlineSmall" style={styles.title}>Marketplace</Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
                Browse and purchase products from the marketplace
            </Text>

            {/* Search Bar */}
            <Searchbar
                placeholder="Search products..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
                elevation={0}
            />

            {/* View Toggle and Category Filter */}
            <View style={styles.controls}>
                <View style={styles.viewToggle}>
                    <IconButton
                        icon="view-grid"
                        selected={viewMode === 'grid'}
                        onPress={() => setViewMode('grid')}
                        size={22}
                        mode={viewMode === 'grid' ? 'contained' : 'outlined'}
                    />
                    <IconButton
                        icon="view-list"
                        selected={viewMode === 'list'}
                        onPress={() => setViewMode('list')}
                        size={22}
                        mode={viewMode === 'list' ? 'contained' : 'outlined'}
                    />
                </View>

                <SegmentedButtons
                    value={category}
                    onValueChange={setCategory}
                    buttons={[
                        { value: 'all', label: 'All' },
                        { value: 'electronics', label: 'Electronics' },
                        { value: 'fashion', label: 'Fashion' },
                        { value: 'food', label: 'Food' },
                    ]}
                    style={styles.categoryFilter}
                    density="small"
                />
            </View>

            <Text variant="bodySmall" style={styles.resultCount}>
                {products.length} products found
            </Text>
        </View>
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <>
                    <MaterialCommunityIcons name="package-variant-closed" size={64} color="#CCC" />
                    <Text variant="titleMedium" style={styles.emptyTitle}>No products found</Text>
                    <Text variant="bodyMedium" style={styles.emptyMessage}>
                        Try adjusting your search or filters
                    </Text>
                </>
            )}
        </View>
    );

    return (
        <ScreenContainer style={{ backgroundColor: '#F5F7FA' }} scrollable={false} withBottomPadding={false}>
            <FlatList
                data={products}
                renderItem={viewMode === 'grid' ? renderGridItem : renderListItem}
                keyExtractor={(item) => item.id}
                numColumns={viewMode === 'grid' ? numColumns : 1}
                key={viewMode === 'grid' ? `grid-${numColumns}` : 'list'}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmpty}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={viewMode === 'grid' ? { gap: 12 } : undefined}
                showsVerticalScrollIndicator={false}
                refreshing={refreshing}
                onRefresh={handleRefresh}
            />
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    header: {
        padding: 16,
        backgroundColor: '#FFF',
        marginBottom: 12,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        color: '#777',
        marginBottom: 16,
    },
    searchBar: {
        backgroundColor: '#F5F5F5',
        marginBottom: 12,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    viewToggle: {
        flexDirection: 'row',
        gap: 4,
    },
    categoryFilter: {
        flex: 1,
        marginLeft: 12,
    },
    resultCount: {
        color: '#999',
    },
    listContent: {
        padding: 16,
    },
    gridItem: {
        marginBottom: 12,
    },
    listItem: {
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 64,
    },
    emptyTitle: {
        marginTop: 16,
        fontWeight: '600',
    },
    emptyMessage: {
        marginTop: 8,
        color: '#999',
        textAlign: 'center',
    },
});
