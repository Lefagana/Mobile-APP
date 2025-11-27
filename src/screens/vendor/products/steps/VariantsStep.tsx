import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Switch, Text, Divider, IconButton, Chip } from 'react-native-paper';
import { useFormContext, Controller } from 'react-hook-form';
import type { ProductFormData } from '../ProductWizard';

export default function VariantsStep() {
    const { control, watch, setValue, formState: { errors } } = useFormContext<ProductFormData>();
    const hasVariants = watch('has_variants');
    const variants = watch('variants') || [];

    // Local state for option generator
    const [options, setOptions] = useState<{ name: string; values: string[] }[]>([
        { name: 'Size', values: [] }
    ]);
    const [newValue, setNewValue] = useState('');
    const [activeOptionIndex, setActiveOptionIndex] = useState(0);

    const addOptionValue = () => {
        if (!newValue.trim()) return;

        const newOptions = [...options];
        if (!newOptions[activeOptionIndex].values.includes(newValue.trim())) {
            newOptions[activeOptionIndex].values.push(newValue.trim());
            setOptions(newOptions);
            setNewValue('');
            generateVariants(newOptions);
        }
    };

    const removeOptionValue = (optionIndex: number, valueToRemove: string) => {
        const newOptions = [...options];
        newOptions[optionIndex].values = newOptions[optionIndex].values.filter(v => v !== valueToRemove);
        setOptions(newOptions);
        generateVariants(newOptions);
    };

    const addOptionType = () => {
        if (options.length >= 3) {
            Alert.alert('Limit Reached', 'You can only add up to 3 option types (e.g. Size, Color, Material)');
            return;
        }
        setOptions([...options, { name: 'Color', values: [] }]);
        setActiveOptionIndex(options.length);
    };

    const generateVariants = (currentOptions: { name: string; values: string[] }[]) => {
        // Cartesian product of all option values
        const generateCombinations = (index: number, current: Record<string, string>): Record<string, string>[] => {
            if (index === currentOptions.length) return [current];

            const option = currentOptions[index];
            if (option.values.length === 0) return generateCombinations(index + 1, current);

            let combinations: Record<string, string>[] = [];
            for (const value of option.values) {
                combinations = [
                    ...combinations,
                    ...generateCombinations(index + 1, { ...current, [option.name]: value })
                ];
            }
            return combinations;
        };

        const combinations = generateCombinations(0, {});

        const newVariants = combinations.map((combo, index) => {
            const label = Object.values(combo).join(' / ');
            // Preserve existing variant data if label matches
            const existing = variants.find(v => v.label === label);

            return existing || {
                id: `var_${Date.now()}_${index}`,
                label,
                sku: `${watch('sku')}-${index + 1}`,
                price: watch('price'),
                quantity: watch('quantity'),
                attributes: combo,
            };
        });

        if (newVariants.length > 0) {
            setValue('variants', newVariants);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.row}>
                <View style={{ flex: 1 }}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>Product Variants</Text>
                    <Text variant="bodySmall">Does this product have options like size or color?</Text>
                </View>
                <Controller
                    control={control}
                    name="has_variants"
                    render={({ field: { onChange, value } }) => (
                        <Switch value={value} onValueChange={onChange} />
                    )}
                />
            </View>

            {hasVariants && (
                <View style={styles.variantsContainer}>
                    <Text variant="titleSmall" style={{ marginTop: 16, marginBottom: 8 }}>Option Types</Text>

                    {options.map((option, index) => (
                        <View key={index} style={styles.optionBlock}>
                            <View style={styles.row}>
                                <TextInput
                                    value={option.name}
                                    onChangeText={(text) => {
                                        const newOptions = [...options];
                                        newOptions[index].name = text;
                                        setOptions(newOptions);
                                    }}
                                    mode="outlined"
                                    style={{ flex: 1, marginRight: 8 }}
                                    label="Option Name"
                                />
                                {index > 0 && (
                                    <IconButton
                                        icon="delete"
                                        onPress={() => {
                                            const newOptions = options.filter((_, i) => i !== index);
                                            setOptions(newOptions);
                                            setActiveOptionIndex(0);
                                            generateVariants(newOptions);
                                        }}
                                    />
                                )}
                            </View>

                            <View style={styles.valueInputContainer}>
                                <TextInput
                                    value={activeOptionIndex === index ? newValue : ''}
                                    onChangeText={setNewValue}
                                    onFocus={() => setActiveOptionIndex(index)}
                                    onSubmitEditing={addOptionValue}
                                    mode="outlined"
                                    label={`Add ${option.name} values`}
                                    placeholder="Type and press enter"
                                    style={{ flex: 1 }}
                                    right={<TextInput.Icon icon="plus" onPress={addOptionValue} />}
                                />
                            </View>

                            <View style={styles.chipContainer}>
                                {option.values.map((val) => (
                                    <Chip
                                        key={val}
                                        onClose={() => removeOptionValue(index, val)}
                                        style={styles.chip}
                                    >
                                        {val}
                                    </Chip>
                                ))}
                            </View>
                        </View>
                    ))}

                    {options.length < 3 && (
                        <Button mode="text" onPress={addOptionType} icon="plus">
                            Add Another Option
                        </Button>
                    )}

                    <Divider style={styles.divider} />

                    <Text variant="titleSmall" style={{ marginBottom: 8 }}>
                        Preview Variants ({variants.length})
                    </Text>

                    {variants.map((variant: any, index: number) => (
                        <View key={index} style={styles.variantItem}>
                            <View style={{ flex: 1 }}>
                                <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>{variant.label}</Text>
                                <Text variant="bodySmall" style={{ color: '#666' }}>
                                    {Object.entries(variant.attributes).map(([k, v]) => `${k}: ${v}`).join(', ')}
                                </Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text variant="bodyMedium">₦{variant.price}</Text>
                                <Text variant="bodySmall">Qty: {variant.quantity}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            )}
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
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    variantsContainer: {
        marginTop: 16,
    },
    optionBlock: {
        marginBottom: 24,
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#eee',
    },
    valueInputContainer: {
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 12,
    },
    chip: {
        backgroundColor: '#f0f0f0',
    },
    divider: {
        marginVertical: 24,
    },
    variantItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
});
