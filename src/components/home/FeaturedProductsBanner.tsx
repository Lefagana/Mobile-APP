import React, { useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Image, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';

export interface FeaturedProductsBannerProps {
  products: Product[];
  onProductPress?: (product: Product) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const FeaturedProductsBanner: React.FC<FeaturedProductsBannerProps> = ({
  products,
  onProductPress,
}) => {
  const theme = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!products.length) {
    return null;
  }

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
        Featured Products
      </Text>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {products.map((product, index) => {
          const imageUri = product.image_url || product.images?.[0];
          return (
            <TouchableOpacity
              key={product.id}
              style={[styles.slide, { width: SCREEN_WIDTH - 32 }]}
              onPress={() => onProductPress?.(product)}
              activeOpacity={0.9}
            >
              <View
                style={[
                  styles.bannerContainer,
                  {
                    backgroundColor: theme.colors.primaryContainer,
                  },
                ]}
              >
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={styles.bannerImage} resizeMode="cover" />
                ) : (
                  <View style={[styles.placeholder, { backgroundColor: theme.colors.surfaceVariant }]}>
                    <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
                      {product.name || product.title}
                    </Text>
                  </View>
                )}
                <View style={styles.overlay}>
                  <View style={styles.content}>
                    <Text variant="headlineSmall" style={[styles.productTitle, { color: '#FFFFFF' }]}>
                      {product.name || product.title}
                    </Text>
                    <Text variant="titleLarge" style={[styles.price, { color: '#FFFFFF' }]}>
                      {formatCurrency(product.price)}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {products.length > 1 && (
        <View style={styles.dotsContainer}>
          {products.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === currentIndex ? theme.colors.primary : theme.colors.outlineVariant,
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  title: {
    paddingHorizontal: 16,
    marginBottom: 12,
    fontWeight: '600',
  },
  slide: {
    marginHorizontal: 16,
  },
  bannerContainer: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  productTitle: {
    flex: 1,
    fontWeight: 'bold',
  },
  price: {
    fontWeight: 'bold',
    marginLeft: 12,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default FeaturedProductsBanner;
