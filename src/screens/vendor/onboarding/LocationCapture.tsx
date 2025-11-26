import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, HelperText, Card, Chip, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { VendorStackParamList } from '../../../navigation/types';
import { useVendor } from '../../../contexts/VendorContext';
import { LocationData, DeliveryArea } from '../../../types/vendor';

type Nav = StackNavigationProp<VendorStackParamList, 'LocationCapture'>;

const NIGERIAN_STATES = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo',
    'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
    'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
    'Yobe', 'Zamfara',
];

const RADIUS_OPTIONS = [1, 3, 5, 10, 15, 20];

const LocationCapture: React.FC = () => {
    const navigation = useNavigation<Nav>();
    const theme = useTheme();
    const { vendor, updateVendorProfile } = useVendor();

    const [addressText, setAddressText] = useState(vendor?.address_text || '');
    const [landmark, setLandmark] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('Lagos');
    const [postalCode, setPostalCode] = useState('');
    const [selectedRadius, setSelectedRadius] = useState(5);
    const [selectedStates, setSelectedStates] = useState<string[]>(['Lagos']);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleState = (stateName: string) => {
        setSelectedStates(prev =>
            prev.includes(stateName)
                ? prev.filter(s => s !== stateName)
                : [...prev, stateName]
        );
    };

    const handleUseCurrentLocation = () => {
        // Simulate getting current location
        Alert.alert(
            'Location Access',
            'This feature would request location permission and get your current coordinates. For demo purposes, using Lagos coordinates.',
            [{ text: 'OK' }]
        );
        setAddressText('Sample Address, Lagos, Nigeria');
        setStreetAddress('123 Sample Street');
        setCity('Lagos');
        setState('Lagos');
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!addressText.trim()) {
            newErrors.addressText = 'Address is required';
        }

        if (!streetAddress.trim()) {
            newErrors.streetAddress = 'Street address is required';
        }

        if (!city.trim()) {
            newErrors.city = 'City is required';
        }

        if (selectedStates.length === 0) {
            newErrors.deliveryAreas = 'Select at least one delivery area';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            setIsSubmitting(true);

            // Create delivery areas from selected states
            const deliveryAreas: DeliveryArea[] = [
                {
                    type: 'radius',
                    value: selectedRadius,
                    min_order_amount: 0,
                    delivery_fee: 0,
                },
                ...selectedStates.map(stateName => ({
                    type: 'state' as const,
                    value: stateName,
                    min_order_amount: 0,
                    delivery_fee: 500,
                })),
            ];

            const data: Partial<LocationData> = {
                latitude: 6.5244, // Demo Lagos coordinates
                longitude: 3.3792,
                address_text: addressText.trim(),
                landmark: landmark.trim() || undefined,
                street_address: streetAddress.trim(),
                city: city.trim(),
                state,
                postal_code: postalCode.trim() || undefined,
                country: 'Nigeria',
                delivery_areas: deliveryAreas,
            };

            await updateVendorProfile(data as any);

            // Navigate to next screen
            navigation.navigate('KYCUpload');
        } catch (error) {
            console.error('Failed to save location:', error);
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
                Shop Location
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
                Help customers find you and set delivery areas
            </Text>

            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        Shop Address
                    </Text>

                    <Button
                        mode="outlined"
                        onPress={handleUseCurrentLocation}
                        icon="crosshairs-gps"
                        style={styles.locationButton}
                    >
                        Use Current Location
                    </Button>

                    <TextInput
                        label="Full Address *"
                        value={addressText}
                        onChangeText={setAddressText}
                        mode="outlined"
                        style={styles.input}
                        error={!!errors.addressText}
                        multiline
                        numberOfLines={2}
                        placeholder="Enter your complete shop address"
                    />
                    <HelperText type="error" visible={!!errors.addressText}>
                        {errors.addressText}
                    </HelperText>

                    <TextInput
                        label="Street Address *"
                        value={streetAddress}
                        onChangeText={setStreetAddress}
                        mode="outlined"
                        style={styles.input}
                        error={!!errors.streetAddress}
                        placeholder="e.g., 123 Main Street"
                    />
                    <HelperText type="error" visible={!!errors.streetAddress}>
                        {errors.streetAddress}
                    </HelperText>

                    <TextInput
                        label="Landmark (Optional)"
                        value={landmark}
                        onChangeText={setLandmark}
                        mode="outlined"
                        style={styles.input}
                        placeholder="e.g., Near City Mall"
                    />

                    <View style={styles.row}>
                        <View style={styles.halfWidth}>
                            <TextInput
                                label="City *"
                                value={city}
                                onChangeText={setCity}
                                mode="outlined"
                                style={styles.input}
                                error={!!errors.city}
                            />
                        </View>
                        <View style={styles.halfWidth}>
                            <TextInput
                                label="Postal Code"
                                value={postalCode}
                                onChangeText={setPostalCode}
                                mode="outlined"
                                style={styles.input}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>
                    <HelperText type="error" visible={!!errors.city}>
                        {errors.city}
                    </HelperText>
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        Delivery Radius
                    </Text>
                    <Text variant="bodySmall" style={styles.helperText}>
                        Select how far you can deliver from your shop
                    </Text>

                    <View style={styles.chipsContainer}>
                        {RADIUS_OPTIONS.map(radius => (
                            <Chip
                                key={radius}
                                selected={selectedRadius === radius}
                                onPress={() => setSelectedRadius(radius)}
                                style={styles.chip}
                            >
                                {radius} km
                            </Chip>
                        ))}
                    </View>
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        Delivery States *
                    </Text>
                    <Text variant="bodySmall" style={styles.helperText}>
                        Select states where you can deliver
                    </Text>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statesScroll}>
                        <View style={styles.chipsContainer}>
                            {NIGERIAN_STATES.map(stateName => (
                                <Chip
                                    key={stateName}
                                    selected={selectedStates.includes(stateName)}
                                    onPress={() => toggleState(stateName)}
                                    style={styles.chip}
                                >
                                    {stateName}
                                </Chip>
                            ))}
                        </View>
                    </ScrollView>
                    <HelperText type="error" visible={!!errors.deliveryAreas}>
                        {errors.deliveryAreas}
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
        marginBottom: 8,
        fontWeight: '600',
    },
    helperText: {
        color: '#666',
        marginBottom: 16,
    },
    locationButton: {
        marginBottom: 16,
    },
    input: {
        marginBottom: 4,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    halfWidth: {
        flex: 1,
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
    statesScroll: {
        marginTop: 8,
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

export default LocationCapture;
