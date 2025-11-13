import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { Button, Text, Surface, useTheme } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useConfig } from '../../contexts/ConfigContext';
import { useLocalization } from '../../contexts/LocalizationContext';
import type { AuthStackParamList } from '../../navigation/types';

type RolePurposeModalNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'RolePurposeModal'
>;
type RolePurposeModalRouteProp = RouteProp<AuthStackParamList, 'RolePurposeModal'>;

const RolePurposeModal: React.FC = () => {
  const navigation = useNavigation<RolePurposeModalNavigationProp>();
  const route = useRoute<RolePurposeModalRouteProp>();
  const theme = useTheme();
  const { config } = useConfig();
  const { t } = useLocalization();
  const { role } = route.params;

  const handleGetVendorApp = () => {
    if (config.vendorAppUrl) {
      Linking.openURL(config.vendorAppUrl).catch((err) =>
        console.error('Error opening URL:', err)
      );
    }
  };

  const handleGetRiderApp = () => {
    if (config.riderAppUrl) {
      Linking.openURL(config.riderAppUrl).catch((err) =>
        console.error('Error opening URL:', err)
      );
    }
  };

  const handleContinueAsCustomer = () => {
    navigation.navigate('PhoneInput');
  };

  const iconName = role === 'vendor' ? 'store' : 'bike';
  const primaryAppName = role === 'vendor' ? t('auth.getVendorApp') : t('auth.getRiderApp');

  return (
    <View style={styles.container}>
      <Surface style={styles.content}>
        <MaterialCommunityIcons
          name={iconName}
          size={80}
          color={theme.colors.primary}
          style={styles.icon}
        />

        <Text variant="headlineSmall" style={styles.title}>
          {t('auth.vendorRiderTitle')}
        </Text>

        <Text variant="bodyLarge" style={styles.message}>
          {t('auth.vendorRiderMessage')}
        </Text>

        <View style={styles.buttonsContainer}>
          <Button
            mode="contained"
            onPress={role === 'vendor' ? handleGetVendorApp : handleGetRiderApp}
            style={[styles.button, styles.primaryButton]}
            contentStyle={styles.buttonContent}
          >
            {primaryAppName}
          </Button>

          {role === 'vendor' && (
            <Button
              mode="outlined"
              onPress={handleGetRiderApp}
              style={styles.button}
              contentStyle={styles.buttonContent}
              icon="bike"
            >
              {t('auth.getRiderApp')}
            </Button>
          )}

          <Button
            mode="text"
            onPress={handleContinueAsCustomer}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            {t('auth.continueAsCustomer')}
          </Button>
        </View>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    marginBottom: 8,
  },
  primaryButton: {
    marginBottom: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default RolePurposeModal;
