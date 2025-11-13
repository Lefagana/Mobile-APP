import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { CustomerStackParamList } from '../../navigation/types';
import { createShadow } from '../../utils/shadows';

export type MartType = 'local' | 'international';

export interface MartSelectorProps {
  selected: MartType;
  onSelect: (type: MartType) => void;
}

export const MartSelector: React.FC<MartSelectorProps> = ({ selected, onSelect }) => {
  const theme = useTheme();
  const { t } = useLocalization();
  const navigation = useNavigation<StackNavigationProp<CustomerStackParamList>>();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          styles.localButton,
          { backgroundColor: theme.colors.primaryContainer, borderColor: theme.colors.primary },
        ]}
        onPress={() => {
          onSelect('local');
          navigation.navigate('StateMarkets');
        }}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={t('home.localMart')}
        accessibilityHint={t('home.categories')}
        accessibilityState={{ selected: selected === 'local' }}
      >
        <View style={styles.buttonContent}>
          <View style={styles.leftContent}>
            <MaterialCommunityIcons
              name="map-marker"
              size={22}
              color={theme.colors.onPrimaryContainer}
            />
            <Text
              variant="labelLarge"
              numberOfLines={1}
              style={[
                styles.buttonText,
                { color: theme.colors.onPrimaryContainer },
              ]}
            >
              {t('home.localMart')}
            </Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={22}
            color={theme.colors.onPrimaryContainer}
            style={{ opacity: 0.7 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          styles.internationalButton,
          { backgroundColor: theme.colors.primaryContainer, borderColor: theme.colors.primary },
        ]}
        onPress={() => {
          onSelect('international');
          navigation.navigate('InternationalComingSoon');
        }}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={t('home.internationalMart')}
        accessibilityHint={t('home.categories')}
        accessibilityState={{ selected: selected === 'international' }}
      >
        <View style={styles.buttonContent}>
          <View style={styles.leftContent}>
            <MaterialCommunityIcons
              name="earth"
              size={22}
              color={theme.colors.onPrimaryContainer}
            />
            <Text
              variant="labelLarge"
              numberOfLines={1}
              style={[
                styles.buttonText,
                { color: theme.colors.onPrimaryContainer },
              ]}
            >
              {t('home.internationalMart')}
            </Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={22}
            color={theme.colors.onPrimaryContainer}
            style={{ opacity: 0.7 }}
          />
        </View>
      </TouchableOpacity>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 12,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 16,
    ...createShadow({ color: '#000', offset: { width: 0, height: 2 }, opacity: 0.08, radius: 6 }),
  },
  buttonContent: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  rightSpacer: {
    width: 0,
  },
  localButton: {
    borderRightWidth: 0,
  },
  internationalButton: {
    borderLeftWidth: 0,
  },
  buttonText: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  comingSoonChip: {
    height: 0,
  },
});

export default MartSelector;
