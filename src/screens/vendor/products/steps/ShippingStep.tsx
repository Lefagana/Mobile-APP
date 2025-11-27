import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Switch, Text, Divider } from 'react-native-paper';
import { useFormContext, Controller } from 'react-hook-form';
import type { ProductFormData } from '../ProductWizard';

export default function ShippingStep() {
    const { control, watch } = useFormContext<ProductFormData>();
    const requiresShipping = watch('requires_shipping');

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Shipping Information</Text>

            <View style={styles.row}>
                <View style={{ flex: 1 }}>
                    <Text variant="bodyLarge" style={{ fontWeight: '600' }}>This is a physical product</Text>
                    <Text variant="bodySmall" style={{ opacity: 0.7 }}>
                        Requires shipping or pickup
                    </Text>
                </View>
                <Controller
                    control={control}
                    name="requires_shipping"
                    render={({ field: { onChange, value } }) => (
                        <Switch value={value} onValueChange={onChange} />
                    )}
                />
            </View>

            {requiresShipping && (
                <View style={styles.indentedSection}>
                    <Text variant="titleSmall" style={{ marginBottom: 12 }}>Weight & Dimensions</Text>

                    <Controller
                        control={control}
                        name="weight_kg"
                        render={({ field: { onChange, value } }) => (
                            <View style={styles.field}>
                                <TextInput
                                    label="Weight (kg)"
                                    value={value?.toString()}
                                    onChangeText={(text) => onChange(parseFloat(text) || 0)}
                                    mode="outlined"
                                    keyboardType="numeric"
                                    right={<TextInput.Affix text="kg" />}
                                />
                            </View>
                        )}
                    />

                    <View style={styles.dimensionsRow}>
                        <Controller
                            control={control}
                            name="dimensions.length_cm"
                            render={({ field: { onChange, value } }) => (
                                <View style={[styles.field, { flex: 1, marginRight: 8 }]}>
                                    <TextInput
                                        label="Length"
                                        value={value?.toString()}
                                        onChangeText={(text) => onChange(parseFloat(text) || 0)}
                                        mode="outlined"
                                        keyboardType="numeric"
                                        right={<TextInput.Affix text="cm" />}
                                    />
                                </View>
                            )}
                        />
                        <Controller
                            control={control}
                            name="dimensions.width_cm"
                            render={({ field: { onChange, value } }) => (
                                <View style={[styles.field, { flex: 1, marginHorizontal: 4 }]}>
                                    <TextInput
                                        label="Width"
                                        value={value?.toString()}
                                        onChangeText={(text) => onChange(parseFloat(text) || 0)}
                                        mode="outlined"
                                        keyboardType="numeric"
                                        right={<TextInput.Affix text="cm" />}
                                    />
                                </View>
                            )}
                        />
                        <Controller
                            control={control}
                            name="dimensions.height_cm"
                            render={({ field: { onChange, value } }) => (
                                <View style={[styles.field, { flex: 1, marginLeft: 8 }]}>
                                    <TextInput
                                        label="Height"
                                        value={value?.toString()}
                                        onChangeText={(text) => onChange(parseFloat(text) || 0)}
                                        mode="outlined"
                                        keyboardType="numeric"
                                        right={<TextInput.Affix text="cm" />}
                                    />
                                </View>
                            )}
                        />
                    </View>
                </View>
            )}

            <Divider style={styles.divider} />

            <View style={styles.row}>
                <View style={{ flex: 1 }}>
                    <Text variant="bodyLarge" style={{ fontWeight: '600' }}>Fragile Item</Text>
                    <Text variant="bodySmall" style={{ opacity: 0.7 }}>
                        Requires special handling
                    </Text>
                </View>
                <Controller
                    control={control}
                    name="is_fragile"
                    render={({ field: { onChange, value } }) => (
                        <Switch value={value} onValueChange={onChange} />
                    )}
                />
            </View>
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
        marginBottom: 16,
        fontWeight: 'bold',
    },
    field: {
        marginBottom: 16,
    },
    divider: {
        marginVertical: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    indentedSection: {
        marginLeft: 16,
        marginTop: 8,
        paddingLeft: 16,
        borderLeftWidth: 2,
        borderLeftColor: '#eee',
    },
    dimensionsRow: {
        flexDirection: 'row',
    },
});
