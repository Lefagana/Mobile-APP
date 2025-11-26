import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, TextInput, HelperText, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from '../../navigation/types';
import { useAuth } from '../../contexts/AuthContext';
import * as SecureStore from 'expo-secure-store';

type Nav = StackNavigationProp<AuthStackParamList, 'SellerTwoFASetup'>;

const SellerTwoFASetup: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();

  // Debug logging
  console.log('[SellerTwoFASetup] Current user:', user);
  console.log('[SellerTwoFASetup] User role:', user?.role);

  const finish = async () => {
    await SecureStore.setItemAsync('wakanda_onboarding_complete', '1');
    const parent = navigation.getParent();

    if (parent) {
      // Route based on user role
      const targetStack = user?.role === 'vendor' ? 'Vendor' :
        user?.role === 'rider' ? 'Customer' : // Placeholder until RiderStack exists
          'Customer';

      console.log('[SellerTwoFASetup] Routing to:', targetStack);
      parent.reset({ index: 0, routes: [{ name: targetStack as never }] });
    }
  };

  return (
    <View style={styles.container}>
      <IconButton icon="arrow-left" accessibilityLabel="Back" onPress={() => navigation.goBack()} />
      <Text variant="headlineSmall" style={styles.title}>Two-Factor Authentication</Text>
      <Text variant="bodyMedium" style={styles.subtitle}>Mock setup: add a phone/email authenticator later. You can skip now and enable in settings.</Text>

      <TextInput label="Phone (for codes)" mode="outlined" style={styles.input} left={<TextInput.Icon icon="phone" />} />
      <HelperText type="info" visible>We will send verification codes to this number (mock).</HelperText>

      <Button mode="contained" onPress={finish} style={styles.button}>Finish</Button>
      <Button mode="text" onPress={finish} style={styles.button}>Skip for now</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24, justifyContent: 'center' },
  title: { textAlign: 'center', fontWeight: 'bold', marginBottom: 8 },
  subtitle: { textAlign: 'center', color: '#666', marginBottom: 16 },
  input: { marginBottom: 8 },
  button: { marginTop: 8 },
});

export default SellerTwoFASetup;
