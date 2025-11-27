import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { Surface, Text, Button, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { formatCurrency } from '../../utils/formatters';

interface ProductGridItemProps {
    product: {
        id: string;
        title: string;
        price: number;
        images: string[];
        currency: string;
    };
    onPress: () => void;
    onBuy: () => void;
    width?: number;
}

export const ProductGridItem = ({ product, onPress, onBuy, width }: ProductGridItemProps) => {
    const theme = useTheme();
    const screenWidth = Dimensions.get('window').width;
    const cardWidth = width || (screenWidth - 52) / 2;

    return (
        <Surface
            style={[styles.container, { width: cardWidth }]}
            elevation={2}
            onTouchEnd={onPress}
            accessibilityRole="button"
            accessibilityLabel={`${product.title}, price ${formatCurrency(product.price)}`}
        >
            <View style={styles.imageContainer}>
                {product.images[0] ? (
                    <Image source={{ uri: product.images[0] }} style={styles.image} />
                ) : (
                    <MaterialCommunityIcons name="image-outline" size={32} color="#CCC" />
                )}
            </View>
            <View style={styles.infoContainer}>
                <Text variant="bodyMedium" numberOfLines={1} style={styles.title}>{product.title}</Text>
                <Text variant="titleMedium" style={styles.price}>{formatCurrency(product.price)}</Text>
                <Button
                    mode="contained"
                    compact
                    style={styles.button}
                    labelStyle={styles.buttonLabel}
                    onPress={onBuy}
                >
                    Buy
                </Button>
            </View>
        </Surface>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
    },
    imageContainer: {
        height: 120,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    infoContainer: {
        padding: 12,
    },
    title: {
        fontWeight: '600',
        marginBottom: 4,
    },
    price: {
        fontWeight: 'bold',
        color: '#2196F3',
        marginBottom: 8,
    },
    button: {
        borderRadius: 8,
    },
    buttonLabel: {
        fontSize: 12,
        marginVertical: 4,
    },
});
