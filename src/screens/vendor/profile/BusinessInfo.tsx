import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, List, Chip, useTheme, Divider, Button } from 'react-native-paper';
import { ScreenContainer } from '../../../components/common/ScreenContainer';
import { useVendor } from '../../../contexts/VendorContext';
import type { VendorStackParamList } from '../../../navigation/types';
import type { StackScreenProps } from '@react-navigation/stack';

type Props = StackScreenProps<VendorStackParamList, 'BusinessInfo'>;

export default function BusinessInfo({ navigation }: Props) {
    const theme = useTheme();
    const { vendor } = useVendor();

    if (!vendor) return null;

    const getKYCColor = (status: string) => {
        switch (status) {
            case 'approved': return '#4CAF50';
            case 'pending': return '#FF9800';
            case 'rejected': return '#F44336';
            default: return theme.colors.outline;
        }
    };

    return (
        <ScreenContainer>
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                <Card style={styles.card}>
                    <Card.Content>
                        <View style={styles.header}>
                            <Text variant="titleMedium">Verification Status</Text>
                            <Chip
                                style={{ backgroundColor: getKYCColor(vendor.kyc_status) + '20' }}
                                textStyle={{ color: getKYCColor(vendor.kyc_status) }}
                            >
                                {vendor.kyc_status.toUpperCase()}
                            </Chip>
                        </View>
                        <Text variant="bodyMedium" style={{ marginTop: 8, opacity: 0.7 }}>
                            Your business verification is {vendor.kyc_status}.
                            {vendor.kyc_status === 'approved'
                                ? ' You have full access to all vendor features.'
                                : ' Some features may be limited until verification is complete.'}
                        </Text>

                        {vendor.kyc_status !== 'approved' && (
                            <Button
                                mode="contained"
                                onPress={() => navigation.navigate('KYCUpload')}
                                style={{ marginTop: 16 }}
                            >
                                Upload Documents
                            </Button>
                        )}
                    </Card.Content>
                </Card>

                <Text variant="titleMedium" style={styles.sectionTitle}>Business Details</Text>

                <Card style={styles.card}>
                    <Card.Content>
                        <List.Item
                            title="Legal Business Name"
                            description={vendor.legal_business_name || 'Not provided'}
                            left={props => <List.Icon {...props} icon="domain" />}
                        />
                        <Divider />
                        <List.Item
                            title="Business Type"
                            description={vendor.business_type || 'Retail'}
                            left={props => <List.Icon {...props} icon="briefcase-outline" />}
                        />
                        <Divider />
                        <List.Item
                            title="Tax Identification Number"
                            description={vendor.tax_id || 'Not provided'}
                            left={props => <List.Icon {...props} icon="file-document-outline" />}
                        />
                        <Divider />
                        <List.Item
                            title="Registration Date"
                            description={new Date(vendor.created_at).toLocaleDateString()}
                            left={props => <List.Icon {...props} icon="calendar" />}
                        />
                    </Card.Content>
                </Card>

                <Text variant="titleMedium" style={styles.sectionTitle}>Registered Address</Text>
                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="bodyMedium">{vendor.address_text}</Text>
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
        marginBottom: 24,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 4,
    },
});
