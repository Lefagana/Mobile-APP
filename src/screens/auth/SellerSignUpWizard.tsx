import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, TextInput, useTheme, Chip, ProgressBar, HelperText, Checkbox, Card, IconButton, List, Badge } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from '../../navigation/types';
import { useLocalization } from '../../contexts/LocalizationContext';
import * as SecureStore from 'expo-secure-store';

 type Nav = StackNavigationProp<AuthStackParamList, 'SellerSignUpWizard'>;

const sellerTypes = ['Individual', 'Business'];
const tiers = ['Free', 'Basic', 'Pro'];

const SellerSignUpWizard: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const theme = useTheme();
  const { t } = useLocalization();

  const [step, setStep] = useState(1); // 1..5 (mocked)
  const [sellerType, setSellerType] = useState<'Individual' | 'Business' | ''>('');
  const [tier, setTier] = useState<string>('Free');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [storeName, setStoreName] = useState('');
  const [cacNumber, setCacNumber] = useState(''); // Business only
  const [docs, setDocs] = useState<string[]>([]);
  const [twoFA, setTwoFA] = useState(false);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [trainingProgress, setTrainingProgress] = useState({ q1: false, q2: false, q3: false });
  const score = useMemo(() => [trainingProgress.q1, trainingProgress.q2, trainingProgress.q3].filter(Boolean).length, [trainingProgress]);

  const progress = useMemo(() => step / 5, [step]);

  const next = () => {
    const e: Record<string, string> = {};
    if (step === 1) {
      if (!sellerType) e.sellerType = 'Select seller type';
    } else if (step === 2) {
      if (!name.trim()) e.name = 'Enter your name/business name';
      if (!phone.trim()) e.phone = 'Enter phone';
      if (!email.trim()) e.email = 'Enter email';
    } else if (step === 3) {
      if (!storeName.trim()) e.storeName = 'Enter store name';
      if (sellerType === 'Business' && cacNumber.trim().length < 6) e.cacNumber = 'Enter valid CAC number';
    }
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    if (step < 5) setStep(step + 1); else finish();
  };

  const finish = () => {
    // Mock submission and mark onboarding complete
    SecureStore.setItemAsync('wakanda_onboarding_complete', '1').finally(() => {
      const parent = navigation.getParent();
      if (parent) parent.reset({ index: 0, routes: [{ name: 'Customer' as never }] });
    });
  };

  const removeDoc = (d: string) => setDocs((prev) => prev.filter((x) => x !== d));
  const addMockDoc = () => setDocs((prev) => [...prev, `doc_${prev.length + 1}.png`] );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <IconButton icon="arrow-left" accessibilityLabel={t('common.back') || 'Back'} onPress={() => { if (step > 1) setStep(step - 1); else navigation.goBack(); }} />
      <Text variant="titleMedium" style={styles.progressText}>{`Step ${step} of 5`}</Text>
      <ProgressBar progress={progress} color={theme.colors.primary} style={styles.progress} />

      {step === 1 && (
        <View>
          <Text variant="headlineSmall" style={styles.title}>{t('seller.chooseType') || 'Choose seller type'}</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>{t('seller.tierSubtitle') || 'Select type and membership tier'}</Text>
          <View style={styles.chipsRow}>
            {sellerTypes.map((st) => (
              <Chip key={st} selected={sellerType === st} onPress={() => setSellerType(st as any)} style={styles.chip}>{st}</Chip>
            ))}
          </View>
          <HelperText type="error" visible={!!errors.sellerType}>{errors.sellerType}</HelperText>

          <Text variant="labelLarge" style={styles.sectionLabel}>{t('seller.tier') || 'Membership tier'}</Text>
          <View style={styles.chipsRow}>
            {tiers.map((t) => (
              <Chip key={t} selected={tier === t} onPress={() => setTier(t)} style={styles.chip}>{t}</Chip>
            ))}
          </View>

          <Button mode="contained" onPress={next} style={styles.nextBtn}>{t('common.next') || 'Next'}</Button>
        </View>
      )}

      {step === 2 && (
        <View>
          <Text variant="headlineSmall" style={styles.title}>{t('seller.info') || 'Personal / Business Info'}</Text>
          <TextInput label={t('auth.name') || 'Name'} value={name} onChangeText={setName} mode="outlined" style={styles.input} />
          <TextInput label={t('auth.email') || 'Email'} value={email} onChangeText={setEmail} keyboardType="email-address" mode="outlined" style={styles.input} />
          <TextInput label={t('auth.phoneNumber') || 'Phone'} value={phone} onChangeText={setPhone} keyboardType="phone-pad" mode="outlined" style={styles.input} left={<TextInput.Icon icon="phone" />} />
          <HelperText type="error" visible={!!errors.name || !!errors.email || !!errors.phone}>{errors.name || errors.email || errors.phone}</HelperText>
          {sellerType === 'Business' && (
            <>
              <TextInput label={t('seller.cac') || 'CAC number'} value={cacNumber} onChangeText={setCacNumber} mode="outlined" style={styles.input} />
              <HelperText type="error" visible={!!errors.cacNumber}>{errors.cacNumber}</HelperText>
            </>
          )}
          <Button mode="contained" onPress={next} style={styles.nextBtn}>{t('common.next') || 'Next'}</Button>
        </View>
      )}

      {step === 3 && (
        <View>
          <Text variant="headlineSmall" style={styles.title}>{t('seller.storeProfile') || 'Store Profile'}</Text>
          <TextInput label={t('seller.storeName') || 'Store name'} value={storeName} onChangeText={setStoreName} mode="outlined" style={styles.input} />
          {sellerType === 'Business' && (
            <TextInput label={t('seller.cac') || 'CAC number'} value={cacNumber} onChangeText={setCacNumber} mode="outlined" style={styles.input} />
          )}
          <Text variant="labelLarge" style={styles.sectionLabel}>{t('seller.docs') || 'Required docs'}</Text>
          <Card style={{ marginBottom: 8 }}>
            <Card.Content>
              {docs.length === 0 ? (
                <Text>{t('seller.noDocs') || 'No documents yet'}</Text>
              ) : (
                docs.map((d) => (
                  <List.Item key={d} title={d} left={(p) => <List.Icon {...p} icon="file" />} right={(p) => <IconButton {...p} icon="close" onPress={() => removeDoc(d)} />} />
                ))
              )}
              <Button mode="outlined" icon="upload" onPress={addMockDoc} style={{ marginTop: 8 }}>
                {t('seller.addDoc') || 'Add mock document'} {tier !== 'Free' ? <Badge style={{ marginLeft: 8 }}>+ priority</Badge> : null}
              </Button>
            </Card.Content>
          </Card>
          <HelperText type="error" visible={!!errors.storeName}>{errors.storeName}</HelperText>
          <Button mode="contained" onPress={next} style={styles.nextBtn}>{t('common.next') || 'Next'}</Button>
        </View>
      )}

      {step === 4 && (
        <View>
          <Text variant="headlineSmall" style={styles.title}>{t('seller.training') || 'Quick training quiz'}</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>{t('seller.trainingSubtitle') || 'Answer a few questions to earn a badge'}</Text>
          <View style={styles.chipsRow}>
            <Chip selected={trainingProgress.q1} onPress={async () => { const np = { ...trainingProgress, q1: !trainingProgress.q1 }; setTrainingProgress(np); await SecureStore.setItemAsync('seller_training_score', String([np.q1,np.q2,np.q3].filter(Boolean).length)); }}>Q1: Packaging best practices</Chip>
            <Chip selected={trainingProgress.q2} onPress={async () => { const np = { ...trainingProgress, q2: !trainingProgress.q2 }; setTrainingProgress(np); await SecureStore.setItemAsync('seller_training_score', String([np.q1,np.q2,np.q3].filter(Boolean).length)); }}>Q2: Returns policy basics</Chip>
            <Chip selected={trainingProgress.q3} onPress={async () => { const np = { ...trainingProgress, q3: !trainingProgress.q3 }; setTrainingProgress(np); await SecureStore.setItemAsync('seller_training_score', String([np.q1,np.q2,np.q3].filter(Boolean).length)); }}>Q3: Delivery options</Chip>
          </View>
          <Text style={{ textAlign: 'center', marginTop: 8 }}>{`Score: ${score}/3`}</Text>
          <Button mode="contained" onPress={next} style={styles.nextBtn}>{t('common.next') || 'Next'}</Button>
        </View>
      )}

      {step === 5 && (
        <View>
          <Text variant="headlineSmall" style={styles.title}>{t('seller.security') || 'Security & Consent'}</Text>
          <View style={styles.termsRow}>
            <Checkbox status={twoFA ? 'checked' : 'unchecked'} onPress={() => setTwoFA(!twoFA)} />
            <Text style={styles.termsText}>{t('seller.enable2FA') || 'Enable 2FA (recommended)'}</Text>
          </View>
          <View style={styles.termsRow}>
            <Checkbox status={agree ? 'checked' : 'unchecked'} onPress={() => setAgree(!agree)} />
            <Text style={styles.termsText}>{t('auth.agreeTerms') || 'I agree to the Terms & Privacy'}</Text>
          </View>
          <Button mode="contained" onPress={() => navigation.navigate('SellerTwoFASetup' as any)} style={styles.nextBtn} disabled={!agree}>
            {t('seller.setup2FA') || 'Set up 2FA'}
          </Button>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 24 },
  progress: { height: 8, borderRadius: 4, marginBottom: 16 },
  progressText: { textAlign: 'center', marginTop: 16, marginBottom: 8, fontWeight: '600' },
  title: { fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  subtitle: { color: '#666666', textAlign: 'center', marginBottom: 16 },
  input: { marginBottom: 8 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { marginVertical: 4 },
  sectionLabel: { marginTop: 16, marginBottom: 8 },
  nextBtn: { marginTop: 16 },
  termsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  termsText: { flex: 1 },
});

export default SellerSignUpWizard;
