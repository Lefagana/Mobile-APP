import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text, Button, IconButton, useTheme } from 'react-native-paper';

export interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'inbox-outline',
  title,
  description,
  actionLabel,
  onAction,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <IconButton
        icon={icon}
        size={64}
        iconColor={theme.colors.onSurfaceVariant}
        style={styles.icon}
        accessibilityLabel={`${title} icon`}
        accessibilityRole="image"
      />
      <Text
        variant="titleMedium"
        style={[styles.title, { color: theme.colors.onSurface }]}
        accessibilityRole="header"
      >
        {title}
      </Text>
      {description && (
        <Text
          variant="bodyMedium"
          style={[styles.description, { color: theme.colors.onSurfaceVariant }]}
          accessibilityRole="text"
        >
          {description}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button
          mode="contained"
          onPress={onAction}
          style={styles.button}
          accessibilityLabel={actionLabel}
          accessibilityRole="button"
          accessibilityHint={`Performs action: ${actionLabel.toLowerCase()}`}
        >
          {actionLabel}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 300,
  },
  button: {
    marginTop: 8,
  },
});

export default EmptyState;
