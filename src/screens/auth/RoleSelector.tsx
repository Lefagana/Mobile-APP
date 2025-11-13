import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalization } from '../../contexts/LocalizationContext';
import type { AuthStackParamList } from '../../navigation/types';

type RoleSelectorScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'RoleSelector'>;

const RoleSelector: React.FC = () => {
  const navigation = useNavigation<RoleSelectorScreenNavigationProp>();
  const theme = useTheme();
  const { t } = useLocalization();

  const handleRoleSelect = (role: 'customer' | 'vendor' | 'rider') => {
    if (role === 'customer') {
      // Go to customer single-page signup, followed by 2-step onboarding
      navigation.navigate('CustomerSignUp');
    } else if (role === 'vendor') {
      // Go to seller multi-step wizard with compliance and training
      navigation.navigate('SellerSignUpWizard');
    } else {
      // Go to rider multi-step wizard
      navigation.navigate('RiderSignUpWizard');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          {t('auth.welcome')}
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          {t('auth.selectRole')}
        </Text>
      </View>

      <View style={styles.cardsContainer}>
        {/* Customer Card */}
        <Card
          style={[styles.card, { borderColor: theme.colors.primary }]}
          onPress={() => handleRoleSelect('customer')}
        >
          <Card.Content style={styles.cardContent}>
            <MaterialCommunityIcons
              name="account-circle"
              size={64}
              color={theme.colors.primary}
              style={styles.icon}
            />
            <Text variant="titleLarge" style={styles.cardTitle}>
              {t('auth.customer')}
            </Text>
            <Text variant="bodyMedium" style={styles.cardDescription}>
              {t('auth.customerDesc')}
            </Text>
          </Card.Content>
        </Card>

        {/* Vendor Card */}
        <Card
          style={styles.card}
          onPress={() => handleRoleSelect('vendor')}
        >
          <Card.Content style={styles.cardContent}>
            <MaterialCommunityIcons
              name="store"
              size={64}
              color={theme.colors.secondary}
              style={styles.icon}
            />
            <Text variant="titleLarge" style={styles.cardTitle}>
              {t('auth.vendor')}
            </Text>
            <Text variant="bodyMedium" style={styles.cardDescription}>
              {t('auth.vendorDesc')}
            </Text>
          </Card.Content>
        </Card>

        {/* Rider Card */}
        <Card
          style={styles.card}
          onPress={() => handleRoleSelect('rider')}
        >
          <Card.Content style={styles.cardContent}>
            <MaterialCommunityIcons
              name="bike"
              size={64}
              color={theme.colors.tertiary}
              style={styles.icon}
            />
            <Text variant="titleLarge" style={styles.cardTitle}>
              {t('auth.rider')}
            </Text>
            <Text variant="bodyMedium" style={styles.cardDescription}>
              {t('auth.riderDesc')}
            </Text>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    padding: 24,
    paddingTop: 48,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#666666',
    textAlign: 'center',
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  cardContent: {
    alignItems: 'center',
    padding: 24,
  },
  icon: {
    marginBottom: 16,
  },
  cardTitle: {
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardDescription: {
    color: '#666666',
    textAlign: 'center',
  },
});

export default RoleSelector;
