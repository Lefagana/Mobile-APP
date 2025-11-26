import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button, Divider, useTheme, IconButton } from 'react-native-paper';
import { ScreenContainer } from '../../../components/common/ScreenContainer';
import { useVendorWallet } from '../../../contexts/VendorWalletContext';
import { formatCurrency } from '../../../utils/formatters';
import type { VendorStackParamList } from '../../../navigation/types';
import type { StackScreenProps } from '@react-navigation/stack';

type Props = StackScreenProps<VendorStackParamList, 'Wallet'>;

export default function VendorWallet({ navigation }: Props) {
    const theme = useTheme();
    const { wallet, transactions, payouts } = useVendorWallet();

    if (!wallet) return null;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-NG', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case 'sale': return 'arrow-down-circle';
            case 'payout': return 'arrow-up-circle';
            case 'fee': return 'minus-circle';
            case 'refund': return 'undo-variant';
            default: return 'circle';
        }
    };

    const getTransactionColor = (type: string, amount: number) => {
        if (amount > 0) return '#4CAF50';
        if (type === 'payout') return '#2196F3';
        return '#F44336';
    };

    return (
        <ScreenContainer>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text variant="titleLarge" style={styles.headerTitle}>Wallet</Text>
                    <IconButton icon="bell-outline" size={24} onPress={() => { }} />
                </View>

                {/* Balance Card */}
                <Card style={[styles.balanceCard, { backgroundColor: theme.colors.primaryContainer }]}>
                    <Card.Content>
                        <Text variant="labelMedium" style={styles.balanceLabel}>
                            Available Balance
                        </Text>
                        <Text variant="displaySmall" style={styles.balanceAmount}>
                            {formatCurrency(wallet.balance)}
                        </Text>

                        <Divider style={styles.divider} />

                        <View style={styles.balanceDetails}>
                            <View>
                                <Text variant="bodySmall" style={styles.detailLabel}>Pending</Text>
                                <Text variant="titleMedium" style={styles.detailValue}>
                                    {formatCurrency(wallet.pending_balance)}
                                </Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text variant="bodySmall" style={styles.detailLabel}>Lifetime</Text>
                                <Text variant="titleMedium" style={styles.detailValue}>
                                    {formatCurrency(wallet.lifetime_earnings)}
                                </Text>
                            </View>
                        </View>

                        <Button
                            mode="contained"
                            onPress={() => navigation.navigate('PayoutRequest')}
                            style={styles.payoutButton}
                            contentStyle={{ paddingVertical: 8 }}
                        >
                            Request Payout
                        </Button>
                    </Card.Content>
                </Card>

                {/* Quick Stats */}
                <View style={styles.quickStats}>
                    <Card style={styles.statCard} onPress={() => navigation.navigate('AnalyticsSummary')}>
                        <Card.Content>
                            <Text variant="labelSmall" style={styles.statLabel}>This Month</Text>
                            <Text variant="titleLarge" style={styles.statValue}>
                                ₦320.5K
                            </Text>
                            <Text variant="bodySmall" style={{ color: '#4CAF50' }}>+15.3% ↑</Text>
                        </Card.Content>
                    </Card>

                    <Card style={styles.statCard} onPress={() => navigation.navigate('PayoutHistory')}>
                        <Card.Content>
                            <Text variant="labelSmall" style={styles.statLabel}>Withdrawn</Text>
                            <Text variant="titleLarge" style={styles.statValue}>
                                {formatCurrency(wallet.total_withdrawn)}
                            </Text>
                            <Text variant="bodySmall">{payouts.length} payouts</Text>
                        </Card.Content>
                    </Card>
                </View>

                {/* Recent Transactions */}
                <View style={styles.sectionHeader}>
                    <Text variant="titleMedium">Recent Transactions</Text>
                    <Button mode="text" onPress={() => navigation.navigate('TransactionHistory')}>
                        View All
                    </Button>
                </View>

                {transactions.slice(0, 5).map((transaction) => (
                    <Card key={transaction.id} style={styles.transactionCard}>
                        <Card.Content>
                            <View style={styles.transactionRow}>
                                <View style={styles.transactionLeft}>
                                    <IconButton
                                        icon={getTransactionIcon(transaction.type)}
                                        iconColor={getTransactionColor(transaction.type, transaction.amount)}
                                        size={24}
                                        style={{ margin: 0 }}
                                    />
                                    <View style={{ flex: 1 }}>
                                        <Text variant="titleSmall" numberOfLines={1}>
                                            {transaction.description}
                                        </Text>
                                        <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                                            {formatDate(transaction.created_at)}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.transactionRight}>
                                    <Text
                                        variant="titleMedium"
                                        style={{
                                            color: getTransactionColor(transaction.type, transaction.amount),
                                            fontWeight: '600',
                                        }}
                                    >
                                        {transaction.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                                    </Text>
                                    <Text
                                        variant="bodySmall"
                                        style={{
                                            textAlign: 'right',
                                            color: transaction.status === 'completed' ? '#4CAF50' : '#FF9800',
                                        }}
                                    >
                                        {transaction.status}
                                    </Text>
                                </View>
                            </View>
                        </Card.Content>
                    </Card>
                ))}

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
    balanceCard: {
        marginHorizontal: 16,
        marginVertical: 12,
        elevation: 4,
    },
    balanceLabel: {
        opacity: 0.8,
        marginBottom: 8,
    },
    balanceAmount: {
        fontWeight: '700',
        marginBottom: 16,
    },
    divider: {
        marginVertical: 12,
    },
    balanceDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    detailLabel: {
        opacity: 0.7,
        marginBottom: 4,
    },
    detailValue: {
        fontWeight: '600',
    },
    payoutButton: {
        borderRadius: 8,
    },
    quickStats: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 12,
        marginBottom: 8,
    },
    statCard: {
        flex: 1,
    },
    statLabel: {
        opacity: 0.7,
        marginBottom: 4,
    },
    statValue: {
        fontWeight: '700',
        marginBottom: 4,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 12,
    },
    transactionCard: {
        marginHorizontal: 16,
        marginBottom: 8,
    },
    transactionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    transactionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 12,
    },
    transactionRight: {
        alignItems: 'flex-end',
    },
});
