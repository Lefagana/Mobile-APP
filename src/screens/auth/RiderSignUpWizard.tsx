import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, TextInput, useTheme, Chip, ProgressBar, HelperText, Checkbox, Card, IconButton, List, Switch } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from '../../navigation/types';
import { useLocalization } from '../../contexts/LocalizationContext';
import * as SecureStore from 'expo-secure-store';

 type Nav = StackNavigationProp<AuthStackParamList, 'RiderSignUpWizard'>;

const lgas = ['Ikeja', 'Eti-Osa', 'Alimosho', 'Gwagwalada', 'Abuja Municipal'];
const areas = ['Lagos Mainland', 'Lagos Island', 'Abuja Central', 'Abuja Suburbs'];
const vehicleTypes = ['Bike', 'Motorbike', 'Car'];

const RiderSignUpWizard: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const theme = useTheme();
  const { t } = useLocalization();

  const [step, setStep] = useState(1); // 1..6 (mocked)
  const [language, setLanguage] = useState<string>('English');
  const [lga, setLga] = useState<string>('');
  const [area, setArea] = useState<string>('');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [vehicleType, setVehicleType] = useState<string>('Bike');
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [plate, setPlate] = useState('');

  const [docs, setDocs] = useState<string[]>([]);
  const [helmet, setHelmet] = useState(true);
  const [insurance, setInsurance] = useState(false);
  const [consent, setConsent] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const progress = useMemo(() => step / 6, [step]);

  const next = () => {
    const e: Record<string, string> = {};
    if (step === 1) {
      if (!lga) e.lga = 'Select LGA';
      if (!area) e.area = 'Select preferred area';
    } else if (step === 2) {
      if (!name.trim()) e.name = 'Enter your name';
      if (!phone.trim()) e.phone = 'Enter phone';
      if (!email.trim()) e.email = 'Enter email';
      if (!vehicleMake.trim() || !vehicleModel.trim()) e.vehicle = 'Enter vehicle details';
    } else if (step === 3) {
      if (vehicleType === 'Bike' && !helmet) e.helmet = 'Helmet confirmation required';
    } else if (step === 4) {
      if (!consent) e.consent = 'Please consent to background check';
    }
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    if (step < 6) setStep(step + 1); else finish();
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
      <Text variant="titleMedium" style={styles.progressText}>{`Step ${step} of 6`}</Text>
      <ProgressBar progress={progress} color={theme.colors.primary} style={styles.progress} />

      {step === 1 && (
        <View>
          <Text variant="headlineSmall" style={styles.title}>{t('rider.locationCheck') || 'Language, LGA & Location'}</Text>
          <Text variant="labelLarge" style={styles.sectionLabel}>{t('common.language') || 'Language'}</Text>
          <View style={styles.chipsRow}>
            {['English','Pidgin','Hausa','Yoruba','Igbo'].map((l) => (
              <Chip key={l} selected={language === l} onPress={() => setLanguage(l)} style={styles.chip}>{l}</Chip>
            ))}
          </View>

          <TextInput label={t('common.lga') || 'LGA'} value={lga} onChangeText={setLga} mode="outlined" style={styles.input} />
          <HelperText type="error" visible={!!errors.lga}>{errors.lga}</HelperText>

          <TextInput label={t('rider.preferredArea') || 'Preferred area'} value={area} onChangeText={setArea} mode="outlined" style={styles.input} />
          <HelperText type="error" visible={!!errors.area}>{errors.area}</HelperText>

          <Button mode="contained" onPress={next} style={styles.nextBtn}>{t('common.next') || 'Next'}</Button>
        </View>
      )}

      {step === 2 && (
        <View>
          <Text variant="headlineSmall" style={styles.title}>{t('rider.personalVehicle') || 'Personal & Vehicle Info'}</Text>
          <TextInput label={t('auth.name') || 'Name'} value={name} onChangeText={setName} mode="outlined" style={styles.input} />
          <TextInput label={t('auth.phoneNumber') || 'Phone'} value={phone} onChangeText={setPhone} keyboardType="phone-pad" mode="outlined" style={styles.input} left={<TextInput.Icon icon="phone" />} />
          <TextInput label={t('auth.email') || 'Email'} value={email} onChangeText={setEmail} keyboardType="email-address" mode="outlined" style={styles.input} />
          <TextInput label={t('rider.dob') || 'DOB (optional)'} value={dob} onChangeText={setDob} mode="outlined" style={styles.input} />

          <Text variant="labelLarge" style={styles.sectionLabel}>{t('rider.vehicle') || 'Vehicle'}</Text>
          <View style={styles.chipsRow}>
            {vehicleTypes.map((v) => (
              <Chip key={v} selected={vehicleType === v} onPress={() => setVehicleType(v)} style={styles.chip}>{v}</Chip>
            ))}
          </View>
          <TextInput label={t('rider.make') || 'Make'} value={vehicleMake} onChangeText={setVehicleMake} mode="outlined" style={styles.input} />
          <TextInput label={t('rider.model') || 'Model'} value={vehicleModel} onChangeText={setVehicleModel} mode="outlined" style={styles.input} />
          <TextInput label={t('rider.plate') || 'Plate number'} value={plate} onChangeText={setPlate} mode="outlined" style={styles.input} />
          <HelperText type="error" visible={!!errors.vehicle}>{errors.vehicle}</HelperText>

          <Button mode="contained" onPress={next} style={styles.nextBtn}>{t('common.next') || 'Next'}</Button>
        </View>
      )}

      {step === 3 && (
        <View>
          <Text variant="headlineSmall" style={styles.title}>{t('rider.uploadDocs') || 'Upload documents'}</Text>
          <Card style={{ marginBottom: 8 }}>
            <Card.Content>
              {docs.length === 0 ? (
                <Text>{t('rider.noDocs') || 'No documents yet'}</Text>
              ) : (
                docs.map((d) => (
                  <List.Item key={d} title={d} left={(p) => <List.Icon {...p} icon="file" />} right={(p) => <IconButton {...p} icon="close" onPress={() => removeDoc(d)} />} />
                ))
              )}
              <Button mode="outlined" icon="camera" onPress={addMockDoc} style={{ marginTop: 8 }}>{t('rider.addDoc') || 'Add mock photo'}</Button>
            </Card.Content>
          </Card>

          <View style={styles.termsRow}>
            <Text style={styles.termsText}>{t('rider.helmet') || 'Helmet (for bikes)'}</Text>
            <Switch value={helmet} onValueChange={setHelmet} />
          </View>
          <View style={styles.termsRow}>
            <Text style={styles.termsText}>{t('rider.insurance') || 'Insurance'}</Text>
            <Switch value={insurance} onValueChange={setInsurance} />
          </View>
          <HelperText type="error" visible={!!errors.helmet}>{errors.helmet || (vehicleType === 'Bike' ? 'Helmet required for bike riders' : '')}</HelperText>

          <Button mode="contained" onPress={next} style={styles.nextBtn}>{t('common.next') || 'Next'}</Button>
        </View>
      )}

      {step === 4 && (
        <View>
          <Text variant="headlineSmall" style={styles.title}>{t('rider.consent') || 'Background check consent'}</Text>
          <View style={styles.termsRow}>
            <Checkbox status={consent ? 'checked' : 'unchecked'} onPress={() => setConsent(!consent)} />
            <Text style={styles.termsText}>{t('rider.consentText') || 'I consent to background check (demo)'}</Text>
          </View>
          <HelperText type="error" visible={!!errors.consent}>{errors.consent}</HelperText>
          <Button mode="contained" onPress={next} style={styles.nextBtn}>{t('common.next') || 'Next'}</Button>
        </View>
      )}

      {step === 5 && (
        <View>
          <Text variant="headlineSmall" style={styles.title}>{t('rider.orientation') || 'Orientation'}</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>{t('rider.orientationSubtitle') || 'Short safety & routes modules'}</Text>
          <View style={styles.chipsRow}>
            <Chip selected>Safety Basics</Chip>
            <Chip selected>Route Planning</Chip>
            <Chip selected>Earnings & Heatmaps</Chip>
          </View>
          <Button mode="contained" onPress={next} style={styles.nextBtn}>{t('common.next') || 'Next'}</Button>
        </View>
      )}

      {step === 6 && (
        <View>
          <Text variant="headlineSmall" style={styles.title}>{t('rider.preferences') || 'Preferences'}</Text>
          <TextInput label={t('rider.hours') || 'Available hours (e.g., 8:00-18:00)'} value={''} onChangeText={() => {}} mode="outlined" style={styles.input} />
          <Text variant="bodyMedium" style={styles.subtitle}>{t('rider.heatmapPreview') || 'Hot zones to boost earnings'}</Text>
          <View style={styles.chipsRow}>
            {['Lekki','VI','Ikeja','Yaba','Garki','Wuse 2'].map((zone) => (
              <Chip key={zone} selected>{zone}</Chip>
            ))}
          </View>
          <View style={{ height: 120, borderRadius: 12, marginTop: 8, backgroundColor: '#ffe5e0', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#cc3d1a' }}>Mock Heatmap Preview</Text>
            <Text style={{ color: '#cc3d1a', opacity: 0.8 }}>High demand: Lekki, VI, Wuse 2</Text>
          </View>

          <Text variant="labelLarge" style={styles.sectionLabel}>{t('rider.support') || 'Need help?'}</Text>
          <View style={styles.chipsRow}>
            <Chip icon="phone">No SMS? Call support</Chip>
            <Chip icon="message">Live chat (mock)</Chip>
          </View>
          <Button mode="contained" onPress={next} style={styles.nextBtn}>{t('common.finish') || 'Finish'}</Button>
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
  termsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, justifyContent: 'space-between' },
  termsText: { flex: 1, marginRight: 8 },
});

export default RiderSignUpWizard;
