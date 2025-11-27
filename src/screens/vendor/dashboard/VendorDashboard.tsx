import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Image, useWindowDimensions } from 'react-native';
import { Text, Card, Button, IconButton, Surface, useTheme, Avatar, Badge, SegmentedButtons, Searchbar, ActivityIndicator } from 'react-native-paper';
import { ScreenContainer } from '../../../components/common/ScreenContainer';
import { ErrorBoundary } from '../../../components/common/ErrorBoundary';
import { mockVendorStats, mockVendorOrders, mockVendorProducts } from '../../../services/mocks/vendorMockData';
import { formatCurrency } from '../../../utils/formatters';
import type { VendorStackParamList } from '../../../navigation/types';
import type { StackScreenProps, StackNavigationProp } from '@react-navigation/stack';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { QuickAction } from '../../../components/vendor/QuickAction';
import { StatCard } from '../../../components/vendor/StatCard';
import { ProductGridItem } from '../../../components/vendor/ProductGridItem';
import { api } from '../../../services/api';
import { Product } from '../../../types';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../contexts/AuthContext';

type Props = StackScreenProps<VendorStackParamList, 'Dashboard'>;

export default function VendorDashboard({ navigation }: Props) {
    const theme = useTheme();
    const { width } = useWindowDimensions();
    const { user, isAuthenticated } = useAuth();
    const [activeTab, setActiveTab] = useState('orders');
    const [marketplaceSearch, setMarketplaceSearch] = useState('');
    const [marketplaceView, setMarketplaceView] = useState<'grid' | 'list'>('grid');
    const [marketplaceProducts, setMarketplaceProducts] = useState<Product[]>([]);
    const [isLoadingMarketplace, setIsLoadingMarketplace] = useState(true);
    const stackNavigation = navigation.getParent<StackNavigationProp<VendorStackParamList>>();

    const navigateToStack = <T extends keyof VendorStackParamList>(
        screen: T,
        params?: VendorStackParamList[T]
    ) => {
        if (stackNavigation) {
            stackNavigation.navigate(screen, params as any);
        }
    };

    // Fetch unread notification count
    const { data: unreadCount = 0 } = useQuery({
        queryKey: ['notifications', 'unreadCount', user?.id],
        queryFn: () => api.notifications.getUnreadCount(user!.id),
        enabled: isAuthenticated && !!user?.id,
        refetchInterval: 30000, // Refetch every 30 seconds
    });

    const notificationCount = unreadCount || 0;

    // Responsive grid
    const numColumns = width > 600 ? 3 : 2;
    const cardWidth = (width - 32 - (numColumns - 1) * 12) / numColumns;

    // Fetch marketplace products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.products.list({ page: 1 });
                setMarketplaceProducts(response.items);
            } catch (error) {
                console.error('Failed to fetch marketplace products:', error);
            } finally {
                setIsLoadingMarketplace(false);
            }
        };

        fetchProducts();
    }, []);

    // Get new orders that need action
    const newOrders = mockVendorOrders.filter(o => o.status === 'new');

    // Handle notification press
    const handleNotificationPress = () => {
        navigateToStack('NotificationList');
    };

    // Get low stock products
    const lowStockProducts = mockVendorProducts.filter(
        p => p.track_quantity && p.quantity <= p.low_stock_threshold
    );

    const renderOrdersList = () => (
        <View>
            {newOrders.length > 0 ? (
                newOrders.slice(0, 2).map((order) => (
                    <Surface
                        key={order.id}
                        style={styles.orderCard}
                        elevation={1}
                        onTouchEnd={() => navigateToStack('OrderDetail', { orderId: order.id })}
                        accessibilityRole="button"
                        accessibilityLabel={`Order ${order.order_id} from ${order.customer_name}, total ${formatCurrency(order.total)}`}
                    >
                        <View style={styles.orderCardHeader}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialCommunityIcons name="shopping-outline" size={20} color="#555" />
                                <Text variant="titleSmall" style={{ marginLeft: 8, fontWeight: '600' }}>{order.order_id}</Text>
                            </View>
                            <Badge style={{ backgroundColor: '#E3F2FD', color: '#2196F3', fontWeight: 'bold' }} size={24}>NEW</Badge>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.orderCardBody}>
                            <View>
                                <Text variant="bodyMedium" style={{ fontWeight: '500' }}>{order.customer_name}</Text>
                                <Text variant="bodySmall" style={{ color: '#777' }}>{order.items.length} items • {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                                    {formatCurrency(order.total)}
                                </Text>
                            </View>
                        </View>
                    </Surface>
                ))
            ) : (
                <Surface style={styles.emptyState} elevation={0}>
                    <MaterialCommunityIcons name="clipboard-check-outline" size={48} color="#CCC" />
                    <Text style={{ color: '#999', marginTop: 8 }}>No new orders</Text>
                </Surface>
            )}
            <Button mode="text" compact onPress={() => navigation.navigate('Orders')} style={{ marginTop: 4 }}>
                View All Orders
            </Button>
        </View>
    );

    const renderAlertsList = () => (
        <View>
            {lowStockProducts.length > 0 ? (
                lowStockProducts.slice(0, 2).map((product) => (
                    <Surface key={product.id} style={styles.alertCard} elevation={1}>
                        <View style={styles.alertLeft}>
                            <View style={styles.productImagePlaceholder}>
                                <MaterialCommunityIcons name="image-outline" size={20} color="#999" />
                            </View>
                            <View>
                                <Text variant="titleSmall" style={{ fontWeight: '600' }}>{product.title}</Text>
                                <Text variant="bodySmall" style={{ color: '#F44336', fontWeight: '500' }}>
                                    Only {product.quantity} left
                                </Text>
                            </View>
                        </View>
                        <Button
                            mode="contained-tonal"
                            compact
                            onPress={() => navigateToStack('ProductForm', { mode: 'edit', productId: product.id })}
                            labelStyle={{ fontSize: 12 }}
                        >
                            Restock
                        </Button>
                    </Surface>
                ))
            ) : (
                <Surface style={styles.emptyState} elevation={0}>
                    <MaterialCommunityIcons name="check-circle-outline" size={48} color="#4CAF50" />
                    <Text style={{ color: '#999', marginTop: 8 }}>Inventory looks good!</Text>
                </Surface>
            )}
            <Button mode="text" compact onPress={() => navigation.navigate('Products')} style={{ marginTop: 4 }}>
                View All Products
            </Button>
        </View>
    );

    return (
        <ScreenContainer style={{ backgroundColor: '#F5F7FA' }} scrollable={false} withBottomPadding={false}>
            <ErrorBoundary>
                <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                    {/* Header Section */}
                    <Surface style={styles.header} elevation={0}>
                        <View style={styles.headerTop}>
                            <View style={styles.shopInfo}>
                                <Avatar.Text size={36} label="LM" style={{ backgroundColor: theme.colors.primary }} />
                                <View style={{ marginLeft: 10 }}>
                                    <Text variant="titleMedium" style={{ fontWeight: 'bold', fontSize: 16 }}>LocalMart Pro</Text>
                                    <View style={styles.ratingContainer}>
                                        <MaterialCommunityIcons name="star" size={14} color="#FFC107" />
                                        <Text variant="labelSmall" style={{ marginLeft: 4 }}>4.8 (150 reviews)</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ position: 'relative' }}>
                                <IconButton
                                    icon="bell-outline"
                                    mode="contained-tonal"
                                    size={22}
                                    onPress={handleNotificationPress}
                                    accessibilityLabel={
                                        notificationCount > 0
                                            ? `Notifications, ${notificationCount} new`
                                            : 'Notifications, no new notifications'
                                    }
                                />
                                {notificationCount > 0 && (
                                    <Badge
                                        size={16}
                                        style={{
                                            position: 'absolute',
                                            top: 4,
                                            right: 4,
                                            backgroundColor: theme.colors.error,
                                        }}
                                    >
                                        {notificationCount > 99 ? '99+' : notificationCount}
                                    </Badge>
                                )}
                            </View>
                        </View>

                        {/* Quick Actions - Compact */}
                        <View style={styles.quickActionsRow}>
                            <QuickAction
                                icon="plus"
                                label="Add Product"
                                color={theme.colors.primary}
                                onPress={() => navigateToStack('ProductForm', { mode: 'create' })}
                            />
                            <QuickAction
                                icon="message-text-outline"
                                label="Message"
                                color="#2196F3"
                                onPress={() => navigateToStack('ChatList')}
                                badge={2}
                            />
                            <QuickAction
                                icon="chart-box-outline"
                                label="Analytics"
                                color="#9C27B0"
                                onPress={() => navigateToStack('AnalyticsSummary')}
                            />
                        </View>
                    </Surface>

                    {/* Stats Horizontal Scroll - Compact */}
                    <View style={styles.section}>
                        <Text variant="titleMedium" style={styles.sectionTitle}>Overview</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsScroll}>
                            <StatCard
                                label="Total Sales"
                                value={formatCurrency(mockVendorStats.today_sales)}
                                subtext="+₦12.5k today"
                                icon="cash"
                                color="#4CAF50"
                                trend="12%"
                                trendType="positive"
                            />
                            <StatCard
                                label="Active Orders"
                                value={mockVendorStats.pending_orders}
                                subtext="Needs attention"
                                icon="clipboard-clock"
                                color="#FF9800"
                            />
                            <StatCard
                                label="Total Products"
                                value={mockVendorStats.active_products}
                                subtext={`${mockVendorStats.total_products} listed`}
                                icon="tag-outline"
                                color="#2196F3"
                            />
                            <StatCard
                                label="Rating"
                                value={mockVendorStats.average_rating}
                                subtext="Top rated"
                                icon="star"
                                color="#FFC107"
                            />
                        </ScrollView>
                    </View>

                    {/* Merged Activity Section - Compact */}
                    <View style={styles.section}>
                        <View style={styles.mergedHeader}>
                            <SegmentedButtons
                                value={activeTab}
                                onValueChange={setActiveTab}
                                buttons={[
                                    {
                                        value: 'orders',
                                        label: `Orders (${newOrders.length})`,
                                        icon: 'shopping-outline',
                                    },
                                    {
                                        value: 'alerts',
                                        label: `Alerts (${lowStockProducts.length})`,
                                        icon: 'alert-circle-outline',
                                    },
                                ]}
                                style={styles.segmentedButton}
                                density="small"
                            />
                        </View>
                        <View style={styles.mergedContent}>
                            {activeTab === 'orders' ? renderOrdersList() : renderAlertsList()}
                        </View>
                    </View>

                    {/* Main Marketplace Section */}
                    <View style={styles.marketplaceSection}>
                        <View style={styles.marketplaceHeader}>
                            <Text variant="titleLarge" style={styles.marketplaceTitle}>📦 Main Marketplace</Text>
                            <View style={styles.marketplaceControls}>
                                <Searchbar
                                    placeholder="Search..."
                                    onChangeText={setMarketplaceSearch}
                                    value={marketplaceSearch}
                                    style={styles.marketplaceSearch}
                                    inputStyle={{ minHeight: 0 }}
                                    onFocus={() => navigateToStack('MarketplaceBrowser')}
                                />
                                <View style={styles.viewToggle}>
                                    <IconButton
                                        icon="view-grid"
                                        selected={marketplaceView === 'grid'}
                                        onPress={() => setMarketplaceView('grid')}
                                        size={20}
                                    />
                                    <IconButton
                                        icon="view-list"
                                        selected={marketplaceView === 'list'}
                                        onPress={() => setMarketplaceView('list')}
                                        size={20}
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={styles.productsGrid}>
                            {isLoadingMarketplace ? (
                                <View style={{ width: '100%', padding: 20, alignItems: 'center' }}>
                                    <ActivityIndicator size="small" />
                                </View>
                            ) : (
                                marketplaceProducts.slice(0, 4).map((product) => (
                                    <ProductGridItem
                                        key={product.id}
                                        product={product}
                                        onPress={() => navigateToStack('CustomerProductDetail', { productId: product.id })}
                                        onBuy={() => navigateToStack('CustomerProductDetail', { productId: product.id })}
                                        width={cardWidth}
                                    />
                                ))
                            )}
                        </View>

                        <Button
                            mode="outlined"
                            onPress={() => navigateToStack('MarketplaceBrowser')}
                            style={{ marginTop: 12 }}
                        >
                            Browse All Products
                        </Button>
                    </View>

                    <View style={{ height: 32 }} />
                </ScrollView>
            </ErrorBoundary>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: '#FFF',
        paddingTop: 12,
        paddingBottom: 16,
        paddingHorizontal: 16,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginBottom: 12,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    shopInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    quickActionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    section: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontWeight: '700',
        fontSize: 16,
        marginLeft: 16,
        marginBottom: 8,
    },
    statsScroll: {
        paddingHorizontal: 16,
        paddingBottom: 4,
    },
    mergedHeader: {
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    segmentedButton: {
        backgroundColor: '#FFF',
    },
    mergedContent: {
        paddingHorizontal: 0,
    },
    alertCard: {
        backgroundColor: '#FFF',
        marginHorizontal: 16,
        marginBottom: 8,
        borderRadius: 12,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderLeftWidth: 4,
        borderLeftColor: '#F44336',
    },
    alertLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    productImagePlaceholder: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    orderCard: {
        backgroundColor: '#FFF',
        marginHorizontal: 16,
        marginBottom: 8,
        borderRadius: 12,
        padding: 12,
    },
    orderCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginBottom: 8,
    },
    orderCardBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    emptyState: {
        backgroundColor: '#FFF',
        marginHorizontal: 16,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    marketplaceSection: {
        backgroundColor: '#FFF',
        marginTop: 4,
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    marketplaceHeader: {
        marginBottom: 12,
    },
    marketplaceTitle: {
        fontWeight: 'bold',
        marginBottom: 8,
        fontSize: 18,
    },
    marketplaceControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    marketplaceSearch: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        height: 36,
        elevation: 0,
    },
    viewToggle: {
        flexDirection: 'row',
        backgroundColor: '#F5F5F5',
        borderRadius: 18,
    },
    productsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
});
