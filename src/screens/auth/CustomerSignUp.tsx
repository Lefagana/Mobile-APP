import React, { useMemo, useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, TextInput, Text, useTheme, HelperText, Checkbox, Divider, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from '../../navigation/types';
import { useLocalization } from '../../contexts/LocalizationContext';
import { validatePhoneNumber, formatPhoneNumber } from '../../utils/validators';
import { api } from '../../services/api';
import OfflineBanner from '../../components/common/OfflineBanner';

 type Nav = StackNavigationProp<AuthStackParamList, 'CustomerSignUp'>;

const passwordHint = 'Password needs at least 6 characters and a number';

const CustomerSignUp: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const theme = useTheme();
  const { t } = useLocalization();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [countryCode, setCountryCode] = useState('+234');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isPasswordValid = useMemo(() => /^(?=.*\d).{6,}$/.test(password), [password]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = 'Enter first name';
    if (!lastName.trim()) e.lastName = 'Enter last name';
    if (!validatePhoneNumber(`${countryCode}${phone}`)) e.phone = 'Enter a valid Nigerian phone';
    if (!isPasswordValid) e.password = passwordHint;
    if (!agree) e.agree = 'Please accept terms';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      const formatted = formatPhoneNumber(`${countryCode}${phone}`);
      const resp = await api.auth.requestOTP(formatted);
      navigation.navigate('OTPVerify', {
        phone: formatted,
        sessionId: resp.otp_session_id,
        otpCode: (resp as any).otp,
        nextRoute: { root: 'Auth', screen: 'CustomerOnboarding' },
      });
    } catch (e: any) {
      setErrors({ api: e?.message || 'Failed to start signup' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <OfflineBanner />
        <IconButton icon="arrow-left" accessibilityLabel={t('common.back') || 'Back'} onPress={() => navigation.goBack()} />
        <Text variant="headlineSmall" style={styles.title}>{t('auth.createAccount') || 'Create your account'}</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>{t('auth.quickSignup') || 'Takes 1–2 minutes'}</Text>

        <View style={styles.row}>
          <TextInput label={t('auth.firstName') || 'First name'} value={firstName} onChangeText={setFirstName} mode="outlined" style={[styles.input, styles.half]} />
          <TextInput label={t('auth.lastName') || 'Last name'} value={lastName} onChangeText={setLastName} mode="outlined" style={[styles.input, styles.half]} />
        </View>
        <HelperText type="error" visible={!!errors.firstName || !!errors.lastName}>{errors.firstName || errors.lastName}</HelperText>

        <TextInput label={t('auth.gender') || 'Gender (optional)'} value={gender} onChangeText={setGender} mode="outlined" style={styles.input} />

        <View style={styles.row}>
          <TextInput label={t('auth.countryCode') || 'Code'} value={countryCode} onChangeText={setCountryCode} mode="outlined" style={[styles.input, styles.code]} />
          <TextInput label={t('auth.phoneNumber') || 'Phone number'} value={phone} onChangeText={setPhone} keyboardType="phone-pad" mode="outlined" style={[styles.input, styles.flex]} left={<TextInput.Icon icon="phone" />} />
        </View>
        <HelperText type="error" visible={!!errors.phone}>{errors.phone}</HelperText>

        <TextInput label={t('auth.password') || 'Password'} value={password} onChangeText={setPassword} secureTextEntry mode="outlined" style={styles.input} left={<TextInput.Icon icon="lock" />} />
        <HelperText type={isPasswordValid ? 'info' : 'error'} visible>{password ? (isPasswordValid ? 'Looks good' : passwordHint) : passwordHint}</HelperText>

        <View style={styles.termsRow}>
          <Checkbox status={agree ? 'checked' : 'unchecked'} onPress={() => setAgree(!agree)} />
          <Text style={styles.termsText}>{t('auth.agreeTerms') || 'I agree to the Terms & Privacy'}</Text>
        </View>
        <HelperText type="error" visible={!!errors.agree}>{errors.agree}</HelperText>

        {errors.api ? <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.api}</Text> : null}

        <Button mode="contained" onPress={handleCreate} loading={loading} disabled={loading} style={styles.button}>
          {t('auth.createAccount') || 'Create account'}
        </Button>

        <Divider style={{ marginVertical: 12 }} />

        <Button mode="outlined" icon="google" onPress={() => {}} style={styles.button}>{t('auth.continueWithGoogle') || 'Continue with Google'}</Button>
        <Button mode="outlined" icon="facebook" onPress={() => {}} style={styles.button}>{t('auth.continueWithFacebook') || 'Continue with Facebook'}</Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1, padding: 24 },
  title: { fontWeight: 'bold', marginTop: 16, marginBottom: 4, textAlign: 'center' },
  subtitle: { color: '#666666', textAlign: 'center', marginBottom: 16 },
  row: { flexDirection: 'row', gap: 8 },
  input: { marginBottom: 8 },
  half: { flex: 1 },
  code: { width: 90 },
  flex: { flex: 1 },
  termsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  termsText: { flex: 1 },
  button: { marginTop: 8 },
  errorText: { marginTop: 8, textAlign: 'center' },
});

export default CustomerSignUp;
