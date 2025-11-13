import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Chip, useTheme } from 'react-native-paper';
import { useLocalization } from '../../contexts/LocalizationContext';

export interface Category {
  id: string;
  name: string;
  icon?: string;
}

export interface CategoryTabsProps {
  categories?: Category[];
  selectedCategoryId?: string;
  onCategorySelect: (categoryId: string) => void;
}

// Default ids; labels will be translated at render time
const DEFAULT_CATEGORIES: Category[] = [
  { id: 'all', name: 'all' },
  { id: 'fashion', name: 'fashion' },
  { id: 'electronics', name: 'electronics' },
  { id: 'kids', name: 'kids' },
  { id: 'shoes', name: 'shoes' },
];

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories = DEFAULT_CATEGORIES,
  selectedCategoryId = 'all',
  onCategorySelect,
}) => {
  const theme = useTheme();
  const { t } = useLocalization();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
    >
      {categories.map(category => {
        const isSelected = category.id === selectedCategoryId;
        const label = category.name in (t('home', { returnObjects: true }) as any)
          ? t(`home.${category.name}`)
          : category.name;
        return (
          <Chip
            key={category.id}
            mode={isSelected ? 'flat' : 'outlined'}
            selected={isSelected}
            onPress={() => onCategorySelect(category.id)}
            style={[
              styles.chip,
              isSelected && {
                backgroundColor: theme.colors.primaryContainer,
                borderColor: theme.colors.primary,
              },
            ]}
            textStyle={{
              color: isSelected ? theme.colors.onPrimaryContainer : theme.colors.onSurface,
              fontWeight: isSelected ? '600' : '400',
            }}
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityHint={t('common.filter')}
            accessibilityState={{ selected: isSelected }}
          >
            {label}
          </Chip>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    marginVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
    paddingRight: 24, // Extra padding for scroll indicator space
  },
  chip: {
    marginRight: 8,
    minHeight: 36,
  },
});

export default CategoryTabs;
