import React from 'react';
import { Modal, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../navigation/types';
import { createShadow } from '../../utils/shadows';
import { useLocalization } from '../../contexts/LocalizationContext';

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface LoginPromptModalProps {
  visible: boolean;
  onDismiss: () => void;
  message?: string;
  onLoginSuccess?: () => void;
}

export const LoginPromptModal: React.FC<LoginPromptModalProps> = ({
  visible,
  onDismiss,
  message = '',
  onLoginSuccess,
}) => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { t } = useLocalization();

  const handleLogin = () => {
    // Dismiss modal immediately before navigation
    onDismiss();
    // Navigate to Login page directly
    navigation.navigate('Auth', {
      screen: 'Login',
      params: undefined,
    });
    // Call onLoginSuccess after navigation if needed
    if (onLoginSuccess) {
      setTimeout(() => {
        onLoginSuccess();
      }, 300);
    }
  };

  const handleCancel = () => {
    // Dismiss the modal when cancel is pressed
    onDismiss();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <TouchableWithoutFeedback onPress={onDismiss}>
        <View
          style={styles.overlay}
          accessibilityLabel="Login required"
          accessibilityHint="Dialog asking you to login to continue"
          accessibilityRole="alert"
        >
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View
              style={[
                styles.modal,
                { backgroundColor: theme.colors.surface },
              ]}
              accessibilityViewIsModal
              accessible
              accessibilityLabel="Login prompt dialog"
            >
              <View style={styles.iconContainer}>
                <Text variant="bodyLarge" style={[styles.icon, { color: theme.colors.primary }]}>
                  🔒
                </Text>
              </View>
              <Text
                variant="titleLarge"
                style={[
                  styles.title,
                  { color: theme.colors.onSurface },
                ]}
                accessibilityRole="header"
                accessibilityLabel="Login required"
              >
                Login Required
              </Text>
              <Text
                variant="bodyMedium"
                style={[
                  styles.message,
                  { color: theme.colors.onSurfaceVariant },
                ]}
                accessibilityLabel={message}
              >
                {message}
              </Text>
              <View style={styles.actions}>
                <Button
                  mode="outlined"
                  onPress={handleCancel}
                  style={styles.button}
                  contentStyle={styles.buttonContent}
                  accessibilityRole="button"
                  accessibilityLabel="Cancel"
                  accessibilityHint="Dismiss this dialog"
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleLogin}
                  style={[styles.button, styles.loginButton]}
                  contentStyle={styles.buttonContent}
                  accessibilityRole="button"
                  accessibilityLabel="Login"
                  accessibilityHint="Go to login and continue"
                >
                  Login
                </Button>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    ...createShadow({
      color: '#000',
      offset: { width: 0, height: 4 },
      opacity: 0.3,
      radius: 8,
    }),
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '600',
  },
  message: {
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
  },
  loginButton: {
    marginLeft: 8,
  },
  buttonContent: {
    paddingVertical: 4,
  },
});

