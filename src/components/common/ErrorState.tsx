import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text, Button, IconButton, useTheme } from 'react-native-paper';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  style?: ViewStyle;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error. Please try again.',
  onRetry,
  retryLabel = 'Retry',
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <IconButton
        icon="alert-circle-outline"
        size={64}
        iconColor={theme.colors.error}
        style={styles.icon}
        accessibilityLabel="Error icon"
        accessibilityRole="image"
      />
      <Text
        variant="titleMedium"
        style={[styles.title, { color: theme.colors.onSurface }]}
        accessibilityRole="alert"
        accessibilityLiveRegion="assertive"
      >
        {title}
      </Text>
      {message && (
        <Text
          variant="bodyMedium"
          style={[styles.message, { color: theme.colors.onSurfaceVariant }]}
          accessibilityRole="text"
        >
          {message}
        </Text>
      )}
      {onRetry && (
        <Button
          mode="contained"
          onPress={onRetry}
          style={styles.button}
          accessibilityLabel={retryLabel}
          accessibilityRole="button"
          accessibilityHint="Retries the failed operation"
        >
          {retryLabel}
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
  message: {
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 300,
  },
  button: {
    marginTop: 8,
  },
});

export default ErrorState;
