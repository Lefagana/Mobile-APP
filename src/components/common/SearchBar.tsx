import React from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, TextInputProps } from 'react-native';
import { Searchbar, IconButton, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { CustomerStackParamList } from '../../navigation/types';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useLocalization } from '../../contexts/LocalizationContext';

type SearchScreenNavigationProp = StackNavigationProp<CustomerStackParamList, 'Search'>;

export interface SearchBarProps extends Omit<TextInputProps, 'onChangeText'> {
  value?: string;
  onChangeText?: (text: string) => void;
  onPress?: () => void;
  placeholder?: string;
  showCameraButton?: boolean;
  onCameraPress?: () => void;
  editable?: boolean;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value = '',
  onChangeText,
  onPress,
  placeholder,
  showCameraButton = true,
  onCameraPress,
  editable = true,
  autoFocus = false,
  style,
  ...textInputProps
}) => {
  const theme = useTheme();
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const { t } = useLocalization();
  const placeholderText = placeholder ?? t('home.searchProduct');

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.navigate('Search');
    }
  };

  const handleCameraPress = () => {
    if (onCameraPress) {
      onCameraPress();
    } else {
      // Navigate to camera search modal
      // navigation.navigate('CameraSearch');
    }
  };

  if (!editable && onPress) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.surfaceVariant,
            borderColor: theme.colors.outlineVariant,
          },
          style,
        ]}
        activeOpacity={0.7}
        accessibilityRole="search"
        accessibilityLabel={placeholderText}
        accessibilityHint={t('a11y.openSearchHint')}
      >
        <View style={styles.content}>
          <IconButton
            icon="magnify"
            size={20}
            iconColor={theme.colors.onSurfaceVariant}
            accessibilityLabel={t('a11y.searchIcon')}
            accessibilityRole="image"
          />
          <View style={styles.textContainer}>
            <TextInput
              value={value || placeholderText}
              placeholder={placeholderText}
              placeholderTextColor={theme.colors.onSurfaceVariant}
              editable={false}
              style={[styles.input, { color: value ? theme.colors.onSurface : theme.colors.onSurfaceVariant }]}
              accessibilityLabel={placeholderText}
              accessibilityRole="search"
            />
          </View>
          {showCameraButton && (
            <IconButton
              icon="camera"
              size={20}
              iconColor={theme.colors.onSurfaceVariant}
              onPress={handleCameraPress}
              accessibilityLabel={t('a11y.cameraSearchLabel')}
              accessibilityRole="button"
              accessibilityHint={t('a11y.cameraSearchHint')}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surfaceVariant,
          borderColor: theme.colors.outlineVariant,
        },
        style,
      ]}
    >
      <View style={styles.content}>
        <IconButton
          icon="magnify"
          size={20}
          iconColor={theme.colors.onSurfaceVariant}
          accessibilityLabel={t('a11y.searchIcon')}
          accessibilityRole="image"
        />
        <View style={styles.textContainer}>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholderText}
            placeholderTextColor={theme.colors.onSurfaceVariant}
            style={[styles.input, { color: theme.colors.onSurface }]}
            autoFocus={autoFocus}
            accessibilityLabel={placeholderText}
            accessibilityRole="search"
            accessibilityHint={t('a11y.searchInputHint')}
            {...textInputProps}
          />
        </View>
        {showCameraButton && (
          <IconButton
            icon="camera"
            size={20}
            iconColor={theme.colors.onSurfaceVariant}
            onPress={handleCameraPress}
            accessibilityLabel={t('a11y.cameraSearchLabel')}
            accessibilityRole="button"
            accessibilityHint={t('a11y.cameraSearchHint')}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  textContainer: {
    flex: 1,
    paddingVertical: 4,
  },
  input: {
    fontSize: 16,
    padding: 0,
    margin: 0,
  },
});

export default SearchBar;
