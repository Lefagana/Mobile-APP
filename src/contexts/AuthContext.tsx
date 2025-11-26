import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { User, AuthTokens } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  tokens: AuthTokens | null;
  login: (phone: string, otp: string, sessionId: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'wakanda_access_token';
const REFRESH_TOKEN_STORAGE_KEY = 'wakanda_refresh_token';
const USER_STORAGE_KEY = 'wakanda_user';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load auth state from secure storage on mount
    loadAuthState();
  }, []);

  const loadAuthState = async () => {
    try {
      const [accessToken, refreshToken, userStr] = await Promise.all([
        SecureStore.getItemAsync(TOKEN_STORAGE_KEY).catch(() => null),
        SecureStore.getItemAsync(REFRESH_TOKEN_STORAGE_KEY).catch(() => null),
        SecureStore.getItemAsync(USER_STORAGE_KEY).catch(() => null),
      ]);

      if (accessToken && refreshToken && userStr) {
        try {
          const userData = JSON.parse(userStr) as User;
          setTokens({ access_token: accessToken, refresh_token: refreshToken });
          setUser(userData);
        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
        }
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (phone: string, otp: string, sessionId: string) => {
    try {
      const response = await api.auth.verifyOTP(sessionId, otp);

      // Store tokens securely
      try {
        await Promise.all([
          SecureStore.setItemAsync(TOKEN_STORAGE_KEY, response.access_token),
          SecureStore.setItemAsync(REFRESH_TOKEN_STORAGE_KEY, response.refresh_token),
          SecureStore.setItemAsync(USER_STORAGE_KEY, JSON.stringify(response.user)),
        ]);
      } catch (storageError: any) {
        console.error('SecureStore error:', storageError);
        // On web or if SecureStore fails, still set the state (tokens will be lost on refresh)
        // This allows the app to continue working even if storage fails
        console.warn('Failed to store tokens securely, but login will continue');
      }

      setTokens({
        access_token: response.access_token,
        refresh_token: response.refresh_token,
      });
      setUser(response.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newUser: User = {
        id: `user_${Date.now()}`,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role || 'customer',
        is_verified: true,
      };

      // Store tokens securely (mock)
      const mockToken = 'mock-access-token-' + Date.now();
      const mockRefreshToken = 'mock-refresh-token-' + Date.now();

      await Promise.all([
        SecureStore.setItemAsync(TOKEN_STORAGE_KEY, mockToken),
        SecureStore.setItemAsync(REFRESH_TOKEN_STORAGE_KEY, mockRefreshToken),
        SecureStore.setItemAsync(USER_STORAGE_KEY, JSON.stringify(newUser)),
      ]);

      setTokens({
        access_token: mockToken,
        refresh_token: mockRefreshToken,
      });
      setUser(newUser);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear secure storage
      await Promise.all([
        SecureStore.deleteItemAsync(TOKEN_STORAGE_KEY),
        SecureStore.deleteItemAsync(REFRESH_TOKEN_STORAGE_KEY),
        SecureStore.deleteItemAsync(USER_STORAGE_KEY),
      ]);

      setUser(null);
      setTokens(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshToken = async () => {
    if (!tokens?.refresh_token) {
      await logout();
      return;
    }

    try {
      // TODO: Implement token refresh API call
      // const response = await api.auth.refreshToken(tokens.refresh_token);
      // Update tokens
      // For now, just log error if refresh fails
      console.warn('Token refresh not implemented yet');
    } catch (error) {
      console.error('Token refresh error:', error);
      await logout();
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      // Persist updated user
      SecureStore.setItemAsync(USER_STORAGE_KEY, JSON.stringify(updatedUser)).catch(
        (error) => console.error('Error saving user updates:', error)
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && !!tokens,
        isLoading,
        tokens,
        login,
        register,
        logout,
        refreshToken,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
