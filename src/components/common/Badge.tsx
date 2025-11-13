import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export interface BadgeProps {
  count?: number;
  label?: string;
  variant?: 'primary' | 'secondary' | 'error' | 'success' | 'info' | 'warning';
  size?: 'small' | 'medium' | 'large';
  max?: number; // Max count before showing "99+"
  visible?: boolean;
  style?: ViewStyle;
  textStyle?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  count,
  label,
  variant = 'error',
  size = 'medium',
  max = 99,
  visible = true,
  style,
  textStyle,
}) => {
  const theme = useTheme();

  if (!visible || (count === undefined && !label)) {
    return null;
  }

  const variantColors = {
    primary: theme.colors.primary,
    secondary: theme.colors.secondary,
    error: theme.colors.error,
    success: theme.colors.primaryContainer,
    info: theme.colors.primary,
    warning: '#FF9800',
  };

  const sizeStyles = {
    small: {
      container: { width: 16, height: 16, borderRadius: 8 },
      text: { fontSize: 10, lineHeight: 12 },
    },
    medium: {
      container: { width: 20, height: 20, borderRadius: 10, paddingHorizontal: 6 },
      text: { fontSize: 12, lineHeight: 14 },
    },
    large: {
      container: { width: 24, height: 24, borderRadius: 12, paddingHorizontal: 8 },
      text: { fontSize: 14, lineHeight: 16 },
    },
  };

  const displayText = label || (count !== undefined ? (count > max ? `${max}+` : count.toString()) : '');

  return (
    <View
      style={[
        styles.container,
        sizeStyles[size].container,
        {
          backgroundColor: variantColors[variant],
          minWidth: size === 'small' ? 16 : undefined,
        },
        style,
      ]}
      accessibilityLabel={label || (count !== undefined ? `${count} items` : 'Badge')}
      accessibilityRole="text"
    >
      <Text
        variant={size === 'small' ? 'labelSmall' : size === 'large' ? 'labelLarge' : 'labelMedium'}
        style={[
          styles.text,
          sizeStyles[size].text,
          {
            color: variant === 'error' || variant === 'success' ? theme.colors.onError : theme.colors.onPrimary,
          },
          textStyle,
        ]}
        numberOfLines={1}
      >
        {displayText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -8,
    right: -8,
    zIndex: 1,
  },
  text: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default Badge;
