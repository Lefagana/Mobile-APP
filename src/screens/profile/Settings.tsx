import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  useTheme,
  Card,
  List,
  Divider,
  Switch,
  Button,
} from 'react-native-paper';
import { ScreenContainer } from '../../components/common';
import { useLocalization } from '../../contexts/LocalizationContext';

const Settings: React.FC = () => {
  const theme = useTheme();
  const { language, setLanguage, t } = useLocalization();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const handleLanguageChange = () => {
    // Cycle through available languages
    const languages = ['en', 'pidgin', 'hausa'];
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  const handleClearCache = () => {
    console.log('Clear cache');
  };

  const handleAbout = () => {
    console.log('About');
  };

  return (
    <ScreenContainer scrollable={false} showOfflineBanner={true}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* App Settings */}
        <Card style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16, fontWeight: '600' }}>
            App Settings
          </Text>
          <List.Item
            title="Language"
            description={language === 'en' ? 'English' : language === 'pidgin' ? 'Pidgin' : 'Hausa'}
            left={(props) => <List.Icon {...props} icon="translate" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleLanguageChange}
          />
          <Divider />
          <List.Item
            title="Notifications"
            description="Enable push notifications"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
            )}
          />
          <Divider />
          <List.Item
            title="Location Services"
            description="Allow app to access your location"
            left={(props) => <List.Icon {...props} icon="map-marker" />}
            right={() => (
              <Switch value={locationEnabled} onValueChange={setLocationEnabled} />
            )}
          />
          <Divider />
          <List.Item
            title="Biometric Login"
            description="Use fingerprint or face ID"
            left={(props) => <List.Icon {...props} icon="fingerprint" />}
            right={() => (
              <Switch value={biometricEnabled} onValueChange={setBiometricEnabled} />
            )}
          />
        </Card>

        {/* Data & Storage */}
        <Card style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16, fontWeight: '600' }}>
            Data & Storage
          </Text>
          <List.Item
            title="Clear Cache"
            description="Free up storage space"
            left={(props) => <List.Icon {...props} icon="delete" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleClearCache}
          />
          <Divider />
          <List.Item
            title="Download Offline Data"
            description="Store data for offline use"
            left={(props) => <List.Icon {...props} icon="download" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('Download offline data')}
          />
        </Card>

        {/* About */}
        <Card style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16, fontWeight: '600' }}>
            About
          </Text>
          <List.Item
            title="App Version"
            description="1.0.0"
            left={(props) => <List.Icon {...props} icon="information" />}
          />
          <Divider />
          <List.Item
            title="Terms & Conditions"
            left={(props) => <List.Icon {...props} icon="file-document" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('Terms & Conditions')}
          />
          <Divider />
          <List.Item
            title="Privacy Policy"
            left={(props) => <List.Icon {...props} icon="shield-lock" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('Privacy Policy')}
          />
          <Divider />
          <List.Item
            title="About Wakanda"
            left={(props) => <List.Icon {...props} icon="information-outline" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleAbout}
          />
        </Card>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  sectionCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
});

export default Settings;

