import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, Card, useTheme } from 'react-native-paper';
import { ScreenContainer } from '../../../components/common/ScreenContainer';
import { useVendor } from '../../../contexts/VendorContext';
import type { VendorStackParamList } from '../../../navigation/types';
import type { StackScreenProps } from '@react-navigation/stack';

type Props = StackScreenProps<VendorStackParamList, 'BankSettings'>;

export default function BankSettings({ navigation }: Props) {
    const theme = useTheme();
    const { vendor, updateVendorProfile } = useVendor();
    const [loading, setLoading] = useState(false);

    const [bankName, setBankName] = useState(vendor?.bank_account?.bank_name || '');
    const [accountNumber, setAccountNumber] = useState(vendor?.bank_account?.account_number || '');
    const [accountName, setAccountName] = useState(vendor?.bank_account?.account_name || '');

    if (!vendor) return null;

    const handleSave = async () => {
        if (!bankName || !accountNumber || !accountName) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await updateVendorProfile({
                bank_account: {
                    bank_name: bankName,
                    account_number: accountNumber,
                    account_name: accountName,
                    bank_code: '000', // Mock code
                    account_type: 'current',
                    verified: true
                }
            });
            Alert.alert('Success', 'Bank details updated successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to update bank details');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenContainer>
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="bodyMedium" style={{ marginBottom: 16 }}>
                            Enter your bank account details to receive payouts. The account name must match your registered business name.
                        </Text>

                        <TextInput
                            label="Bank Name"
                            value={bankName}
                            onChangeText={setBankName}
                            mode="outlined"
                            style={styles.input}
                        />

                        <TextInput
                            label="Account Number"
                            value={accountNumber}
                            onChangeText={setAccountNumber}
                            mode="outlined"
                            keyboardType="numeric"
                            maxLength={10}
                            style={styles.input}
                        />

                        <TextInput
                            label="Account Name"
                            value={accountName}
                            onChangeText={setAccountName}
                            mode="outlined"
                            style={styles.input}
                        />

                        <Button
                            mode="contained"
                            onPress={handleSave}
                            loading={loading}
                            disabled={loading}
                            style={styles.saveBtn}
                        >
                            Save Bank Details
                        </Button>
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
    },
    card: {
        backgroundColor: '#fff',
    },
    input: {
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    saveBtn: {
        marginTop: 8,
    },
});
