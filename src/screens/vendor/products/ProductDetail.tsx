import React from 'react';
import { View, ScrollView, StyleSheet, Image, Alert } from 'react-native';
import { Text, Button, Chip, Divider, IconButton, useTheme, FAB } from 'react-native-paper';
import { ScreenContainer } from '../../../components/common/ScreenContainer';
import { useVendor } from '../../../contexts/VendorContext';
import { formatCurrency } from '../../../utils/formatters';
import type { VendorStackParamList } from '../../../navigation/types';
import type { StackScreenProps } from '@react-navigation/stack';

type Props = StackScreenProps<VendorStackParamList, 'ProductDetail'>;

export default function ProductDetail({ route, navigation }: Props) {
    const theme = useTheme();
    const { productId } = route.params;
    const { products, deleteProduct } = useVendor();

    const product = products.find(p => p.id === productId);

    if (!product) {
        return (
            <ScreenContainer>
                <View style={styles.errorContainer}>
                    <Text variant="titleMedium">Product not found</Text>
                    <Button onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
                        Go Back
                    </Button>
                </View>
            </ScreenContainer>
        );
    }

    const handleDelete = () => {
        Alert.alert(
            'Delete Product',
            'Are you sure you want to delete this product? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteProduct(productId);
                            navigation.goBack();
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete product');
                        }
                    }
                }
            ]
        );
    };

    return (
        <ScreenContainer>
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                {/* Images */}
                <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
                    {product.images.length > 0 ? (
                        product.images.map((img, index) => (
                            <Image key={index} source={{ uri: img }} style={styles.image} resizeMode="cover" />
                        ))
                    ) : (
                        <View style={[styles.image, styles.placeholderImage]}>
                            <Text variant="bodyLarge">No Image</Text>
                        </View>
                    )}
                </ScrollView>

                <View style={styles.details}>
                    {/* Header Info */}
                    <View style={styles.headerRow}>
                        <Chip
                            style={[
                                styles.statusChip,
                                { backgroundColor: product.status === 'active' ? '#E8F5E9' : '#FFEBEE' }
                            ]}
                            textStyle={{ color: product.status === 'active' ? '#2E7D32' : '#C62828' }}
                        >
                            {product.status.toUpperCase()}
                        </Chip>
                        <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                            {product.views} views • {product.sales_count} sold
                        </Text>
                    </View>

                    <Text variant="headlineSmall" style={styles.title}>{product.title}</Text>
                    <Text variant="headlineMedium" style={styles.price}>{formatCurrency(product.price)}</Text>

                    <Divider style={styles.divider} />

                    {/* Description */}
                    <Text variant="titleMedium" style={styles.sectionTitle}>Description</Text>
                    <Text variant="bodyMedium" style={styles.description}>
                        {product.description || 'No description provided.'}
                    </Text>

                    <Divider style={styles.divider} />

                    {/* Inventory & Variants */}
                    <Text variant="titleMedium" style={styles.sectionTitle}>Inventory</Text>
                    <View style={styles.infoRow}>
                        <Text variant="bodyMedium">Total Stock:</Text>
                        <Text variant="bodyLarge" style={{ fontWeight: '700' }}>{product.quantity}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text variant="bodyMedium">Category:</Text>
                        <Text variant="bodyMedium" style={{ textTransform: 'capitalize' }}>{product.category}</Text>
                    </View>

                    {product.has_variants && product.variants && product.variants.length > 0 && (
                        <View style={styles.variantsSection}>
                            <Text variant="titleSmall" style={{ marginBottom: 8 }}>Variants</Text>
                            {product.variants.map((variant) => (
                                <View key={variant.id} style={styles.variantItem}>
                                    <Text variant="bodyMedium">{variant.label}</Text>
                                    <Text variant="bodyMedium">
                                        {formatCurrency(variant.price || product.price)} • {variant.quantity || 0} left
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}

                    <Button
                        mode="outlined"
                        textColor={theme.colors.error}
                        style={styles.deleteBtn}
                        onPress={handleDelete}
                    >
                        Delete Product
                    </Button>
                </View>
            </ScrollView>

            <FAB
                icon="pencil"
                style={styles.fab}
                onPress={() => navigation.navigate('ProductForm', {
                    mode: 'edit',
                    productId: product.id
                })}
            />
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingBottom: 80,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageScroll: {
        height: 300,
        backgroundColor: '#f0f0f0',
    },
    image: {
        width: 400, // Should be screen width ideally
        height: 300,
    },
    placeholderImage: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    details: {
        padding: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    statusChip: {
        height: 28,
    },
    title: {
        fontWeight: '700',
        marginBottom: 8,
    },
    price: {
        color: '#4CAF50',
        fontWeight: '700',
        marginBottom: 16,
    },
    divider: {
        marginVertical: 16,
    },
    sectionTitle: {
        fontWeight: '700',
        marginBottom: 8,
    },
    description: {
        lineHeight: 22,
        opacity: 0.8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    variantsSection: {
        marginTop: 16,
        backgroundColor: '#F5F5F5',
        padding: 12,
        borderRadius: 8,
    },
    variantItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    deleteBtn: {
        marginTop: 32,
        borderColor: '#FFEBEE',
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
    },
});
