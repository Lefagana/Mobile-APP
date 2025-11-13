import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, TextInput, Text, useTheme, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useLocalization } from '../../contexts/LocalizationContext';
import type { AuthStackParamList } from '../../navigation/types';
import OfflineBanner from '../../components/common/OfflineBanner';

 type Nav = StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

const ForgotPassword: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const theme = useTheme();
  const { t } = useLocalization();
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSend = async () => {
    setMessage('');
    if (!identifier.trim()) return;
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 600));
      setMessage(t('auth.resetSent') || 'If an account exists, we sent reset instructions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <OfflineBanner />
        <IconButton icon="arrow-left" accessibilityLabel={t('common.back') || 'Back'} onPress={() => navigation.goBack()} />
        <Text variant="headlineSmall" style={styles.title}>{t('auth.forgotPassword') || 'Forgot password'}</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>{t('auth.resetSubtitle') || 'Enter your email or phone to reset'}</Text>

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

        {message ? (
          <Text style={[styles.infoText, { color: theme.colors.primary }]}>{message}</Text>
        ) : null}

        <Button mode="contained" onPress={handleSend} loading={loading} disabled={loading || !identifier.trim()} style={styles.button}>
          {t('auth.sendReset') || 'Send reset' }
        </Button>

        <Button mode="text" onPress={() => navigation.goBack()} style={styles.linkButton}>
          {t('common.back') || 'Back'}
        </Button>
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
  infoText: { marginTop: 8, textAlign: 'center' },
  button: { marginTop: 8 },
  linkButton: { marginTop: 4, alignSelf: 'center' },
});

export default ForgotPassword;
