import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, HelperText, Text } from 'react-native-paper';
import { useFormContext, Controller } from 'react-hook-form';
import type { ProductFormData } from '../ProductWizard';

export default function PricingStep() {
    const { control, formState: { errors } } = useFormContext<ProductFormData>();

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Pricing</Text>

            <Controller
                control={control}
                name="price"
                render={({ field: { onChange, value } }) => (
                    <View style={styles.field}>
                        <TextInput
                            label="Price"
                            value={value?.toString()}
                            onChangeText={(text) => onChange(parseFloat(text) || 0)}
                            mode="outlined"
                            keyboardType="numeric"
                            left={<TextInput.Affix text="₦" />}
                            error={!!errors.price}
                        />
                        {errors.price && <HelperText type="error">{errors.price.message}</HelperText>}
                    </View>
                )}
            />

            <Controller
                control={control}
                name="compare_at_price"
                render={({ field: { onChange, value } }) => (
                    <View style={styles.field}>
                        <TextInput
                            label="Compare-at Price (Optional)"
                            value={value?.toString()}
                            onChangeText={(text) => onChange(text ? parseFloat(text) : undefined)}
                            mode="outlined"
                            keyboardType="numeric"
                            left={<TextInput.Affix text="₦" />}
                            placeholder="Original price before discount"
                        />
                        <HelperText type="info">
                            To show a reduced price, enter a value higher than your price.
                        </HelperText>
                    </View>
                )}
            />

            <Text variant="titleMedium" style={styles.sectionTitle}>Cost per item</Text>
            <Text variant="bodySmall" style={styles.subtitle}>
                Customers won't see this. It helps you track profit margin.
            </Text>

            <Controller
                control={control}
                name="cost_price"
                render={({ field: { onChange, value } }) => (
                    <View style={styles.field}>
                        <TextInput
                            label="Cost Price (Optional)"
                            value={value?.toString()}
                            onChangeText={(text) => onChange(text ? parseFloat(text) : undefined)}
                            mode="outlined"
                            keyboardType="numeric"
                            left={<TextInput.Affix text="₦" />}
                        />
                    </View>
                )}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    sectionTitle: {
        marginBottom: 8,
        marginTop: 8,
        fontWeight: 'bold',
    },
    subtitle: {
        marginBottom: 16,
        opacity: 0.7,
    },
    field: {
        marginBottom: 16,
    },
});
