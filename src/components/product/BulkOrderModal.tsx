import React, { useState, useMemo, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Modal, Portal, Text, Button, IconButton, useTheme, Divider, Surface, Chip } from 'react-native-paper';
import { Product, ProductVariant } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface BulkOrderModalProps {
    visible: boolean;
    onDismiss: () => void;
    product: Product;
    onAddToCart: (items: { variantId?: string; quantity: number }[]) => void;
    onBuyNow: (items: { variantId?: string; quantity: number }[]) => void;
}

export const BulkOrderModal: React.FC<BulkOrderModalProps> = ({
    visible,
    onDismiss,
    product,
    onAddToCart,
    onBuyNow,
}) => {
    const theme = useTheme();
    const [quantities, setQuantities] = useState<Record<string, number>>({});

    // Initialize quantities when modal opens or product changes
    useEffect(() => {
        if (visible) {
            setQuantities({});
        }
    }, [visible, product.id]);

    const variants = useMemo(() => product.variants || [], [product]);
    const hasVariants = variants.length > 0;

    const handleQuantityChange = (id: string, delta: number) => {
        setQuantities((prev) => {
            const current = prev[id] || 0;
            const next = Math.max(0, current + delta);
            return { ...prev, [id]: next };
        });
    };

    const totalQuantity = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);

    const totalPrice = useMemo(() => {
        if (hasVariants) {
            return variants.reduce((sum, variant) => {
                const qty = quantities[variant.id] || 0;
                return sum + (variant.price * qty);
            }, 0);
        }
        // Fallback for no variants (though this modal is primarily for variants)
        const qty = quantities['default'] || 0;
        return product.price * qty;
    }, [quantities, variants, hasVariants, product.price]);

    const handleAddToCart = () => {
        const items = Object.entries(quantities)
            .filter(([_, qty]) => qty > 0)
            .map(([variantId, quantity]) => ({
                variantId: variantId === 'default' ? undefined : variantId,
                quantity,
            }));

        if (items.length > 0) {
            onAddToCart(items);
            onDismiss();
        }
    };

    const handleBuyNow = () => {
        const items = Object.entries(quantities)
            .filter(([_, qty]) => qty > 0)
            .map(([variantId, quantity]) => ({
                variantId: variantId === 'default' ? undefined : variantId,
                quantity,
            }));

        if (items.length > 0) {
            onBuyNow(items);
            onDismiss();
        }
    };

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onDismiss}
                contentContainerStyle={[styles.modalContent, { backgroundColor: theme.colors.surface }]}
            >
                <View style={styles.header}>
                    <Text variant="titleLarge" style={{ color: theme.colors.onSurface }}>
                        Retailer Order
                    </Text>
                    <IconButton icon="close" onPress={onDismiss} />
                </View>

                <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
                    Select quantities for each variant
                </Text>

                <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {hasVariants ? (
                        variants.map((variant) => {
                            const variantImage = variant.image || product.images?.[0] || product.image_url;
                            const colorAttr = variant.attributes?.color || variant.attributes?.Color;

                            return (
                                <View key={variant.id} style={styles.variantRow}>
                                    {/* Variant Image */}
                                    {variantImage && (
                                        <View style={styles.variantImageContainer}>
                                            <Image
                                                source={{ uri: variantImage }}
                                                style={styles.variantImage}
                                                resizeMode="cover"
                                            />
                                        </View>
                                    )}

                                    {/* Variant Info */}
                                    <View style={styles.variantInfo}>
                                        <Text variant="bodyLarge" style={{ fontWeight: '500' }}>
                                            {variant.label}
                                        </Text>

                                        {/* Attributes */}
                                        {variant.attributes && (
                                            <View style={styles.attributesContainer}>
                                                {Object.entries(variant.attributes).map(([key, value]) => {
                                                    const isColor = key.toLowerCase() === 'color';

                                                    if (isColor) {
                                                        return (
                                                            <View key={key} style={styles.colorAttribute}>
                                                                <View
                                                                    style={[
                                                                        styles.colorIndicator,
                                                                        { backgroundColor: value.toLowerCase() },
                                                                    ]}
                                                                />
                                                                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                                                    {value}
                                                                </Text>
                                                            </View>
                                                        );
                                                    }

                                                    return (
                                                        <Chip
                                                            key={key}
                                                            mode="outlined"
                                                            compact
                                                            style={styles.attributeChip}
                                                            textStyle={{ fontSize: 11 }}
                                                        >
                                                            {key}: {value}
                                                        </Chip>
                                                    );
                                                })}
                                            </View>
                                        )}

                                        <Text variant="bodyMedium" style={{ color: theme.colors.primary, marginTop: 4 }}>
                                            {formatCurrency(variant.price, product.currency)}
                                        </Text>
                                        {variant.inventory !== undefined && (
                                            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                                {variant.inventory} available
                                            </Text>
                                        )}
                                    </View>

                                    {/* Quantity Controls */}
                                    <View style={styles.quantityControls}>
                                        <IconButton
                                            icon="minus"
                                            size={20}
                                            mode="contained-tonal"
                                            onPress={() => handleQuantityChange(variant.id, -1)}
                                            disabled={(quantities[variant.id] || 0) === 0}
                                        />
                                        <Text variant="titleMedium" style={[styles.quantityText, { color: theme.colors.onSurface }]}>
                                            {quantities[variant.id] || 0}
                                        </Text>
                                        <IconButton
                                            icon="plus"
                                            size={20}
                                            mode="contained-tonal"
                                            onPress={() => handleQuantityChange(variant.id, 1)}
                                        />
                                    </View>
                                </View>
                            );
                        })
                    ) : (
                        <View style={styles.variantRow}>
                            <View style={styles.variantInfo}>
                                <Text variant="bodyLarge" style={{ fontWeight: '500' }}>
                                    {product.name || product.title}
                                </Text>
                                <Text variant="bodyMedium" style={{ color: theme.colors.primary }}>
                                    {formatCurrency(product.price, product.currency)}
                                </Text>
                            </View>
                            <View style={styles.quantityControls}>
                                <IconButton
                                    icon="minus"
                                    size={20}
                                    mode="contained-tonal"
                                    onPress={() => handleQuantityChange('default', -1)}
                                    disabled={(quantities['default'] || 0) === 0}
                                />
                                <Text variant="titleMedium" style={[styles.quantityText, { color: theme.colors.onSurface }]}>
                                    {quantities['default'] || 0}
                                </Text>
                                <IconButton
                                    icon="plus"
                                    size={20}
                                    mode="contained-tonal"
                                    onPress={() => handleQuantityChange('default', 1)}
                                />
                            </View>
                        </View>
                    )}
                </ScrollView>

                <Divider />

                <View style={styles.footer}>
                    <View style={styles.totalRow}>
                        <Text variant="titleMedium">Total Items: {totalQuantity}</Text>
                        <Text variant="titleLarge" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                            {formatCurrency(totalPrice, product.currency)}
                        </Text>
                    </View>

                    <View style={styles.actionButtons}>
                        <Button
                            mode="outlined"
                            onPress={handleAddToCart}
                            disabled={totalQuantity === 0}
                            style={styles.button}
                            icon="cart-plus"
                        >
                            Add to Cart
                        </Button>
                        <Button
                            mode="contained"
                            onPress={handleBuyNow}
                            disabled={totalQuantity === 0}
                            style={styles.button}
                            icon="flash"
                        >
                            Buy Now
                        </Button>
                    </View>
                </View>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    modalContent: {
        margin: 20,
        borderRadius: 12,
        padding: 20,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    subtitle: {
        marginBottom: 16,
    },
    scrollContent: {
        marginBottom: 16,
    },
    variantRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
        paddingVertical: 8,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#E0E0E0',
        gap: 12,
    },
    variantImageContainer: {
        width: 60,
        height: 60,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    variantImage: {
        width: '100%',
        height: '100%',
    },
    variantInfo: {
        flex: 1,
    },
    attributesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: 4,
        marginBottom: 4,
    },
    colorAttribute: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    colorIndicator: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#CCCCCC',
    },
    attributeChip: {
        height: 24,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    quantityText: {
        minWidth: 30,
        textAlign: 'center',
    },
    footer: {
        marginTop: 16,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    button: {
        flex: 1,
    },
});
