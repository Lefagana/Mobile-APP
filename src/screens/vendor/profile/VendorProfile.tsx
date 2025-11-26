import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, List, Avatar, Divider, useTheme, Card } from 'react-native-paper';
import { ScreenContainer } from '../../../components/common/ScreenContainer';
import { useAuth } from '../../../contexts/AuthContext';
import { useVendor } from '../../../contexts/VendorContext';
import type { VendorStackParamList } from '../../../navigation/types';
import type { StackScreenProps } from '@react-navigation/stack';

type Props = StackScreenProps<VendorStackParamList, 'Profile'>;

export default function VendorProfile({ navigation }: Props) {
    const theme = useTheme();
    const { logout } = useAuth();
    const { vendor } = useVendor();

    if (!vendor) return null;

    const handleLogout = async () => {
        await logout();
    };

    return (
        <ScreenContainer>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Avatar.Text size={80} label={vendor.shop_name.substring(0, 2)} />
                    <Text variant="headlineSmall" style={styles.shopName}>
                        {vendor.shop_name}
                    </Text>
                    <Text variant="bodyMedium" style={styles.shopDescription}>
                        {vendor.description}
                    </Text>
                    <View style={styles.ratingContainer}>
                        <Text variant="titleMedium">
                            {vendor.rating} ⭐
                        </Text>
                        <Text variant="bodySmall" style={{ color: theme.colors.outline, marginLeft: 8 }}>
                            ({vendor.review_count} reviews)
                        </Text>
                    </View>
                </View>

                {/* Shop Management */}
                <Card style={styles.section}>
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.sectionTitle}>Shop Management</Text>

                        <List.Item
                            title="Shop Profile"
                            description="Edit shop details and branding"
                            left={(props) => <List.Icon {...props} icon="store" />}
                            right={(props) => <List.Icon {...props} icon="chevron-right" />}
                            onPress={() => navigation.navigate('ShopProfile')}
                        />
                        <Divider />
                        <List.Item
                            title="Business Information"
                            description="Legal details and KYC status"
                            left={(props) => <List.Icon {...props} icon="briefcase" />}
                            right={(props) => <List.Icon {...props} icon="chevron-right" />}
                            onPress={() => navigation.navigate('BusinessInfo')}
                        />
                        <Divider />
                        <List.Item
                            title="Bank Settings"
                            description="Manage payout accounts"
                            left={(props) => <List.Icon {...props} icon="bank" />}
                            right={(props) => <List.Icon {...props} icon="chevron-right" />}
                            onPress={() => navigation.navigate('BankSettings')}
                        />
                    </Card.Content>
                </Card>

                {/* App Settings */}
                <Card style={styles.section}>
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.sectionTitle}>App Settings</Text>

                        <List.Item
                            title="Settings"
                            description="Language, notifications, preferences"
                            left={(props) => <List.Icon {...props} icon="cog" />}
                            right={(props) => <List.Icon {...props} icon="chevron-right" />}
                            onPress={() => navigation.navigate('VendorSettings')}
                        />
                    </Card.Content>
                </Card>

                {/* Support & Legal */}
                <Card style={styles.section}>
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.sectionTitle}>Support & Legal</Text>

                        <List.Item
                            title="Help Center"
                            description="FAQs and support"
                            left={(props) => <List.Icon {...props} icon="help-circle" />}
                            right={(props) => <List.Icon {...props} icon="chevron-right" />}
                            onPress={() => { }}
                        />
                        <Divider />
                        <List.Item
                            title="Terms of Service"
                            left={(props) => <List.Icon {...props} icon="file-document" />}
                            right={(props) => <List.Icon {...props} icon="chevron-right" />}
                            onPress={() => { }}
                        />
                        <Divider />
                        <List.Item
                            title="Privacy Policy"
                            left={(props) => <List.Icon {...props} icon="shield-check" />}
                            right={(props) => <List.Icon {...props} icon="chevron-right" />}
                            onPress={() => { }}
                        />
                    </Card.Content>
                </Card>

                {/* Logout */}
                <List.Item
                    title="Logout"
                    titleStyle={{ color: theme.colors.error }}
                    left={(props) => <List.Icon {...props} icon="logout" color={theme.colors.error} />}
                    onPress={handleLogout}
                    style={styles.logoutItem}
                />

                <View style={{ height: 60 }} />
            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: 16,
    },
    shopName: {
        fontWeight: '700',
        marginTop: 12,
    },
    shopDescription: {
        textAlign: 'center',
        marginTop: 8,
        opacity: 0.8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },
    section: {
        marginHorizontal: 16,
        marginBottom: 12,
    },
    sectionTitle: {
        fontWeight: '600',
        marginBottom: 8,
    },
    logoutItem: {
        marginHorizontal: 16,
        marginTop: 8,
    },
});
