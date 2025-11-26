import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Card, Chip, useTheme, Divider } from 'react-native-paper';
import { ScreenContainer } from '../../../components/common/ScreenContainer';
import { useVendorWallet } from '../../../contexts/VendorWalletContext';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import type { VendorStackParamList } from '../../../navigation/types';
import type { StackScreenProps } from '@react-navigation/stack';

type Props = StackScreenProps<VendorStackParamList, 'TransactionHistory'>;

export default function TransactionHistory({ navigation }: Props) {
    const theme = useTheme();
    const { transactions } = useVendorWallet();

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case 'order_payment': return 'arrow-down-circle';
            case 'payout': return 'arrow-up-circle';
            case 'refund': return 'alert-circle';
            default: return 'circle';
        }
    };

    const getTransactionColor = (type: string, amount: number) => {
        if (amount > 0) return '#4CAF50';
        return '#F44336';
    };

    return (
        <ScreenContainer>
            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <Card style={styles.card} mode="outlined">
                        <Card.Content style={styles.cardContent}>
                            <View style={styles.leftCol}>
                                <Text variant="titleMedium" style={styles.type}>
                                    {item.type.replace(/_/g, ' ').toUpperCase()}
                                </Text>
                                <Text variant="bodySmall" style={styles.date}>
                                    {formatDate(item.created_at)}
                                </Text>
                                <Text variant="bodySmall" style={styles.desc} numberOfLines={1}>
                                    {item.description}
                                </Text>
                            </View>
                            <View style={styles.rightCol}>
                                <Text
                                    variant="titleMedium"
                                    style={{
                                        color: getTransactionColor(item.type, item.amount),
                                        fontWeight: '700'
                                    }}
                                >
                                    {item.amount > 0 ? '+' : ''}{formatCurrency(item.amount)}
                                </Text>
                                <Chip
                                    compact
                                    style={styles.statusChip}
                                    textStyle={{ fontSize: 10 }}
                                >
                                    {item.status}
                                </Chip>
                            </View>
                        </Card.Content>
                    </Card>
                )}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text>No transactions found</Text>
                    </View>
                }
            />
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    list: {
        padding: 16,
    },
    card: {
        marginBottom: 12,
        backgroundColor: '#fff',
        borderColor: '#EEEEEE',
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    leftCol: {
        flex: 1,
        marginRight: 16,
    },
    rightCol: {
        alignItems: 'flex-end',
    },
    type: {
        fontWeight: '600',
        marginBottom: 2,
    },
    date: {
        opacity: 0.6,
        marginBottom: 4,
    },
    desc: {
        opacity: 0.8,
    },
    statusChip: {
        marginTop: 4,
        height: 24,
    },
    empty: {
        padding: 32,
        alignItems: 'center',
    },
});
