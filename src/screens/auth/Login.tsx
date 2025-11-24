import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, TextInput, Text, useTheme, Divider, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useLocalization } from '../../contexts/LocalizationContext';
import type { AuthStackParamList } from '../../navigation/types';
import { useAuth } from '../../contexts/AuthContext';
import * as LocalAuthentication from 'expo-local-authentication';
import OfflineBanner from '../../components/common/OfflineBanner';
import * as SecureStore from 'expo-secure-store';

// Mock login: we will just route to Customer stack on success

type LoginNav = StackNavigationProp<AuthStackParamList, 'Login'>;

const Login: React.FC = () => {
  const theme = useTheme();
  const { t } = useLocalization();
  const navigation = useNavigation<LoginNav>();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [biometricAvailable, setBiometricAvailable] = useState<boolean | null>(null);
  const [canShowBiometric, setCanShowBiometric] = useState(false);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = await SecureStore.getItemAsync('wakanda_access_token').catch(() => null);
        if (mounted) setCanShowBiometric(!!token);
      } catch {
        if (mounted) setCanShowBiometric(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleSignIn = async () => {
    setError('');
    if (!identifier.trim() || !password.trim()) {
      setError('Please enter your credentials');
      return;
    }
    try {
      setLoading(true);
      // Mock: request OTP-less login using OTPVerify flow; here we simulate verified login
      await new Promise((r) => setTimeout(r, 600));
      // Use demo tokens via AuthContext login with mock values
      await login('+2348000000000', '000000', 'mock-session');
      const parent = navigation.getParent();
      if (parent) {
        parent.reset({ index: 0, routes: [{ name: 'Customer' as never }] });
      } else {
        navigation.navigate('Onboarding');
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometric = async () => {
    setError('');
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = compatible ? await LocalAuthentication.isEnrolledAsync() : false;
      if (!compatible || !enrolled) {
        setBiometricAvailable(false);
        setError('Biometric authentication not available');
        return;
      }
      setBiometricAvailable(true);
      const result = await LocalAuthentication.authenticateAsync({ promptMessage: 'Sign in', fallbackLabel: 'Use passcode' });
      if (result.success) {
        // Mock: treat as signed-in and go to Customer
        const parent = navigation.getParent();
        if (parent) {
          parent.reset({ index: 0, routes: [{ name: 'Customer' as never }] });
        } else {
          navigation.navigate('Onboarding');
        }
      } else if (result.error) {
        setError(result.error);
      }
    } catch (e: any) {
      setError(e?.message || 'Biometric auth failed');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <OfflineBanner />
        <IconButton icon="arrow-left" accessibilityLabel={t('common.back') || 'Back'} onPress={() => navigation.goBack()} />
        <Text variant="headlineSmall" style={styles.title}>{t('auth.signIn') || 'Sign in'}</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>{t('auth.signInSubtitle') || 'Welcome back'}</Text>

        <TextInput
          label={t('auth.emailOrPhone') || 'Email or phone'}
          value={identifier}
          onChangeText={setIdentifier}
          autoCapitalize="none"
          keyboardType="email-address"
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon="account" />}
        />

        <TextInput
          label={t('auth.password') || 'Password'}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon="lock" />}
        />

        {error ? (
          <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
        ) : null}

        <Button mode="contained" onPress={handleSignIn} loading={loading} disabled={loading} style={styles.button}>
          {t('auth.signIn') || 'Sign in'}
        </Button>

        <Button mode="text" onPress={() => navigation.navigate('ForgotPassword')} style={styles.linkButton}>
          {t('auth.forgotPassword') || 'Forgot password?'}
        </Button>

        <View style={styles.signupContainer}>
          <Text variant="bodyMedium" style={styles.signupText}>
            {t('auth.dontHaveAccount') || 'Don\'t have an account?'}
          </Text>
          <Button
            mode="text"
            onPress={() => navigation.navigate('RoleSelector')}
            compact
          >
            {t('auth.register') || 'Register'}
          </Button>
        </View>

        <Divider style={{ marginVertical: 12 }} />

        <Button mode="outlined" icon="google" onPress={() => setError('Google mock: not implemented')} style={styles.button}>
          {t('auth.continueWithGoogle') || 'Continue with Google'}
        </Button>
        <Button mode="outlined" icon="facebook" onPress={() => setError('Facebook mock: not implemented')} style={styles.button}>
          {t('auth.continueWithFacebook') || 'Continue with Facebook'}
        </Button>

        {canShowBiometric ? (
          <Button mode="contained-tonal" icon="fingerprint" onPress={handleBiometric} style={styles.button}>
            {t('auth.signInBiometric') || 'Sign in with biometrics'}
          </Button>
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  subtitle: { color: '#666666', textAlign: 'center', marginBottom: 24 },
  input: { marginBottom: 12 },
  button: { marginTop: 8 },
  linkButton: { marginTop: 4, alignSelf: 'center' },
  errorText: { marginTop: 8, textAlign: 'center' },
});

export default Login;
