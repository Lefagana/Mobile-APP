import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Card, Chip, useTheme, SegmentedButtons } from 'react-native-paper';
import { ScreenContainer } from '../../../components/common/ScreenContainer';
import { useVendor } from '../../../contexts/VendorContext';
import { formatCurrency } from '../../../utils/formatters';
import type { VendorStackParamList } from '../../../navigation/types';
import type { StackScreenProps } from '@react-navigation/stack';
import type { VendorOrder } from '../../../types/vendor';

type Props = StackScreenProps<VendorStackParamList, 'Orders'>;

type OrderStatus = 'new' | 'active' | 'completed' | 'cancelled';

export default function OrderList({ navigation }: Props) {
    const theme = useTheme();
    const { orders } = useVendor();
    const [selectedTab, setSelectedTab] = React.useState<OrderStatus>('new');

    const filteredOrders = orders.filter(order => {
        if (selectedTab === 'new') return order.status === 'new';
        if (selectedTab === 'active') return ['accepted', 'preparing', 'ready_for_pickup', 'out_for_delivery'].includes(order.status);
        if (selectedTab === 'completed') return ['delivered', 'completed'].includes(order.status);
        if (selectedTab === 'cancelled') return order.status === 'cancelled';
        return true;
    });

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'new': return '#2196F3';
            case 'accepted': return '#FF9800';
            case 'preparing': return '#FF9800';
            case 'ready_for_pickup': return '#4CAF50';
            case 'out_for_delivery': return '#4CAF50';
            case 'delivered': return '#9E9E9E';
            case 'completed': return '#9E9E9E';
            case 'cancelled': return '#F44336';
            default: return theme.colors.primary;
        }
    };

    const getStatusLabel = (status: string) => {
        return status.replace(/_/g, ' ').toUpperCase();
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${Math.floor(diffHours / 24)}d ago`;
    };

    return (
        <ScreenContainer scrollable={false}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text variant="titleLarge" style={styles.headerTitle}>Orders</Text>
                </View>

                <SegmentedButtons
                    value={selectedTab}
                    onValueChange={(value) => setSelectedTab(value as OrderStatus)}
                    buttons={[
                        { value: 'new', label: 'New' },
                        { value: 'active', label: 'Active' },
                        { value: 'completed', label: 'Completed' },
                        { value: 'cancelled', label: 'Cancelled' },
                    ]}
                    style={styles.segmentedButtons}
                />

                <FlatList
                    data={filteredOrders}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item: order }) => (
                        <Card
                            style={styles.orderCard}
                            onPress={() => navigation.navigate('OrderDetail', { orderId: order.id })}
                        >
                            <Card.Content>
                                <View style={styles.orderHeader}>
                                    <Text variant="titleMedium">{order.order_id}</Text>
                                    <Chip
                                        compact
                                        style={[styles.statusChip, { backgroundColor: getStatusBadgeColor(order.status) }]}
                                        textStyle={{ color: '#FFF', fontSize: 11 }}
                                    >
                                        {getStatusLabel(order.status)}
                                    </Chip>
                                </View>

                                <Text variant="bodyMedium" style={styles.customerName}>
                                    {order.customer_name}
                                </Text>

                                <View style={styles.orderDetails}>
                                    <Text variant="bodySmall" style={styles.itemCount}>
                                        {order.items.length} items
                                    </Text>
                                    <Text variant="bodySmall" style={styles.timeAgo}>
                                        {formatTime(order.created_at)}
                                    </Text>
                                </View>

                                <View style={styles.orderFooter}>
                                    <View>
                                        <Text variant="labelSmall" style={styles.earningLabel}>
                                            Your Earning
                                        </Text>
                                        <Text variant="titleMedium" style={styles.earningAmount}>
                                            {formatCurrency(order.vendor_earning)}
                                        </Text>
                                    </View>
                                    <Text variant="bodyMedium" style={styles.totalAmount}>
                                        Total: {formatCurrency(order.total)}
                                    </Text>
                                </View>
                            </Card.Content>
                        </Card>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text variant="bodyLarge" style={{ color: theme.colors.outline }}>
                                No {selectedTab} orders
                            </Text>
                        </View>
                    }
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
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
        paddingBottom: 12,
    },
    headerTitle: {
        fontWeight: '700',
    },
    segmentedButtons: {
        marginHorizontal: 16,
        marginBottom: 16,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    orderCard: {
        marginBottom: 12,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    statusChip: {
        borderRadius: 4,
    },
    customerName: {
        marginBottom: 4,
        fontWeight: '500',
    },
    orderDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    itemCount: {
        opacity: 0.7,
    },
    timeAgo: {
        opacity: 0.7,
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    earningLabel: {
        opacity: 0.7,
        marginBottom: 2,
    },
    earningAmount: {
        fontWeight: '700',
        color: '#4CAF50',
    },
    totalAmount: {
        opacity: 0.8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
});
