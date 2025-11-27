import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, HelperText, Chip, Text, useTheme } from 'react-native-paper';
import { useFormContext, Controller } from 'react-hook-form';
import type { ProductFormData } from '../ProductWizard';

const CATEGORIES = [
    { label: 'Groceries', value: 'groceries' },
    { label: 'Electronics', value: 'electronics' },
    { label: 'Fashion', value: 'fashion' },
    { label: 'Home & Kitchen', value: 'home' },
    { label: 'Beauty', value: 'beauty' },
    { label: 'Kids', value: 'kids' },
    { label: 'Sports', value: 'sports' },
    { label: 'Other', value: 'other' },
];

export default function BasicInfoStep() {
    const { control, formState: { errors }, watch, setValue } = useFormContext<ProductFormData>();
    const theme = useTheme();
    const tags = watch('tags') || [];
    const [tagInput, setTagInput] = React.useState('');

    const handleAddTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setValue('tags', [...tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setValue('tags', tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Basic Information</Text>

            <Controller
                control={control}
                name="title"
                render={({ field: { onChange, value } }) => (
                    <View style={styles.field}>
                        <TextInput
                            label="Product Title"
                            value={value}
                            onChangeText={onChange}
                            mode="outlined"
                            error={!!errors.title}
                        />
                        {errors.title && <HelperText type="error">{errors.title.message}</HelperText>}
                    </View>
                )}
            />

            <Controller
                control={control}
                name="description"
                render={({ field: { onChange, value } }) => (
                    <View style={styles.field}>
                        <TextInput
                            label="Description"
                            value={value}
                            onChangeText={onChange}
                            mode="outlined"
                            multiline
                            numberOfLines={4}
                            error={!!errors.description}
                        />
                        {errors.description && <HelperText type="error">{errors.description.message}</HelperText>}
                    </View>
                )}
            />

            <Text variant="titleMedium" style={styles.sectionTitle}>Category & Tags</Text>

            <Controller
                control={control}
                name="category"
                render={({ field: { onChange, value } }) => (
                    <View style={styles.field}>
                        <Text variant="bodySmall" style={{ marginBottom: 8 }}>Select Category</Text>
                        <View style={styles.chipContainer}>
                            {CATEGORIES.map((cat) => (
                                <Chip
                                    key={cat.value}
                                    selected={value === cat.value}
                                    onPress={() => onChange(cat.value)}
                                    style={styles.chip}
                                    showSelectedOverlay
                                >
                                    {cat.label}
                                </Chip>
                            ))}
                        </View>
                        {errors.category && <HelperText type="error">{errors.category.message}</HelperText>}
                    </View>
                )}
            />

            <View style={styles.field}>
                <TextInput
                    label="Add Tags (Press Enter)"
                    value={tagInput}
                    onChangeText={setTagInput}
                    onSubmitEditing={handleAddTag}
                    mode="outlined"
                    right={<TextInput.Icon icon="plus" onPress={handleAddTag} />}
                />
                <View style={[styles.chipContainer, { marginTop: 8 }]}>
                    {tags.map((tag) => (
                        <Chip
                            key={tag}
                            onClose={() => handleRemoveTag(tag)}
                            style={styles.chip}
                        >
                            {tag}
                        </Chip>
                    ))}
                </View>
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
        marginTop: 8,
        fontWeight: 'bold',
    },
    field: {
        marginBottom: 16,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        marginBottom: 4,
    },
});
