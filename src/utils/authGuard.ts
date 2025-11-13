import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../navigation/types';

type NavigationProp = StackNavigationProp<RootStackParamList>;

/**
 * Hook to guard actions that require authentication
 * Returns a function that checks if user is authenticated before executing an action
 * If not authenticated, it will trigger the login prompt
 */
export const useAuthGuard = () => {
  const { isAuthenticated } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [actionMessage, setActionMessage] = useState<string>('');

  /**
   * Require authentication before executing an action
   * @param callback - The action to execute if authenticated
   * @param actionName - Optional description of the action (shown in login prompt)
   */
  const requireAuth = useCallback(
    (callback: () => void, actionName?: string) => {
      if (isAuthenticated) {
        callback();
      } else {
        // Store the action to execute after login
        setPendingAction(() => callback);
        setActionMessage(
          actionName
            ? `Please login to ${actionName}`
            : 'Please login to continue'
        );
        setShowLoginPrompt(true);
      }
    },
    [isAuthenticated]
  );

  /**
   * Navigate directly to login screen
   * This is used when we want to redirect to login without showing a modal
   */
  const navigateToLogin = useCallback(() => {
    navigation.navigate('Auth', {
      screen: 'PhoneInput',
      params: undefined,
    });
  }, [navigation]);

  /**
   * Handle successful login - execute pending action if any
   */
  const handleLoginSuccess = useCallback(() => {
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
    setShowLoginPrompt(false);
    setActionMessage('');
  }, [pendingAction]);

  /**
   * Dismiss the login prompt without logging in
   */
  const dismissLoginPrompt = useCallback(() => {
    setShowLoginPrompt(false);
    setPendingAction(null);
    setActionMessage('');
  }, []);

  return {
    requireAuth,
    isAuthenticated,
    showLoginPrompt,
    actionMessage,
    navigateToLogin,
    handleLoginSuccess,
    dismissLoginPrompt,
    setShowLoginPrompt,
  };
};

