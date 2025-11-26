import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, TextInput, Text, useTheme, IconButton } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp, CommonActions } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { validateOTP } from '../../utils/validators';
import { useLocalization } from '../../contexts/LocalizationContext';
import type { AuthStackParamList } from '../../navigation/types';
import OfflineBanner from '../../components/common/OfflineBanner';

type OTPVerifyScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'OTPVerify'>;
type OTPVerifyRouteProp = RouteProp<AuthStackParamList, 'OTPVerify'>;

const OTPVerify: React.FC = () => {
  const navigation = useNavigation<OTPVerifyScreenNavigationProp>();
  const route = useRoute<OTPVerifyRouteProp>();
  const theme = useTheme();
  const { login } = useAuth();
  const { t } = useLocalization();
  const { phone, sessionId, otpCode, nextRoute } = route.params;

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [devOTP, setDevOTP] = useState<string | undefined>(otpCode); // Store OTP for dev display
  const inputRef = useRef<any>(null);

  const handleVerifyOTP = async (code?: string) => {
    const codeToVerify = code || otp;
    setError('');

    if (!validateOTP(codeToVerify)) {
      setError(t('auth.invalidOTP'));
      return;
    }

    try {
      setLoading(true);
      await login(phone, codeToVerify, sessionId);
      // Navigate based on nextRoute if provided
      const parent = navigation.getParent();
      if (nextRoute && parent) {
        if (nextRoute.root === 'Auth') {
          parent.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: 'Auth' as never,
                  params: nextRoute.screen ? { screen: nextRoute.screen } : undefined,
                } as never,
              ],
            })
          );
        } else if (nextRoute.root === 'Customer') {
          parent.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: 'Customer' as never,
                  params: nextRoute.screen ? { screen: nextRoute.screen } : undefined,
                } as never,
              ],
            })
          );
        }
        return;
      }

      // Default: navigate based on user role
      if (parent) {
        // Get user from AuthContext after login
        const { user } = useAuth();
        const targetStack = user?.role === 'vendor' ? 'Vendor' :
          user?.role === 'rider' ? 'Customer' : // Placeholder
            'Customer';

        parent.dispatch(
          CommonActions.reset({ index: 0, routes: [{ name: targetStack as never }] })
        );
      } else {
        navigation.navigate('Customer' as never);
      }
    } catch (err: any) {
      setError(err.message || t('auth.invalidOTP'));
      setOtp(''); // Clear OTP on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-verify when 6 digits entered
    if (otp.length === 6 && validateOTP(otp)) {
      handleVerifyOTP(otp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  useEffect(() => {
    // Resend timer countdown
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleResendOTP = async () => {
    try {
      setLoading(true);
      setCanResend(false);
      setResendTimer(60);
      setError('');
      const response = await api.auth.requestOTP(phone);
      // Update OTP code for dev display
      if ((response as any).otp) {
        setDevOTP((response as any).otp);
      }
      // Update session ID
      // Note: In a real app, you'd update the route params or use state management
    } catch (err: any) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <OfflineBanner />
        <IconButton icon="arrow-left" accessibilityLabel={t('common.back') || 'Back'} onPress={() => navigation.goBack()} />
        <Text variant="headlineSmall" style={styles.title}>
          {t('auth.otpVerification')}
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          {t('auth.enterOTP')}
        </Text>
        <Text variant="bodySmall" style={styles.phoneText}>
          {phone}
        </Text>

        {/* Development: Show OTP code in UI */}
        {(__DEV__ && devOTP) ? (
          <View style={[styles.devOTPContainer, { backgroundColor: theme.colors.primaryContainer }]}>
            <Text variant="labelSmall" style={[styles.devOTPLabel, { color: theme.colors.onPrimaryContainer }]}>
              🧪 Development Mode - Your OTP Code:
            </Text>
            <Text variant="headlineMedium" style={[styles.devOTPCode, { color: theme.colors.onPrimaryContainer }]}>
              {devOTP}
            </Text>
            <Text variant="bodySmall" style={[styles.devOTPHint, { color: theme.colors.onPrimaryContainer }]}>
              Tap to copy
            </Text>
          </View>
        ) : null}

        <View style={styles.otpContainer}>
          {/* Hidden Input for Keyboard Handling */}
          <TextInput
            ref={inputRef}
            value={otp}
            onChangeText={(text) => {
              const digitsOnly = text.replace(/[^0-9]/g, '').slice(0, 6);
              setOtp(digitsOnly);
              setError('');
            }}
            keyboardType="number-pad"
            maxLength={6}
            autoFocus
            caretHidden
            style={styles.hiddenInput}
          />

          {/* Visual Boxes */}
          <View style={styles.boxesContainer}>
            {[0, 1, 2, 3, 4, 5].map((index) => {
              const digit = otp[index] || '';
              const isFocused = index === otp.length;
              return (
                <View
                  key={index}
                  style={[
                    styles.box,
                    {
                      borderColor: error
                        ? theme.colors.error
                        : isFocused
                          ? theme.colors.primary
                          : theme.colors.outline,
                      backgroundColor: theme.colors.surface,
                    },
                  ]}
                  onTouchEnd={() => inputRef.current?.focus()}
                >
                  <Text
                    variant="headlineMedium"
                    style={[
                      styles.boxText,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    {digit}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {error ? (
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {error}
          </Text>
        ) : null}

        <Button
          mode="contained"
          onPress={() => handleVerifyOTP()}
          loading={loading}
          disabled={loading || otp.length !== 6}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Verify
        </Button>

        <View style={styles.resendContainer}>
          {canResend ? (
            <Button
              mode="text"
              onPress={handleResendOTP}
              disabled={loading}
              style={styles.resendButton}
            >
              {t('auth.resendOTP')}
            </Button>
          ) : (
            <Text variant="bodySmall" style={styles.timerText}>
              {t('auth.resendIn', { seconds: resendTimer })}
            </Text>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#666666',
    textAlign: 'center',
    marginBottom: 8,
  },
  phoneText: {
    color: '#FF6B35',
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: '600',
  },
  otpContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  boxesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
  },
  box: {
    width: 45,
    height: 56,
    borderWidth: 2,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    marginBottom: 16,
    paddingHorizontal: 4,
    textAlign: 'center',
  },
  button: {
    marginTop: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  resendContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  resendButton: {
    marginTop: 8,
  },
  timerText: {
    color: '#666666',
    marginTop: 8,
  },
  devOTPContainer: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF6B35',
    borderStyle: 'dashed',
  },
  devOTPLabel: {
    marginBottom: 8,
    fontWeight: '600',
    textAlign: 'center',
  },
  devOTPCode: {
    fontWeight: 'bold',
    letterSpacing: 4,
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  devOTPHint: {
    opacity: 0.8,
    fontSize: 10,
  },
});

export default OTPVerify;
