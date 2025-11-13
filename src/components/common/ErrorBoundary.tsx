import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { ScreenContainer } from './ScreenContainer';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to error reporting service (e.g., Sentry, Firebase Crashlytics)
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  onReset: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, onReset }) => {
  const theme = useTheme();

  return (
    <ScreenContainer scrollable={false}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text variant="displaySmall" style={[styles.title, { color: theme.colors.error }]}>
            Oops! Something went wrong
          </Text>
          <Text variant="bodyLarge" style={[styles.message, { color: theme.colors.onSurfaceVariant }]}>
            We encountered an unexpected error. Please try again.
          </Text>
          
          {__DEV__ && error && (
            <View style={[styles.errorDetails, { backgroundColor: theme.colors.errorContainer }]}>
              <Text variant="bodySmall" style={[styles.errorText, { color: theme.colors.onErrorContainer }]}>
                {error.toString()}
              </Text>
              {error.stack && (
                <Text variant="bodySmall" style={[styles.errorText, { color: theme.colors.onErrorContainer, marginTop: 8 }]}>
                  {error.stack.split('\n').slice(0, 5).join('\n')}
                </Text>
              )}
            </View>
          )}

          <View style={styles.actions}>
            <Button
              mode="contained"
              onPress={onReset}
              style={styles.button}
              accessibilityLabel="Retry after error"
              accessibilityRole="button"
              accessibilityHint="Attempts to reload the app and recover from the error"
            >
              Try Again
            </Button>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  message: {
    textAlign: 'center',
    marginBottom: 24,
  },
  errorDetails: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    width: '100%',
    maxHeight: 200,
  },
  errorText: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
  actions: {
    width: '100%',
  },
  button: {
    minWidth: 200,
  },
});

export default ErrorBoundary;

