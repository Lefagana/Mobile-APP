import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, useTheme, Button } from 'react-native-paper';
import { Vendor } from '../../types';
import { VendorLogo } from '../product/VendorLogo';
import { useLocalization } from '../../contexts/LocalizationContext';

export interface ExploreSectionProps {
  vendors: Vendor[];
  onVendorPress?: (vendor: Vendor) => void;
  onBrowseAllPress?: () => void;
}

export const ExploreSection: React.FC<ExploreSectionProps> = ({
  vendors,
  onVendorPress,
  onBrowseAllPress,
}) => {
  const theme = useTheme();
  const { t } = useLocalization();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
          {t('home.explore')}
        </Text>
        <Button
          mode="text"
          onPress={onBrowseAllPress}
          icon="arrow-right"
          compact
          textColor={theme.colors.primary}
          accessibilityLabel={t('home.storesBrowse')}
          accessibilityRole="button"
          accessibilityHint={t('home.storesBrowse')}
        >
          {t('home.storesBrowse')}
        </Button>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        nestedScrollEnabled={true}
      >
        {vendors.map(vendor => (
          <TouchableOpacity
            key={vendor.id}
            style={[styles.vendorItem,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.outlineVariant,
              },
            ]}
            onPress={() => onVendorPress?.(vendor)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`${vendor.shop_name}`}
            accessibilityHint={t('home.explore')}
          >
            <VendorLogo vendor={vendor} size={60} />
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
  scrollView: {
    flexGrow: 0,
    flexShrink: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  vendorItem: {
    marginHorizontal: 4,
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
});

export default ExploreSection;
