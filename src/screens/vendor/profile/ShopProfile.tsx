import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { TextInput, Button, HelperText, Avatar, Text, useTheme } from 'react-native-paper';
import { ScreenContainer } from '../../../components/common/ScreenContainer';
import { useVendor } from '../../../contexts/VendorContext';
import type { VendorStackParamList } from '../../../navigation/types';
import type { StackScreenProps } from '@react-navigation/stack';

type Props = StackScreenProps<VendorStackParamList, 'ShopProfile'>;

export default function ShopProfile({ navigation }: Props) {
    const theme = useTheme();
    const { vendor, updateVendorProfile } = useVendor();
    const [loading, setLoading] = useState(false);

    const [shopName, setShopName] = useState(vendor?.shop_name || '');
    const [description, setDescription] = useState(vendor?.description || '');
    const [phone, setPhone] = useState(vendor?.business_phone || '');
    const [email, setEmail] = useState(vendor?.business_email || '');
    const [address, setAddress] = useState(vendor?.address_text || '');

    if (!vendor) return null;

    const handleSave = async () => {
        if (!shopName || !phone || !email) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            await updateVendorProfile({
                shop_name: shopName,
                description,
                business_phone: phone,
                business_email: email,
                address_text: address,
            });
            Alert.alert('Success', 'Shop profile updated successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenContainer>
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                <View style={styles.logoContainer}>
                    <TouchableOpacity onPress={() => Alert.alert('Upload Logo', 'Image upload simulation')}>
                        <Avatar.Text size={100} label={shopName.substring(0, 2)} />
                        <View style={[styles.editBadge, { backgroundColor: theme.colors.primary }]}>
                            <Text style={{ color: '#fff', fontSize: 12 }}>Edit</Text>
                        </View>
                    </TouchableOpacity>
                    <Text variant="bodyMedium" style={{ marginTop: 8, opacity: 0.6 }}>
                        Tap to change logo
                    </Text>
                </View>

                <View style={styles.form}>
                    <TextInput
                        label="Shop Name *"
                        value={shopName}
                        onChangeText={setShopName}
                        mode="outlined"
                        style={styles.input}
                    />

                    <TextInput
                        label="Description"
                        value={description}
                        onChangeText={setDescription}
                        mode="outlined"
                        multiline
                        numberOfLines={3}
                        style={styles.input}
                    />

                    <TextInput
                        label="Contact Phone *"
                        value={phone}
                        onChangeText={setPhone}
                        mode="outlined"
                        keyboardType="phone-pad"
                        style={styles.input}
                    />

                    <TextInput
                        label="Contact Email *"
                        value={email}
                        onChangeText={setEmail}
                        mode="outlined"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={styles.input}
                    />

                    <TextInput
                        label="Address"
                        value={address}
                        onChangeText={setAddress}
                        mode="outlined"
                        multiline
                        style={styles.input}
                    />

                    <Button
                        mode="contained"
                        onPress={handleSave}
                        loading={loading}
                        disabled={loading}
                        style={styles.saveBtn}
                    >
                        Save Changes
                    </Button>
                </View>
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
    logoContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    form: {
        gap: 16,
    },
    input: {
        backgroundColor: '#fff',
    },
    saveBtn: {
        marginTop: 16,
        paddingVertical: 6,
    },
});
