import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Card, Button, Chip, Divider, useTheme, ActivityIndicator } from 'react-native-paper';
import { ScreenContainer } from '../../../components/common/ScreenContainer';
import { useVendor } from '../../../contexts/VendorContext';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import type { VendorStackParamList } from '../../../navigation/types';
import type { StackScreenProps } from '@react-navigation/stack';

type Props = StackScreenProps<VendorStackParamList, 'OrderDetail'>;

export default function OrderDetail({ route, navigation }: Props) {
    const theme = useTheme();
    const { orderId } = route.params;
    const { orders, updateOrderStatus } = useVendor();
    const [loading, setLoading] = useState(false);

    const order = orders.find(o => o.id === orderId);

    if (!order) {
        return (
            <ScreenContainer>
                <View style={styles.emptyContainer}>
                    <Text variant="titleMedium">Order not found</Text>
                    <Button onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
                        Go Back
                    </Button>
                </View>
            </ScreenContainer>
        );
    }

    const handleStatusUpdate = async (newStatus: typeof order.status) => {
        setLoading(true);
        try {
            await updateOrderStatus(order.id, newStatus);
            Alert.alert('Success', `Order status updated to ${newStatus.replace(/_/g, ' ')}`);
        } catch (error) {
            Alert.alert('Error', 'Failed to update order status');
        } finally {
            setLoading(false);
        }
    };

    const confirmAction = (action: string, status: typeof order.status) => {
        Alert.alert(
            `Confirm ${action}`,
            `Are you sure you want to mark this order as ${status.replace(/_/g, ' ')}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Confirm', onPress: () => handleStatusUpdate(status) }
            ]
        );
    };

    const renderActionButtons = () => {
        switch (order.status) {
            case 'new':
                return (
                    <View style={styles.actionRow}>
                        <Button
                            mode="contained"
                            style={[styles.actionBtn, { flex: 1, marginRight: 8 }]}
                            onPress={() => confirmAction('Accept', 'accepted')}
                            loading={loading}
                            disabled={loading}
                        >
                            Accept Order
                        </Button>
                        <Button
                            mode="outlined"
                            textColor={theme.colors.error}
                            style={[styles.actionBtn, { flex: 1, marginLeft: 8, borderColor: theme.colors.error }]}
                            onPress={() => confirmAction('Decline', 'cancelled')}
                            loading={loading}
                            disabled={loading}
                        >
                            Decline
                        </Button>
                    </View>
                );
            case 'accepted':
                return (
                    <Button
                        mode="contained"
                        style={styles.actionBtn}
                        onPress={() => confirmAction('Start Preparing', 'preparing')}
                        loading={loading}
                        disabled={loading}
                    >
                        Start Preparing
                    </Button>
                );
            case 'preparing':
                return (
                    <Button
                        mode="contained"
                        style={styles.actionBtn}
                        onPress={() => confirmAction('Mark Ready', 'ready_for_pickup')}
                        loading={loading}
                        disabled={loading}
                    >
                        Ready for Pickup
                    </Button>
                );
            case 'ready_for_pickup':
                return (
                    <View style={styles.infoBox}>
                        <Text variant="bodyMedium" style={{ textAlign: 'center', color: theme.colors.primary }}>
                            Waiting for rider to pick up
                        </Text>
                    </View>
                );
            default:
                return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return theme.colors.primary;
            case 'accepted': return '#2196F3';
            case 'preparing': return '#FF9800';
            case 'ready_for_pickup': return '#4CAF50';
            case 'completed': return '#4CAF50';
            case 'cancelled': return theme.colors.error;
            default: return theme.colors.outline;
        }
    };

    return (
        <ScreenContainer>
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <View>
                        <Text variant="titleMedium">Order #{order.order_id}</Text>
                        <Text variant="bodySmall" style={{ opacity: 0.6 }}>
                            {formatDate(order.created_at)}
                        </Text>
                    </View>
                    <Chip
                        style={{ backgroundColor: getStatusColor(order.status) + '20' }}
                        textStyle={{ color: getStatusColor(order.status) }}
                    >
                        {order.status.toUpperCase().replace(/_/g, ' ')}
                    </Chip>
                </View>

                {/* Actions Section */}
                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.sectionTitle}>Order Actions</Text>
                        {renderActionButtons()}
                        {order.status === 'cancelled' && (
                            <Text style={{ color: theme.colors.error, marginTop: 8 }}>
                                This order has been cancelled.
                            </Text>
                        )}
                        {order.status === 'completed' && (
                            <Text style={{ color: '#4CAF50', marginTop: 8 }}>
                                This order has been completed.
                            </Text>
                        )}
                    </Card.Content>
                </Card>

                {/* Customer Info */}
                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.sectionTitle}>Customer</Text>
                        <View style={styles.row}>
                            <Text variant="bodyMedium" style={{ fontWeight: '700' }}>{order.customer_name}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text variant="bodyMedium">{order.customer_phone}</Text>
                            <Button mode="text" compact onPress={() => Alert.alert('Call', `Calling ${order.customer_phone}...`)}>
                                Call
                            </Button>
                        </View>
                        <Divider style={styles.divider} />
                        <Text variant="bodyMedium" style={{ fontWeight: '700', marginBottom: 4 }}>Delivery Address</Text>
                        <Text variant="bodyMedium">{order.delivery_address.text}</Text>
                        {order.delivery_address.landmark && (
                            <Text variant="bodySmall" style={{ opacity: 0.7, marginTop: 2 }}>
                                Landmark: {order.delivery_address.landmark}
                            </Text>
                        )}
                    </Card.Content>
                </Card>

                {/* Order Items */}
                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.sectionTitle}>Items ({order.items.length})</Text>
                        {order.items.map((item, index) => (
                            <View key={item.id}>
                                <View style={styles.itemRow}>
                                    <View style={styles.itemInfo}>
                                        <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                                            {item.quantity}x {item.product_name}
                                        </Text>
                                        {item.variant_label && (
                                            <Text variant="bodySmall" style={{ opacity: 0.7 }}>
                                                Variant: {item.variant_label}
                                            </Text>
                                        )}
                                    </View>
                                    <Text variant="bodyMedium">{formatCurrency(item.price * item.quantity)}</Text>
                                </View>
                                {index < order.items.length - 1 && <Divider style={styles.itemDivider} />}
                            </View>
                        ))}
                    </Card.Content>
                </Card>

                {/* Payment Summary */}
                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.sectionTitle}>Payment Summary</Text>
                        <View style={styles.summaryRow}>
                            <Text variant="bodyMedium">Subtotal</Text>
                            <Text variant="bodyMedium">{formatCurrency(order.subtotal)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text variant="bodyMedium">Delivery Fee</Text>
                            <Text variant="bodyMedium">{formatCurrency(order.delivery_fee)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text variant="bodyMedium">Platform Fee</Text>
                            <Text variant="bodyMedium">-{formatCurrency(order.platform_fee)}</Text>
                        </View>
                        <Divider style={styles.divider} />
                        <View style={styles.summaryRow}>
                            <Text variant="titleMedium">Your Earning</Text>
                            <Text variant="titleMedium" style={{ color: '#4CAF50' }}>
                                {formatCurrency(order.vendor_earning)}
                            </Text>
                        </View>
                    </Card.Content>
                </Card>
            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 16,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    card: {
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    sectionTitle: {
        fontWeight: '700',
        marginBottom: 12,
    },
    divider: {
        marginVertical: 12,
    },
    itemDivider: {
        marginVertical: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    itemInfo: {
        flex: 1,
        paddingRight: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    actionRow: {
        flexDirection: 'row',
        marginTop: 8,
    },
    actionBtn: {
        marginTop: 8,
    },
    infoBox: {
        padding: 12,
        backgroundColor: '#E3F2FD',
        borderRadius: 8,
        marginTop: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
