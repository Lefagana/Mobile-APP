import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Chip, useTheme } from 'react-native-paper';
import { Product } from '../../types';
import { ProductCard } from '../product/ProductCard';

export interface AIPersonsChoiceProps {
  products: Product[];
  personalizedProducts?: Product[];
  onProductPress?: (product: Product) => void;
}

export const AIPersonsChoice: React.FC<AIPersonsChoiceProps> = ({
  products,
  personalizedProducts,
  onProductPress,
}) => {
  const theme = useTheme();
  const [isPersonalized, setIsPersonalized] = useState(false);

  const displayProducts = isPersonalized && personalizedProducts ? personalizedProducts : products;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
          AI Person's Choice
        </Text>
        <View style={styles.toggleContainer}>
          <Chip
            mode={!isPersonalized ? 'flat' : 'outlined'}
            selected={!isPersonalized}
            onPress={() => setIsPersonalized(false)}
            compact
            style={styles.toggleChip}
          >
            All
          </Chip>
          <Chip
            mode={isPersonalized ? 'flat' : 'outlined'}
            selected={isPersonalized}
            onPress={() => setIsPersonalized(true)}
            compact
            style={styles.toggleChip}
          >
            For You
          </Chip>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {displayProducts.map(product => (
          <View key={product.id} style={styles.productWrapper}>
            <ProductCard product={product} onPress={onProductPress} showAddToCart={true} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontWeight: '600',
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleChip: {
    height: 28,
  },
  scrollContent: {
    paddingHorizontal: 12,
  },
  productWrapper: {
    width: 180,
    marginHorizontal: 4,
  },
});

export default AIPersonsChoice;
