import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Card, FAB, Chip, Searchbar, IconButton, useTheme } from 'react-native-paper';
import { ScreenContainer } from '../../../components/common/ScreenContainer';
import { useVendor } from '../../../contexts/VendorContext';
import { formatCurrency } from '../../../utils/formatters';
import type { VendorStackParamList } from '../../../navigation/types';
import type { StackScreenProps } from '@react-navigation/stack';
import { VendorProduct } from '../../../types/vendor';

type Props = StackScreenProps<VendorStackParamList, 'Products'>;

export default function ProductList({ navigation }: Props) {
    const theme = useTheme();
    const { products } = useVendor();
    const [searchQuery, setSearchQuery] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState<'all' | 'active' | 'inactive' | 'draft'>('all');

    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStockColor = (product: VendorProduct) => {
        if (!product.track_quantity) return theme.colors.outline;
        if (product.quantity === 0) return '#F44336';
        if (product.quantity <= product.low_stock_threshold) return '#FF9800';
        return '#4CAF50';
    };

    const getStockLabel = (product: VendorProduct) => {
        if (!product.track_quantity) return 'Not tracked';
        if (product.quantity === 0) return 'Out of stock';
        if (product.quantity <= product.low_stock_threshold) return `Low: ${product.quantity}`;
        return `In stock: ${product.quantity}`;
    };

    return (
        <ScreenContainer>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text variant="titleLarge" style={styles.headerTitle}>Products</Text>
                    <Text variant="bodyMedium" style={styles.headerSubtitle}>
                        {filteredProducts.length} products
                    </Text>
                </View>

                {/* Search */}
                <Searchbar
                    placeholder="Search products..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                />

                {/* Filters */}
                <View style={styles.filterRow}>
                    <Chip
                        selected={statusFilter === 'all'}
                        onPress={() => setStatusFilter('all')}
                        style={styles.filterChip}
                    >
                        All
                    </Chip>
                    <Chip
                        selected={statusFilter === 'active'}
                        onPress={() => setStatusFilter('active')}
                        style={styles.filterChip}
                    >
                        Active
                    </Chip>
                    <Chip
                        selected={statusFilter === 'inactive'}
                        onPress={() => setStatusFilter('inactive')}
                        style={styles.filterChip}
                    >
                        Inactive
                    </Chip>
                    <Chip
                        selected={statusFilter === 'draft'}
                        onPress={() => setStatusFilter('draft')}
                        style={styles.filterChip}
                    >
                        Draft
                    </Chip>
                </View>

                {/* Product List */}
                <FlatList
                    data={filteredProducts}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item: product }) => (
                        <Card
                            style={styles.productCard}
                            onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
                        >
                            <Card.Content>
                                <View style={styles.productRow}>
                                    {product.images.length > 0 ? (
                                        <View style={styles.productImage}>
                                            <Text variant="bodySmall">📦</Text>
                                        </View>
                                    ) : (
                                        <View style={[styles.productImage, { backgroundColor: theme.colors.surfaceVariant }]}>
                                            <Text variant="bodySmall">No image</Text>
                                        </View>
                                    )}

                                    <View style={styles.productInfo}>
                                        <Text variant="titleMedium" numberOfLines={1}>
                                            {product.title}
                                        </Text>
                                        <Text variant="titleSmall" style={styles.productPrice}>
                                            {formatCurrency(product.price)}
                                        </Text>
                                        <View style={styles.productMeta}>
                                            <Text
                                                variant="bodySmall"
                                                style={[styles.stockText, { color: getStockColor(product) }]}
                                            >
                                                {getStockLabel(product)}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.productActions}>
                                        <Chip
                                            compact
                                            style={[
                                                styles.statusChip,
                                                {
                                                    backgroundColor: product.status === 'active'
                                                        ? '#4CAF50'
                                                        : product.status === 'draft'
                                                            ? theme.colors.surfaceVariant
                                                            : theme.colors.errorContainer
                                                }
                                            ]}
                                            textStyle={{
                                                color: product.status === 'active' ? '#FFF' : theme.colors.onSurface,
                                                fontSize: 11,
                                            }}
                                        >
                                            {product.status.toUpperCase()}
                                        </Chip>
                                        <IconButton
                                            icon="dots-vertical"
                                            size={20}
                                            onPress={() => navigation.navigate('ProductForm', {
                                                productId: product.id,
                                                mode: 'edit'
                                            })}
                                        />
                                    </View>
                                </View>
                            </Card.Content>
                        </Card>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text variant="bodyLarge" style={{ color: theme.colors.outline }}>
                                No products found
                            </Text>
                            <Text variant="bodyMedium" style={{ color: theme.colors.outline, marginTop: 8 }}>
                                {statusFilter !== 'all'
                                    ? 'Try changing the filter'
                                    : 'Create your first product to get started'}
                            </Text>
                        </View>
                    }
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />

                {/* FAB */}
                <FAB
                    icon="plus"
                    label="Add Product"
                    style={styles.fab}
                    onPress={() => navigation.navigate('ProductForm', { mode: 'create' })}
                />
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    headerTitle: {
        fontWeight: '700',
    },
    headerSubtitle: {
        marginTop: 4,
        opacity: 0.7,
    },
    searchBar: {
        marginHorizontal: 16,
        marginVertical: 8,
        elevation: 0,
    },
    filterRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 8,
    },
    filterChip: {
        borderRadius: 16,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },
    productCard: {
        marginBottom: 12,
    },
    productRow: {
        flexDirection: 'row',
        gap: 12,
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    productInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    productPrice: {
        fontWeight: '600',
        marginTop: 4,
    },
    productMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    stockText: {
        fontWeight: '500',
    },
    productActions: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusChip: {
        marginBottom: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    fab: {
        position: 'absolute',
        bottom: 16,
        right: 16,
    },
});
