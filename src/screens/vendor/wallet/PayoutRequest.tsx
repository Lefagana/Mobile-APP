import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, HelperText, useTheme, Card } from 'react-native-paper';
import { ScreenContainer } from '../../../components/common/ScreenContainer';
import { useVendorWallet } from '../../../contexts/VendorWalletContext';
import { formatCurrency } from '../../../utils/formatters';
import type { VendorStackParamList } from '../../../navigation/types';
import type { StackScreenProps } from '@react-navigation/stack';

type Props = StackScreenProps<VendorStackParamList, 'PayoutRequest'>;

export default function PayoutRequest({ navigation }: Props) {
    const theme = useTheme();
    const { wallet, requestPayout } = useVendorWallet();
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const maxAmount = wallet?.balance || 0;

    const handleRequest = async () => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            setError('Please enter a valid amount');
            return;
        }
        if (numAmount > maxAmount) {
            setError('Insufficient balance');
            return;
        }
        if (numAmount < 1000) {
            setError('Minimum withdrawal is ₦1,000');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Mock bank details - in real app, select from saved banks
            const bankDetails = {
                bank_name: 'Access Bank',
                account_number: '0123456789',
                account_name: 'LocalMart Pro Store'
            };

            await requestPayout(numAmount, bankDetails);
            Alert.alert(
                'Success',
                'Payout request submitted successfully',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to request payout');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenContainer>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.content}>
                    <Card style={styles.balanceCard}>
                        <Card.Content>
                            <Text variant="titleMedium" style={{ opacity: 0.7 }}>Available Balance</Text>
                            <Text variant="displaySmall" style={{ fontWeight: '700', color: theme.colors.primary }}>
                                {formatCurrency(maxAmount)}
                            </Text>
                        </Card.Content>
                    </Card>

                    <View style={styles.form}>
                        <Text variant="titleMedium" style={{ marginBottom: 16 }}>Request Withdrawal</Text>

                        <TextInput
                            label="Amount (₦)"
                            value={amount}
                            onChangeText={(text) => {
                                setAmount(text);
                                setError('');
                            }}
                            keyboardType="numeric"
                            mode="outlined"
                            left={<TextInput.Affix text="₦" />}
                            error={!!error}
                        />
                        <HelperText type="error" visible={!!error}>
                            {error}
                        </HelperText>

                        <Text variant="bodySmall" style={{ marginTop: 8, marginBottom: 24, opacity: 0.6 }}>
                            Minimum withdrawal: ₦1,000. A 0.2% processing fee applies.
                        </Text>

                        <Card style={styles.bankCard} mode="outlined">
                            <Card.Content style={styles.bankContent}>
                                <View>
                                    <Text variant="bodyMedium" style={{ fontWeight: '700' }}>Access Bank</Text>
                                    <Text variant="bodySmall">0123456789</Text>
                                </View>
                                <Button mode="text" compact>Change</Button>
                            </Card.Content>
                        </Card>

                        <Button
                            mode="contained"
                            onPress={handleRequest}
                            loading={loading}
                            disabled={loading || !amount}
                            style={styles.submitBtn}
                            contentStyle={{ height: 48 }}
                        >
                            Request Payout
                        </Button>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 16,
        flex: 1,
    },
    balanceCard: {
        marginBottom: 24,
        backgroundColor: '#E3F2FD',
    },
    form: {
        flex: 1,
    },
    bankCard: {
        marginBottom: 24,
        borderColor: '#E0E0E0',
    },
    bankContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    submitBtn: {
        marginTop: 'auto',
        marginBottom: 16,
    },
});
