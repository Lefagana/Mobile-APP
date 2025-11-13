import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Portal, Modal, Text, Button, TextInput, Chip, useTheme, HelperText } from 'react-native-paper';
import { BlurView } from 'expo-blur';
import { ssSetItem } from '../../utils/secureStorage';
import { useLocalization } from '../../contexts/LocalizationContext';
import { fetchPlaceSuggestions, type PlaceSuggestion, fetchPlaceDetails } from '../../services/places';

interface GuestPrefsModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSaved?: (prefs: { language: string; address: string; location?: { lat: number; lng: number }; city?: string; country?: string }) => void;
}

const languages = ['English', 'Pidgin', 'Hausa', 'Yoruba', 'Igbo'];

export const GuestPrefsModal: React.FC<GuestPrefsModalProps> = ({ visible, onDismiss, onSaved }) => {
  const theme = useTheme();
  const { t } = useLocalization();

  const [language, setLanguage] = useState('English');
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [selectedDetails, setSelectedDetails] = useState<any | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const q = address.trim();
      if (q.length < 3) {
        if (!cancelled) setSuggestions([]);
        return;
      }
      try {
        const list = await fetchPlaceSuggestions(q);
        if (!cancelled) setSuggestions(list);
      } catch {}
    };
    const tmr = setTimeout(run, 250);
    return () => { cancelled = true; clearTimeout(tmr); };
  }, [address]);

  const handleSave = async () => {
    const e: Record<string, string> = {};
    if (!address.trim()) e.address = t('onboarding.addressRequired') || 'Please enter your address';
    if (!language) e.language = t('onboarding.languageRequired') || 'Please select a language';
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    try {
      setLoading(true);
      setSaveError(null);
      const payload: any = {
        language,
        address,
        location: selectedDetails?.geometry?.location
          ? { lat: selectedDetails.geometry.location.lat, lng: selectedDetails.geometry.location.lng }
          : undefined,
        city: (selectedDetails?.address_components || []).find((c: any) => c.types?.includes('locality'))?.long_name,
        country: (selectedDetails?.address_components || []).find((c: any) => c.types?.includes('country'))?.long_name,
      };
      await ssSetItem('wakanda_guest_prefs', JSON.stringify(payload));
      await ssSetItem('wakanda_guest_prefs_seen', '1');
      if (onSaved) onSaved(payload);
      onDismiss();
    } catch (err: any) {
      setSaveError(err?.message || 'Failed to save preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionPress = async (s: PlaceSuggestion) => {
    setAddress(s.description);
    if (s.place_id) {
      const details = await fetchPlaceDetails(s.place_id);
      setSelectedDetails(details);
    }
  };

  const canSave = address.trim().length >= 3 && !!language && !loading;

  return (
    <Portal>
      {visible ? (
        <BlurView intensity={40} tint={theme.dark ? 'dark' : 'light'} style={styles.blurOverlay} pointerEvents="none" />
      ) : null}
      <Modal visible={visible} onDismiss={() => {}} dismissable={false} contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>        
        <Text variant="headlineSmall" style={styles.title}>{t('guestPrefs.title') || 'Personalize your experience'}</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>{t('guestPrefs.subtitle') || 'Set your location and language for better suggestions'}</Text>

        <TextInput
          label={t('onboarding.address') || 'Address'}
          value={address}
          onChangeText={(v) => { setAddress(v); }}
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon="map-marker" />}
          placeholder="e.g., Lekki, Lagos"
        />
        <HelperText type="error" visible={!!errors.address}>{errors.address}</HelperText>

        <View style={styles.chipsRow}>
          {suggestions.map((s) => (
            <Chip key={s.description} onPress={() => handleSuggestionPress(s)} style={styles.chip}>{s.description}</Chip>
          ))}
        </View>

        <Text variant="labelLarge" style={styles.sectionLabel}>{t('onboarding.language') || 'Language'}</Text>
        <View style={styles.chipsRow}>
          {languages.map((l) => (
            <Chip key={l} selected={language === l} onPress={() => setLanguage(l)} style={styles.chip}>{l}</Chip>
          ))}
        </View>
        <HelperText type="error" visible={!!errors.language}>{errors.language}</HelperText>
        <HelperText type="error" visible={!!saveError}>{saveError || ''}</HelperText>

        <View style={styles.actions}>
          <Button mode="contained" onPress={handleSave} loading={loading} disabled={!canSave}>
            {t('common.save') || 'Save'}
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: { margin: 16, borderRadius: 12, padding: 16 },
  blurOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  title: { textAlign: 'center', fontWeight: 'bold', marginBottom: 4 },
  subtitle: { textAlign: 'center', color: '#666', marginBottom: 12 },
  input: { marginBottom: 8 },
  sectionLabel: { marginTop: 12, marginBottom: 8 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { marginVertical: 4 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12, gap: 8 },
});

export default GuestPrefsModal;
