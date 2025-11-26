import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, RadioButton, TextInput, Button, HelperText, Card, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { VendorStackParamList } from '../../../navigation/types';
import { useVendor } from '../../../contexts/VendorContext';
import { BusinessTypeData } from '../../../types/vendor';

type Nav = StackNavigationProp<VendorStackParamList, 'BusinessTypeSelection'>;

const BusinessTypeSelection: React.FC = () => {
    const navigation = useNavigation<Nav>();
    const theme = useTheme();
    const { vendor, updateVendorProfile } = useVendor();

    const [businessType, setBusinessType] = useState<'individual' | 'business' | 'corporation'>(
        vendor?.business_type || 'individual'
    );
    const [legalName, setLegalName] = useState(vendor?.legal_business_name || '');
    const [cacNumber, setCacNumber] = useState(vendor?.business_registration || '');
    const [taxId, setTaxId] = useState(vendor?.tax_id || '');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!legalName.trim()) {
            newErrors.legalName = 'Legal business name is required';
        } else if (legalName.trim().length < 3 || legalName.trim().length > 100) {
            newErrors.legalName = 'Name must be between 3 and 100 characters';
        }

        if ((businessType === 'business' || businessType === 'corporation') && !cacNumber.trim()) {
            newErrors.cacNumber = 'CAC registration number is required for businesses';
        } else if (cacNumber && cacNumber.trim().length < 6) {
            newErrors.cacNumber = 'Invalid CAC number format';
        }

        if (taxId && taxId.trim().length < 8) {
            newErrors.taxId = 'Invalid Tax ID format';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            setIsSubmitting(true);

            const data: Partial<BusinessTypeData> = {
                business_type: businessType,
                legal_business_name: legalName.trim(),
                cac_number: cacNumber.trim() || undefined,
                tax_id: taxId.trim() || undefined,
            };

            await updateVendorProfile(data);

            // Navigate to next screen
            navigation.navigate('ShopDetailsForm');
        } catch (error) {
            console.error('Failed to save business type:', error);
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
                Business Type
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
                Select your business type and provide legal information
            </Text>

            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        Select Business Type
                    </Text>

                    <RadioButton.Group onValueChange={(value) => setBusinessType(value as any)} value={businessType}>
                        <View style={styles.radioItem}>
                            <RadioButton value="individual" />
                            <View style={styles.radioContent}>
                                <Text variant="titleSmall">Individual</Text>
                                <Text variant="bodySmall" style={styles.radioDescription}>
                                    Sole proprietor or freelancer
                                </Text>
                            </View>
                        </View>

                        <View style={styles.radioItem}>
                            <RadioButton value="business" />
                            <View style={styles.radioContent}>
                                <Text variant="titleSmall">Business</Text>
                                <Text variant="bodySmall" style={styles.radioDescription}>
                                    Registered business or LLC
                                </Text>
                            </View>
                        </View>

                        <View style={styles.radioItem}>
                            <RadioButton value="corporation" />
                            <View style={styles.radioContent}>
                                <Text variant="titleSmall">Corporation</Text>
                                <Text variant="bodySmall" style={styles.radioDescription}>
                                    Large enterprise or corporation
                                </Text>
                            </View>
                        </View>
                    </RadioButton.Group>
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        Legal Information
                    </Text>

                    <TextInput
                        label="Legal Business Name *"
                        value={legalName}
                        onChangeText={setLegalName}
                        mode="outlined"
                        style={styles.input}
                        error={!!errors.legalName}
                    />
                    <HelperText type="error" visible={!!errors.legalName}>
                        {errors.legalName}
                    </HelperText>

                    {(businessType === 'business' || businessType === 'corporation') && (
                        <>
                            <TextInput
                                label="CAC Registration Number *"
                                value={cacNumber}
                                onChangeText={setCacNumber}
                                mode="outlined"
                                style={styles.input}
                                error={!!errors.cacNumber}
                                placeholder="RC123456"
                            />
                            <HelperText type="error" visible={!!errors.cacNumber}>
                                {errors.cacNumber}
                            </HelperText>
                        </>
                    )}

                    <TextInput
                        label="Tax ID / TIN (Optional)"
                        value={taxId}
                        onChangeText={setTaxId}
                        mode="outlined"
                        style={styles.input}
                        error={!!errors.taxId}
                        placeholder="12345678-0001"
                    />
                    <HelperText type="error" visible={!!errors.taxId}>
                        {errors.taxId}
                    </HelperText>
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
    radioItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    radioContent: {
        flex: 1,
        marginLeft: 8,
    },
    radioDescription: {
        color: '#666',
        marginTop: 2,
    },
    input: {
        marginBottom: 4,
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

export default BusinessTypeSelection;
