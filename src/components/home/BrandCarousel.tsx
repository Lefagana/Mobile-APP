import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Vendor } from '../../types';
import { VendorLogo } from '../product/VendorLogo';

export interface BrandCarouselProps {
  brands: Vendor[];
  onBrandPress?: (vendor: Vendor) => void;
}

export const BrandCarousel: React.FC<BrandCarouselProps> = ({ brands, onBrandPress }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {brands.map(brand => (
          <TouchableOpacity
            key={brand.id}
            style={[
              styles.brandItem,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.outlineVariant,
              },
            ]}
            onPress={() => onBrandPress?.(brand)}
            activeOpacity={0.7}
          >
            <VendorLogo vendor={brand} size={50} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  brandItem: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
});

export default BrandCarousel;
