import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Image, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Button, TextInput, useTheme, Switch, HelperText, IconButton, Menu, Divider } from 'react-native-paper';
import { ScreenContainer } from '../../../components/common/ScreenContainer';
import type { VendorStackParamList } from '../../../navigation/types';
import type { StackScreenProps } from '@react-navigation/stack';
import { useVendor } from '../../../contexts/VendorContext';
import { ProductVariant, VendorProduct } from '../../../types/vendor';

type Props = StackScreenProps<VendorStackParamList, 'ProductForm'>;

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

export default function ProductForm({ route, navigation }: Props) {
    const theme = useTheme();
    const { mode, productId } = route.params;
    const { products, addProduct, updateProduct } = useVendor();

    const isEdit = mode === 'edit';
    const existingProduct = isEdit ? products.find(p => p.id === productId) : null;

    // Form State
    const [title, setTitle] = useState(existingProduct?.title || '');
    const [description, setDescription] = useState(existingProduct?.description || '');
    const [price, setPrice] = useState(existingProduct?.price?.toString() || '');
    const [category, setCategory] = useState(existingProduct?.category || 'groceries');
    const [quantity, setQuantity] = useState(existingProduct?.quantity?.toString() || '0');
    const [images, setImages] = useState<string[]>(existingProduct?.images || []);
    const [variants, setVariants] = useState<ProductVariant[]>(existingProduct?.variants || []);
    const [isActive, setIsActive] = useState(existingProduct?.status === 'active' ?? true);

    // UI State
    const [loading, setLoading] = useState(false);
    const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Mock Image Picker
    const handleAddImage = () => {
        // In a real app, this would open image picker
        // For demo, we'll add a random placeholder
        const newImage = `https://source.unsplash.com/featured/600x600?product,${category},${Date.now()}`;
        setImages([...images, newImage]);
    };

    const handleRemoveImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };

    // Variant Management
    const handleAddVariant = () => {
        Alert.prompt(
            'Add Variant',
            'Enter variant name (e.g., "Size XL" or "Red")',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Add',
                    onPress: (name) => {
                        if (name) {
                            setVariants([
                                ...variants,
                                {
                                    id: `var_${Date.now()}`,
                                    label: name,
                                    price: parseFloat(price) || 0,
                                    quantity: parseInt(quantity) || 0,
                                    attributes: { name },
                                }
                            ]);
                        }
                    }
                }
            ],
            'plain-text'
        );
    };

    const handleRemoveVariant = (id: string) => {
        setVariants(variants.filter(v => v.id !== id));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!title.trim()) newErrors.title = 'Title is required';
        if (!price || isNaN(parseFloat(price))) newErrors.price = 'Valid price is required';
        if (!quantity || isNaN(parseInt(quantity))) newErrors.quantity = 'Valid quantity is required';
        if (images.length === 0) newErrors.images = 'At least one image is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            const productData: Partial<VendorProduct> = {
                title,
                description,
                price: parseFloat(price),
                category,
                quantity: parseInt(quantity),
                images,
                variants,
                status: isActive ? 'active' : 'inactive',
                has_variants: variants.length > 0,
            };

            if (isEdit && productId) {
                await updateProduct(productId, productData);
                Alert.alert('Success', 'Product updated successfully');
            } else {
                await addProduct(productData);
                Alert.alert('Success', 'Product created successfully');
            }
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenContainer>
            <View style={styles.header}>
                <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
                <Text variant="titleLarge" style={styles.headerTitle}>
                    {isEdit ? 'Edit Product' : 'New Product'}
                </Text>
                <Button
                    mode="contained"
                    onPress={handleSubmit}
                    loading={loading}
                    disabled={loading}
                >
                    Save
                </Button>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
                    {/* Images Section */}
                    <View style={styles.section}>
                        <Text variant="titleMedium" style={styles.sectionTitle}>Product Images</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
                            {images.map((img, index) => (
                                <View key={index} style={styles.imageContainer}>
                                    <Image source={{ uri: img }} style={styles.image} />
                                    <IconButton
                                        icon="close-circle"
                                        size={20}
                                        style={styles.removeImageBtn}
                                        iconColor={theme.colors.error}
                                        onPress={() => handleRemoveImage(index)}
                                    />
                                </View>
                            ))}
                            <TouchableOpacity style={styles.addImageBtn} onPress={handleAddImage}>
                                <IconButton icon="camera-plus" size={30} />
                                <Text variant="bodySmall">Add Image</Text>
                            </TouchableOpacity>
                        </ScrollView>
                        {errors.images && <HelperText type="error">{errors.images}</HelperText>}
                    </View>

                    {/* Basic Info Section */}
                    <View style={styles.section}>
                        <Text variant="titleMedium" style={styles.sectionTitle}>Basic Information</Text>

                        <TextInput
                            label="Product Title"
                            value={title}
                            onChangeText={setTitle}
                            mode="outlined"
                            style={styles.input}
                            error={!!errors.title}
                        />
                        {errors.title && <HelperText type="error">{errors.title}</HelperText>}

                        <TextInput
                            label="Description"
                            value={description}
                            onChangeText={setDescription}
                            mode="outlined"
                            multiline
                            numberOfLines={4}
                            style={styles.input}
                        />

                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 8 }}>
                                <TextInput
                                    label="Price (₦)"
                                    value={price}
                                    onChangeText={setPrice}
                                    mode="outlined"
                                    keyboardType="numeric"
                                    style={styles.input}
                                    error={!!errors.price}
                                    left={<TextInput.Affix text="₦" />}
                                />
                            </View>
                            <View style={{ flex: 1, marginLeft: 8 }}>
                                <Menu
                                    visible={categoryMenuVisible}
                                    onDismiss={() => setCategoryMenuVisible(false)}
                                    anchor={
                                        <TouchableOpacity onPress={() => setCategoryMenuVisible(true)}>
                                            <TextInput
                                                label="Category"
                                                value={CATEGORIES.find(c => c.value === category)?.label}
                                                mode="outlined"
                                                editable={false}
                                                style={styles.input}
                                                right={<TextInput.Icon icon="chevron-down" />}
                                            />
                                        </TouchableOpacity>
                                    }
                                >
                                    {CATEGORIES.map((cat) => (
                                        <Menu.Item
                                            key={cat.value}
                                            onPress={() => {
                                                setCategory(cat.value);
                                                setCategoryMenuVisible(false);
                                            }}
                                            title={cat.label}
                                        />
                                    ))}
                                </Menu>
                            </View>
                        </View>
                    </View>

                    {/* Inventory Section */}
                    <View style={styles.section}>
                        <Text variant="titleMedium" style={styles.sectionTitle}>Inventory</Text>
                        <View style={styles.row}>
                            <View style={{ flex: 1 }}>
                                <TextInput
                                    label="Stock Quantity"
                                    value={quantity}
                                    onChangeText={setQuantity}
                                    mode="outlined"
                                    keyboardType="numeric"
                                    style={styles.input}
                                    error={!!errors.quantity}
                                />
                            </View>
                            <View style={styles.switchContainer}>
                                <Text variant="bodyMedium">Active Status</Text>
                                <Switch value={isActive} onValueChange={setIsActive} />
                            </View>
                        </View>
                    </View>

                    {/* Variants Section */}
                    <View style={styles.section}>
                        <View style={styles.row}>
                            <Text variant="titleMedium" style={styles.sectionTitle}>Variants</Text>
                            <Button mode="text" onPress={handleAddVariant}>+ Add Variant</Button>
                        </View>

                        {variants.length === 0 ? (
                            <Text variant="bodyMedium" style={styles.emptyText}>No variants added yet</Text>
                        ) : (
                            variants.map((variant) => (
                                <View key={variant.id} style={styles.variantItem}>
                                    <View style={{ flex: 1 }}>
                                        <Text variant="titleSmall">{variant.label}</Text>
                                        <Text variant="bodySmall">₦{variant.price} • {variant.quantity} in stock</Text>
                                    </View>
                                    <IconButton
                                        icon="delete"
                                        size={20}
                                        iconColor={theme.colors.error}
                                        onPress={() => handleRemoveVariant(variant.id)}
                                    />
                                </View>
                            ))
                        )}
                    </View>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    headerTitle: {
        flex: 1,
        fontWeight: '700',
        marginLeft: 8,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    section: {
        marginBottom: 24,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    sectionTitle: {
        fontWeight: '700',
        marginBottom: 16,
    },
    input: {
        marginBottom: 12,
        backgroundColor: '#fff',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    imageScroll: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    imageContainer: {
        width: 100,
        height: 100,
        marginRight: 12,
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    removeImageBtn: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#fff',
    },
    addImageBtn: {
        width: 100,
        height: 100,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    switchContainer: {
        flex: 1,
        marginLeft: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    variantItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    emptyText: {
        opacity: 0.6,
        fontStyle: 'italic',
    },
});
