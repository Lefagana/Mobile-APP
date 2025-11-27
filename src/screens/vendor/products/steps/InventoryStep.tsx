import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, HelperText, Switch, Text, Divider } from 'react-native-paper';
import { useFormContext, Controller } from 'react-hook-form';
import type { ProductFormData } from '../ProductWizard';

export default function InventoryStep() {
    const { control, formState: { errors }, watch } = useFormContext<ProductFormData>();
    const trackQuantity = watch('track_quantity');

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Inventory Details</Text>

            <Controller
                control={control}
                name="sku"
                render={({ field: { onChange, value } }) => (
                    <View style={styles.field}>
                        <TextInput
                            label="SKU (Stock Keeping Unit)"
                            value={value}
                            onChangeText={onChange}
                            mode="outlined"
                            error={!!errors.sku}
                        />
                        {errors.sku && <HelperText type="error">{errors.sku.message}</HelperText>}
                    </View>
                )}
            />

            <Controller
                control={control}
                name="barcode"
                render={({ field: { onChange, value } }) => (
                    <View style={styles.field}>
                        <TextInput
                            label="Barcode (ISBN, UPC, GTIN, etc.)"
                            value={value}
                            onChangeText={onChange}
                            mode="outlined"
                        />
                    </View>
                )}
            />

            <Divider style={styles.divider} />

            <View style={styles.row}>
                <View style={{ flex: 1 }}>
                    <Text variant="bodyLarge" style={{ fontWeight: '600' }}>Track Quantity</Text>
                    <Text variant="bodySmall" style={{ opacity: 0.7 }}>
                        Automatically track stock levels
                    </Text>
                </View>
                <Controller
                    control={control}
                    name="track_quantity"
                    render={({ field: { onChange, value } }) => (
                        <Switch value={value} onValueChange={onChange} />
                    )}
                />
            </View>

            {trackQuantity && (
                <View style={styles.indentedSection}>
                    <Controller
                        control={control}
                        name="quantity"
                        render={({ field: { onChange, value } }) => (
                            <View style={styles.field}>
                                <TextInput
                                    label="Available Quantity"
                                    value={value?.toString()}
                                    onChangeText={(text) => onChange(parseInt(text) || 0)}
                                    mode="outlined"
                                    keyboardType="numeric"
                                    error={!!errors.quantity}
                                />
                                {errors.quantity && <HelperText type="error">{errors.quantity.message}</HelperText>}
                            </View>
                        )}
                    />

                    <Controller
                        control={control}
                        name="low_stock_threshold"
                        render={({ field: { onChange, value } }) => (
                            <View style={styles.field}>
                                <TextInput
                                    label="Low Stock Alert Threshold"
                                    value={value?.toString()}
                                    onChangeText={(text) => onChange(parseInt(text) || 0)}
                                    mode="outlined"
                                    keyboardType="numeric"
                                />
                                <HelperText type="info">
                                    Get notified when stock falls below this number
                                </HelperText>
                            </View>
                        )}
                    />
                </View>
            )}

            <Divider style={styles.divider} />

            <View style={styles.row}>
                <View style={{ flex: 1 }}>
                    <Text variant="bodyLarge" style={{ fontWeight: '600' }}>Continue selling when out of stock</Text>
                    <Text variant="bodySmall" style={{ opacity: 0.7 }}>
                        Allow customers to purchase this item even if quantity is zero
                    </Text>
                </View>
                <Controller
                    control={control}
                    name="allow_backorders"
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
});
