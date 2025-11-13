import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, useTheme, Button, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { CustomerStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/common';

const InternationalComingSoon: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<StackNavigationProp<CustomerStackParamList>>();

  return (
    <ScreenContainer scrollable={false} showOfflineBanner={true}>
      <View style={styles.container}>
        <Card style={[styles.card, { backgroundColor: theme.colors.secondaryContainer }]}> 
          <Card.Content>
            <Text variant="headlineSmall" style={{ color: theme.colors.onSecondaryContainer, fontWeight: '700' }}>
              International Mart
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSecondaryContainer, marginTop: 8 }}>
              We are preparing a seamless cross-border shopping experience for you. Stay tuned — launching soon!
            </Text>
            <Button
              mode="contained"
              style={{ marginTop: 16 }}
              onPress={() => navigation.goBack()}
            >
              Go Back
            </Button>
          </Card.Content>
        </Card>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    padding: 8,
    borderRadius: 16,
    width: '100%',
  },
});

export default InternationalComingSoon;
