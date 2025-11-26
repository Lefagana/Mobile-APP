import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button, IconButton, Surface, useTheme } from 'react-native-paper';
import { ScreenContainer } from '../../../components/common/ScreenContainer';
import { mockVendorStats, mockVendorOrders, mockVendorProducts } from '../../../services/mocks/vendorMockData';
import { formatCurrency } from '../../../utils/formatters';
import type { VendorStackParamList } from '../../../navigation/types';
import type { StackScreenProps } from '@react-navigation/stack';

type Props = StackScreenProps<VendorStackParamList, 'Dashboard'>;

export default function VendorDashboard({ navigation }: Props) {
    const theme = useTheme();

    // Get new orders that need action
    const newOrders = mockVendorOrders.filter(o => o.status === 'new');

    // Get low stock products
    const lowStockProducts = mockVendorProducts.filter(
        p => p.track_quantity && p.quantity <= p.low_stock_threshold
    );

    return (
        <ScreenContainer>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text variant="titleLarge" style={styles.headerTitle}>Dashboard</Text>
                        <Text variant="bodyMedium" style={styles.headerSubtitle}>LocalMart Pro</Text>
                    </View>
                    <IconButton
                        icon="bell-outline"
                        size={24}
                        onPress={() => { }}
                    />
                </View>

                {/* Big Action Button */}
                <Button
                    mode="contained"
                    icon="plus-circle"
                    onPress={() => navigation.navigate('ProductForm', { mode: 'create' })}
                    style={styles.bigActionButton}
                    contentStyle={styles.bigActionButtonContent}
                    labelStyle={styles.bigActionButtonLabel}
                >
                    Sell Your Product
                </Button>

                {/* Stats Overview */}
                <Text variant="titleMedium" style={styles.sectionTitle}>Today's Performance</Text>
                <View style={styles.statsGrid}>
                    <Card style={[styles.statCard, { backgroundColor: theme.colors.primaryContainer }]}>
                        <Card.Content>
                            <Text variant="labelMedium" style={styles.statLabel}>Sales</Text>
                            <Text variant="headlineSmall" style={styles.statValue}>
                                {formatCurrency(mockVendorStats.today_sales)}
                            </Text>
                            <Text variant="bodySmall" style={{ color: '#4CAF50' }}>+₦12,500 ↑</Text>
                        </Card.Content>
                    </Card>

                    <Card style={[styles.statCard, { backgroundColor: theme.colors.secondaryContainer }]}>
                        <Card.Content>
                            <Text variant="labelMedium" style={styles.statLabel}>Orders</Text>
                            <Text variant="headlineSmall" style={styles.statValue}>
                                {mockVendorStats.today_orders}
                            </Text>
                            <Text variant="bodySmall" style={{ color: '#4CAF50' }}>+3 today ↑</Text>
                        </Card.Content>
                    </Card>

                    <Card style={[styles.statCard, { backgroundColor: theme.colors.tertiaryContainer }]}>
                        <Card.Content>
                            <Text variant="labelMedium" style={styles.statLabel}>Rating</Text>
                            <Text variant="headlineSmall" style={styles.statValue}>
                                {mockVendorStats.average_rating} ⭐
                            </Text>
                            <Text variant="bodySmall">{mockVendorStats.fulfillment_rate}% fulfillment</Text>
                        </Card.Content>
                    </Card>

                    <Card style={styles.statCard}>
                        <Card.Content>
                            <Text variant="labelMedium" style={styles.statLabel}>Active Products</Text>
                            <Text variant="headlineSmall" style={styles.statValue}>
                                {mockVendorStats.active_products}
                            </Text>
                            <Text variant="bodySmall">of {mockVendorStats.total_products} total</Text>
                        </Card.Content>
                    </Card>

                    <Card style={styles.statCard}>
                        <Card.Content>
                            <Text variant="labelMedium" style={[styles.statLabel, { color: '#FF9800' }]}>
                                Low Stock
                            </Text>
                            <Text variant="headlineSmall" style={[styles.statValue, { color: '#FF9800' }]}>
                                {mockVendorStats.low_stock_products}
                            </Text>
                            <Text variant="bodySmall">need restock</Text>
                        </Card.Content>
                    </Card>

                    <Card style={styles.statCard}>
                        <Card.Content>
                            <Text variant="labelMedium" style={[styles.statLabel, { color: '#2196F3' }]}>
                                Pending Orders
                            </Text>
                            <Text variant="headlineSmall" style={[styles.statValue, { color: '#2196F3' }]}>
                                {mockVendorStats.pending_orders}
                            </Text>
                            <Text variant="bodySmall">need action</Text>
                        </Card.Content>
                    </Card>
                </View>

                {/* Recent Orders */}
                <View style={styles.sectionHeader}>
                    <Text variant="titleMedium">Recent Orders</Text>
                    <Button mode="text" onPress={() => navigation.navigate('Orders')}>
                        View All
                    </Button>
                </View>

                {newOrders.length > 0 ? (
                    newOrders.slice(0, 3).map((order) => (
                        <Card
                            key={order.id}
                            style={styles.orderCard}
                            onPress={() => navigation.navigate('OrderDetail', { orderId: order.id })}
                        >
                            <Card.Content>
                                <View style={styles.orderHeader}>
                                    <Text variant="titleSmall">{order.order_id}</Text>
                                    <Surface style={[styles.statusBadge, { backgroundColor: '#2196F3' }]}>
                                        <Text variant="labelSmall" style={{ color: '#FFF' }}>NEW</Text>
                                    </Surface>
                                </View>
                                <Text variant="bodyMedium" style={styles.orderCustomer}>
                                    {order.customer_name}
                                </Text>
                                <View style={styles.orderFooter}>
                                    <Text variant="labelMedium" style={{ fontWeight: '600' }}>
                                        {formatCurrency(order.total)}
                                    </Text>
                                    <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                                        {order.items.length} items
                                    </Text>
                                </View>
                            </Card.Content>
                        </Card>
                    ))
                ) : (
                    <Card style={styles.emptyCard}>
                        <Card.Content>
                            <Text variant="bodyMedium" style={{ textAlign: 'center', color: theme.colors.outline }}>
                                No new orders at the moment
                            </Text>
                        </Card.Content>
                    </Card>
                )}

                {/* Low Stock Alert */}
                {lowStockProducts.length > 0 && (
                    <>
                        <View style={styles.sectionHeader}>
                            <Text variant="titleMedium">Low Stock Alerts</Text>
                            <Button mode="text" onPress={() => navigation.navigate('Products')}>
                                View All
                            </Button>
                        </View>

                        {lowStockProducts.map((product) => (
                            <Card key={product.id} style={styles.alertCard}>
                                <Card.Content>
                                    <View style={styles.alertContent}>
                                        <IconButton icon="alert-circle" iconColor="#FF9800" size={24} />
                                        <View style={{ flex: 1 }}>
                                            <Text variant="titleSmall">{product.title}</Text>
                                            <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                                                Only {product.quantity} left in stock
                                            </Text>
                                        </View>
                                        <Button mode="text" onPress={() => navigation.navigate('Products')}>
                                            Restock
                                        </Button>
                                    </View>
                                </Card.Content>
                            </Card>
                        ))}
                    </>
                )}

                <View style={{ height: 80 }} />
            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    headerTitle: {
        fontWeight: '700',
    },
    headerSubtitle: {
        opacity: 0.7,
    },
    bigActionButton: {
        marginHorizontal: 16,
        marginVertical: 16,
        borderRadius: 12,
    },
    bigActionButtonContent: {
        paddingVertical: 8,
    },
    bigActionButtonLabel: {
        fontSize: 18,
        fontWeight: '600',
    },
    sectionTitle: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 12,
        fontWeight: '600',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 8,
        gap: 8,
    },
    statCard: {
        width: '48%',
        marginHorizontal: 4,
        marginBottom: 8,
    },
    statLabel: {
        opacity: 0.7,
        marginBottom: 4,
    },
    statValue: {
        fontWeight: '700',
        marginBottom: 4,
    },
    orderCard: {
        marginHorizontal: 16,
        marginBottom: 12,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    orderCustomer: {
        marginBottom: 8,
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    emptyCard: {
        marginHorizontal: 16,
        marginBottom: 12,
    },
    alertCard: {
        marginHorizontal: 16,
        marginBottom: 8,
    },
    alertContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
});
