import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, TextInput, Text, useTheme, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { api } from '../../services/api';
import { validatePhoneNumber, formatPhoneNumber } from '../../utils/validators';
import { useLocalization } from '../../contexts/LocalizationContext';
import type { AuthStackParamList } from '../../navigation/types';
import OfflineBanner from '../../components/common/OfflineBanner';

type PhoneInputScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'PhoneInput'>;

const PhoneInput: React.FC = () => {
  const navigation = useNavigation<PhoneInputScreenNavigationProp>();
  const theme = useTheme();
  const { t } = useLocalization();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRequestOTP = async () => {
    setError('');
    
    if (!phone.trim()) {
      setError('Please enter your phone number');
      return;
    }

    if (!validatePhoneNumber(phone)) {
      setError('Please enter a valid Nigerian phone number');
      return;
    }

    try {
      setLoading(true);
      const formattedPhone = formatPhoneNumber(phone);
      const response = await api.auth.requestOTP(formattedPhone);
      
      navigation.navigate('OTPVerify', {
        phone: formattedPhone,
        sessionId: response.otp_session_id,
        otpCode: (response as any).otp, // Pass OTP for development display
      });
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
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
          {t('auth.phoneNumber')}
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          {t('auth.enterPhone')}
        </Text>

        <TextInput
          label={t('auth.phoneNumber')}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="+234 801 234 5678"
          mode="outlined"
          style={styles.input}
          error={!!error}
          disabled={loading}
          left={<TextInput.Icon icon="phone" />}
          autoFocus
        />

        {error ? (
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {error}
          </Text>
        ) : null}

        <Button
          mode="contained"
          onPress={handleRequestOTP}
          loading={loading}
          disabled={loading || !phone.trim()}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          {t('auth.requestOTP')}
        </Button>
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
    marginBottom: 32,
  },
  input: {
    marginBottom: 16,
  },
  errorText: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  button: {
    marginTop: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default PhoneInput;
