import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, HelperText, Card, Chip, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { VendorStackParamList } from '../../../navigation/types';
import { useVendor } from '../../../contexts/VendorContext';
import { ShopDetailsData, OperatingHours } from '../../../types/vendor';

type Nav = StackNavigationProp<VendorStackParamList, 'ShopDetailsForm'>;

const CATEGORIES = [
    'Food & Beverages',
    'Electronics',
    'Fashion & Apparel',
    'Health & Beauty',
    'Home & Garden',
    'Sports & Outdoors',
    'Books & Media',
    'Toys & Games',
    'Automotive',
    'Other',
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const ShopDetailsForm: React.FC = () => {
    const navigation = useNavigation<Nav>();
    const theme = useTheme();
    const { vendor, updateVendorProfile } = useVendor();

    const [shopName, setShopName] = useState(vendor?.shop_name || '');
    const [description, setDescription] = useState(vendor?.description || '');
    const [selectedCategories, setSelectedCategories] = useState<string[]>(vendor?.category_ids || []);
    const [businessPhone, setBusinessPhone] = useState(vendor?.business_phone || '');
    const [businessEmail, setBusinessEmail] = useState(vendor?.business_email || '');
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [facebook, setFacebook] = useState('');
    const [instagram, setInstagram] = useState('');
    const [twitter, setTwitter] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleCategory = (category: string) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!shopName.trim()) {
            newErrors.shopName = 'Shop name is required';
        } else if (shopName.trim().length < 3 || shopName.trim().length > 50) {
            newErrors.shopName = 'Shop name must be between 3 and 50 characters';
        }

        if (!description.trim()) {
            newErrors.description = 'Description is required';
        } else if (description.trim().length < 50 || description.trim().length > 500) {
            newErrors.description = 'Description must be between 50 and 500 characters';
        }

        if (selectedCategories.length === 0) {
            newErrors.categories = 'Select at least one category';
        }

        if (!businessPhone.trim()) {
            newErrors.businessPhone = 'Business phone is required';
        } else if (businessPhone.trim().length < 10) {
            newErrors.businessPhone = 'Invalid phone number';
        }

        if (!businessEmail.trim()) {
            newErrors.businessEmail = 'Business email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(businessEmail)) {
            newErrors.businessEmail = 'Invalid email format';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            setIsSubmitting(true);

            // Create default operating hours (9 AM - 6 PM, Monday-Saturday)
            const operatingHours: OperatingHours = {};
            DAYS.forEach((day, index) => {
                operatingHours[day.toLowerCase()] = {
                    is_open: index < 6, // Monday-Saturday open
                    open_time: '09:00',
                    close_time: '18:00',
                };
            });

            const data: Partial<ShopDetailsData> = {
                shop_name: shopName.trim(),
                description: description.trim(),
                categories: selectedCategories,
                business_phone: businessPhone.trim(),
                business_email: businessEmail.trim(),
                whatsapp_number: whatsappNumber.trim() || undefined,
                operating_hours: operatingHours,
                social_media: {
                    facebook: facebook.trim() || undefined,
                    instagram: instagram.trim() || undefined,
                    twitter: twitter.trim() || undefined,
                },
            };

            await updateVendorProfile(data as any);

            // Navigate to next screen
            navigation.navigate('LocationCapture');
        } catch (error) {
            console.error('Failed to save shop details:', error);
            setErrors({ submit: 'Failed to save. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSkip = () => {
        navigation.navigate('Dashboard');
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text variant="headlineMedium" style={styles.title}>
                Shop Details
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
                Tell customers about your business
            </Text>

            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        Basic Information
                    </Text>

                    <TextInput
                        label="Shop Name *"
                        value={shopName}
                        onChangeText={setShopName}
                        mode="outlined"
                        style={styles.input}
                        error={!!errors.shopName}
                        placeholder="e.g., Fresh Groceries Lagos"
                    />
                    <HelperText type="error" visible={!!errors.shopName}>
                        {errors.shopName}
                    </HelperText>

                    <TextInput
                        label="Shop Description *"
                        value={description}
                        onChangeText={setDescription}
                        mode="outlined"
                        style={styles.input}
                        error={!!errors.description}
                        multiline
                        numberOfLines={4}
                        placeholder="Describe your business, products, and what makes you unique..."
                    />
                    <HelperText type="info" visible={true}>
                        {description.length}/500 characters
                    </HelperText>
                    <HelperText type="error" visible={!!errors.description}>
                        {errors.description}
                    </HelperText>

                    <Text variant="labelLarge" style={styles.label}>
                        Business Categories *
                    </Text>
                    <View style={styles.chipsContainer}>
                        {CATEGORIES.map(category => (
                            <Chip
                                key={category}
                                selected={selectedCategories.includes(category)}
                                onPress={() => toggleCategory(category)}
                                style={styles.chip}
                            >
                                {category}
                            </Chip>
                        ))}
                    </View>
                    <HelperText type="error" visible={!!errors.categories}>
                        {errors.categories}
                    </HelperText>
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        Contact Information
                    </Text>

                    <TextInput
                        label="Business Phone *"
                        value={businessPhone}
                        onChangeText={setBusinessPhone}
                        mode="outlined"
                        style={styles.input}
                        error={!!errors.businessPhone}
                        keyboardType="phone-pad"
                        placeholder="+234 800 123 4567"
                        left={<TextInput.Icon icon="phone" />}
                    />
                    <HelperText type="error" visible={!!errors.businessPhone}>
                        {errors.businessPhone}
                    </HelperText>

                    <TextInput
                        label="Business Email *"
                        value={businessEmail}
                        onChangeText={setBusinessEmail}
                        mode="outlined"
                        style={styles.input}
                        error={!!errors.businessEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholder="shop@example.com"
                        left={<TextInput.Icon icon="email" />}
                    />
                    <HelperText type="error" visible={!!errors.businessEmail}>
                        {errors.businessEmail}
                    </HelperText>

                    <TextInput
                        label="WhatsApp Business Number (Optional)"
                        value={whatsappNumber}
                        onChangeText={setWhatsappNumber}
                        mode="outlined"
                        style={styles.input}
                        keyboardType="phone-pad"
                        placeholder="+234 800 123 4567"
                        left={<TextInput.Icon icon="whatsapp" />}
                    />
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        Social Media (Optional)
                    </Text>

                    <TextInput
                        label="Facebook Page URL"
                        value={facebook}
                        onChangeText={setFacebook}
                        mode="outlined"
                        style={styles.input}
                        autoCapitalize="none"
                        placeholder="https://facebook.com/yourpage"
                        left={<TextInput.Icon icon="facebook" />}
                    />

                    <TextInput
                        label="Instagram Handle"
                        value={instagram}
                        onChangeText={setInstagram}
                        mode="outlined"
                        style={styles.input}
                        autoCapitalize="none"
                        placeholder="@yourhandle"
                        left={<TextInput.Icon icon="instagram" />}
                    />

                    <TextInput
                        label="Twitter Handle"
                        value={twitter}
                        onChangeText={setTwitter}
                        mode="outlined"
                        style={styles.input}
                        autoCapitalize="none"
                        placeholder="@yourhandle"
                        left={<TextInput.Icon icon="twitter" />}
                    />
                </Card.Content>
            </Card>

            {errors.submit && (
                <HelperText type="error" visible={true} style={styles.submitError}>
                    {errors.submit}
                </HelperText>
            )}

            <View style={styles.actions}>
                <Button
                    mode="outlined"
                    onPress={handleSkip}
                    style={styles.skipButton}
                    disabled={isSubmitting}
                >
                    Skip for now
                </Button>
                <Button
                    mode="contained"
                    onPress={handleSubmit}
                    style={styles.submitButton}
                    loading={isSubmitting}
                    disabled={isSubmitting}
                >
                    Save & Continue
                </Button>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    content: {
        padding: 16,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        color: '#666',
        marginBottom: 24,
    },
    card: {
        marginBottom: 16,
    },
    sectionTitle: {
        marginBottom: 16,
        fontWeight: '600',
    },
    label: {
        marginTop: 8,
        marginBottom: 8,
    },
    input: {
        marginBottom: 4,
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
    },
    chip: {
        marginBottom: 8,
    },
    submitError: {
        textAlign: 'center',
        marginTop: 8,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24,
        marginBottom: 32,
    },
    skipButton: {
        flex: 1,
    },
    submitButton: {
        flex: 2,
    },
});

export default ShopDetailsForm;
