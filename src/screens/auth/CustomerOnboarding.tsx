import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, TextInput, useTheme, Chip, ProgressBar, HelperText } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from '../../navigation/types';
import { useLocalization } from '../../contexts/LocalizationContext';
import * as SecureStore from 'expo-secure-store';
import { fetchPlaceSuggestions, fetchPlaceDetails, type PlaceSuggestion } from '../../services/places';
import { useAuth } from '../../contexts/AuthContext';

 type Nav = StackNavigationProp<AuthStackParamList, 'CustomerOnboarding'>;

const mockSuggestions = ['Lekki Phase 1, Lagos', 'Victoria Island, Lagos', 'Garki, Abuja', 'Wuse 2, Abuja'];
const categories = ['Electronics', 'Fashion', 'Groceries', 'Beauty', 'Home'];
const languages = ['English', 'Pidgin', 'Hausa', 'Yoruba', 'Igbo'];

const CustomerOnboarding: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const theme = useTheme();
  const { t } = useLocalization();
  const { updateUser } = useAuth();

  const [step, setStep] = useState(1); // 1..2
  const [address, setAddress] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState('');
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | undefined>(undefined);
  const [selectedPlaceDetails, setSelectedPlaceDetails] = useState<any | null>(null);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [language, setLanguage] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const progress = useMemo(() => (step === 1 ? 0.5 : 1), [step]);

  const toggleCategory = (c: string) => {
    setSelectedCategories((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  };

  const next = () => {
    if (step === 1) {
      const e: Record<string, string> = {};
      if (!address.trim() && !selectedSuggestion) e.address = 'Please enter your address';
      setErrors(e);
      if (Object.keys(e).length === 0) setStep(2);
    } else {
      finish();
    }
  };

  // Autocomplete: fetch suggestions as user types
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const q = address.trim();
      if (q.length < 3) {
        if (!cancelled) setSuggestions([]);
        return;
      }
      try {
        setSuggestionsLoading(true);
        const list = await fetchPlaceSuggestions(q);
        if (!cancelled) setSuggestions(list);
      } finally {
        if (!cancelled) setSuggestionsLoading(false);
      }
    };
    const t = setTimeout(run, 300); // debounce
    return () => { cancelled = true; clearTimeout(t); };
  }, [address]);

  const finish = () => {
    // Persist onboarding complete (mock)
    // Save preferences to profile
    try {
      updateUser({
        preferences: {
          address,
          categories: selectedCategories,
          language,
          location: selectedPlaceDetails?.geometry?.location
            ? { lat: selectedPlaceDetails.geometry.location.lat, lng: selectedPlaceDetails.geometry.location.lng }
            : undefined,
          city: (selectedPlaceDetails?.address_components || []).find((c: any) => c.types?.includes('locality'))?.long_name,
          country: (selectedPlaceDetails?.address_components || []).find((c: any) => c.types?.includes('country'))?.long_name,
        } as any,
      } as any);
    } catch {}
    SecureStore.setItemAsync('wakanda_onboarding_complete', '1').finally(() => {
      // Navigate to Customer app
      const parent = navigation.getParent();
      if (parent) {
        parent.reset({ index: 0, routes: [{ name: 'Customer' as never }] });
      }
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="titleMedium" style={styles.progressText}>{`Step ${step} of 2`}</Text>
      <ProgressBar progress={progress} color={theme.colors.primary} style={styles.progress} />

      {step === 1 ? (
        <View>
          <Text variant="headlineSmall" style={styles.title}>{t('onboarding.addressTitle') || 'Verify your address'}</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>{t('onboarding.addressSubtitle') || 'We use this to estimate delivery times'}</Text>

          <TextInput
            label={t('onboarding.address') || 'Address'}
            value={address}
            onChangeText={(v) => { setAddress(v); setSelectedSuggestion(''); }}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="map-marker" />}
            placeholder="e.g., 10 Admiralty Way, Lekki"
          />
          <HelperText type="error" visible={!!errors.address}>{errors.address}</HelperText>

          <Text variant="labelLarge" style={styles.sectionLabel}>{t('onboarding.suggestions') || 'Suggestions'}</Text>
          <View style={styles.chipsRow}>
            {suggestions.map((s) => (
              <Chip key={s.description} selected={selectedSuggestion === s.description} onPress={async () => { setSelectedSuggestion(s.description); setSelectedPlaceId(s.place_id); setAddress(s.description); if (s.place_id) { const details = await fetchPlaceDetails(s.place_id); setSelectedPlaceDetails(details); } }} style={styles.chip}>
                {s.description}
              </Chip>
            ))}
            {(!suggestionsLoading && suggestions.length === 0 && address.trim().length >= 3) ? (
              <Text style={{ opacity: 0.7 }}>{t('common.noResults') || 'No suggestions'}</Text>
            ) : null}
          </View>

          <Button mode="contained" onPress={next} style={styles.nextBtn}>{t('common.next') || 'Next'}</Button>
        </View>
      ) : (
        <View>
          <Text variant="headlineSmall" style={styles.title}>{t('onboarding.personalizeTitle') || 'Personalize your experience'}</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>{t('onboarding.personalizeSubtitle') || 'Choose categories you like and your preferred language'}</Text>

          <Text variant="labelLarge" style={styles.sectionLabel}>{t('onboarding.categories') || 'Categories'}</Text>
          <View style={styles.chipsRow}>
            {categories.map((c) => (
              <Chip key={c} selected={selectedCategories.includes(c)} onPress={() => toggleCategory(c)} style={styles.chip}>{c}</Chip>
            ))}
          </View>

          <Text variant="labelLarge" style={styles.sectionLabel}>{t('onboarding.language') || 'Language'}</Text>
          <View style={styles.chipsRow}>
            {languages.map((l) => (
              <Chip key={l} selected={language === l} onPress={() => setLanguage(l)} style={styles.chip}>{l}</Chip>
            ))}
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
});

export default CustomerOnboarding;
