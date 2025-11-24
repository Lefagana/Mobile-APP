import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { Modal, Portal, Text, Button, IconButton, useTheme, Chip, Surface } from 'react-native-paper';
import { Product, ProductVariant } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface BuyNowSheetProps {
    visible: boolean;
    product: Product;
    onDismiss: () => void;
    onConfirm: (variant?: ProductVariant, quantity?: number) => void;
    initialVariant?: ProductVariant;
    initialQuantity?: number;
}

export const BuyNowSheet: React.FC<BuyNowSheetProps> = ({
    visible,
    product,
    onDismiss,
    onConfirm,
    initialVariant,
    initialQuantity = 1,
}) => {
    const theme = useTheme();
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(initialVariant);
    const [quantity, setQuantity] = useState(initialQuantity);

    const hasVariants = product.variants && product.variants.length > 0;

    // Auto-select first variant if only one
    React.useEffect(() => {
        if (hasVariants && !selectedVariant && product.variants && product.variants.length === 1) {
            setSelectedVariant(product.variants[0]);
        }
    }, [hasVariants, selectedVariant, product.variants]);

    // Reset on visibility change
    React.useEffect(() => {
        if (visible) {
            setSelectedVariant(initialVariant);
            setQuantity(initialQuantity);
        }
    }, [visible, initialVariant, initialQuantity]);

    const displayPrice = selectedVariant?.price || product.price || 0;
    const displayImage = selectedVariant?.image || product.image_url || (product.images && product.images[0]) || '';

    const totalPrice = displayPrice * quantity;

    const handleQuantityChange = useCallback((delta: number) => {
        setQuantity(prev => Math.max(1, prev + delta));
    }, []);

    const handleConfirm = useCallback(() => {
        onConfirm(selectedVariant, quantity);
    }, [selectedVariant, quantity, onConfirm]);

    // Check stock availability
    const stock = selectedVariant?.inventory ?? product.inventory;
    const isOutOfStock = stock !== undefined && stock <= 0;
    const exceedsStock = stock !== undefined && quantity > stock;

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onDismiss}
                contentContainerStyle={[
                    styles.modalContainer,
                    { backgroundColor: theme.colors.surface }
                ]}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text variant="titleLarge" style={{ color: theme.colors.onSurface }}>
                            Quick Buy
                        </Text>
                        <IconButton
                            icon="close"
                            size={24}
                            onPress={onDismiss}
                            accessibilityLabel="Close"
                        />
                    </View>

                    {/* Product Info */}
                    <View style={styles.productInfo}>
                        {displayImage ? (
                            <Image
                                source={{ uri: displayImage }}
                                style={styles.productImage}
                                resizeMode="cover"
                            />
                        ) : (
                            <View style={[styles.productImage, { backgroundColor: theme.colors.surfaceVariant }]}>
                                <IconButton icon="image-off" size={32} iconColor={theme.colors.onSurfaceVariant} />
                            </View>
                        )}
                        <View style={styles.productDetails}>
                            <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }} numberOfLines={2}>
                                {product.name || product.title}
                            </Text>
                            <Text variant="headlineSmall" style={{ color: theme.colors.primary, marginTop: 4 }}>
                                {formatCurrency(displayPrice, product.currency)}
                            </Text>
                        </View>
                    </View>

                    {/* Variant Selection */}
                    {hasVariants && (
                        <View style={styles.section}>
                            <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                                Select Variant
                            </Text>
                            <View style={styles.variantsContainer}>
                                {product.variants?.map((variant) => (
                                    <Chip
                                        key={variant.id}
                                        selected={selectedVariant?.id === variant.id}
                                        onPress={() => setSelectedVariant(variant)}
                                        style={styles.variantChip}
                                        mode={selectedVariant?.id === variant.id ? 'flat' : 'outlined'}
                                    >
                                        {variant.label || (variant as any).name || 'Variant'}
                                    </Chip>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Quantity Selector */}
                    <View style={styles.section}>
                        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                            Quantity
                        </Text>
                        <View style={styles.quantityControls}>
                            <IconButton
                                icon="minus"
                                size={20}
                                iconColor={theme.colors.onSurface}
                                onPress={() => handleQuantityChange(-1)}
                                style={[
                                    styles.quantityButton,
                                    { backgroundColor: theme.colors.surfaceVariant },
                                ]}
                                disabled={quantity <= 1}
                            />
                            <Text
                                variant="titleMedium"
                                style={{ color: theme.colors.onSurface, minWidth: 40, textAlign: 'center' }}
                            >
                                {quantity}
                            </Text>
                            <IconButton
                                icon="plus"
                                size={20}
                                iconColor={theme.colors.onSurface}
                                onPress={() => handleQuantityChange(1)}
                                style={[
                                    styles.quantityButton,
                                    { backgroundColor: theme.colors.surfaceVariant },
                                ]}
                                disabled={exceedsStock}
                            />
                        </View>
                        {stock !== undefined && (
                            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
                                {stock} available
                            </Text>
                        )}
                        {exceedsStock && (
                            <Text variant="bodySmall" style={{ color: theme.colors.error, marginTop: 4 }}>
                                Only {stock} available
                            </Text>
                        )}
                    </View>

                    {/* Total */}
                    <Surface style={styles.totalSection} elevation={0}>
                        <View style={styles.totalRow}>
                            <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                                Total
                            </Text>
                            <Text variant="headlineSmall" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                                {formatCurrency(totalPrice, product.currency)}
                            </Text>
                        </View>
                        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                            {quantity} {quantity === 1 ? 'item' : 'items'}
                        </Text>
                    </Surface>

                    {/* Actions */}
                    <View style={styles.actions}>
                        {isOutOfStock ? (
                            <Button
                                mode="contained"
                                disabled
                                style={styles.actionButton}
                            >
                                Out of Stock
                            </Button>
                        ) : (
                            <Button
                                mode="contained"
                                onPress={handleConfirm}
                                icon="flash"
                                style={styles.actionButton}
                                disabled={exceedsStock}
                            >
                                Proceed to Checkout
                            </Button>
                        )}
                        <Button
                            mode="outlined"
                            onPress={onDismiss}
                            style={styles.actionButton}
                        >
                            Cancel
                        </Button>
                    </View>
                </ScrollView>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        marginHorizontal: 20,
        marginVertical: 60,
        borderRadius: 16,
        maxHeight: '80%',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    productInfo: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 12,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    productDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontWeight: '600',
        marginBottom: 12,
    },
    variantsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    variantChip: {
        marginBottom: 8,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    quantityButton: {
        margin: 0,
    },
    totalSection: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    actions: {
        gap: 12,
    },
    actionButton: {
        borderRadius: 8,
    },
});
