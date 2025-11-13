import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import {
  Text,
  useTheme,
  Card,
  Button,
  Switch,
  Divider,
  List,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { ScreenContainer } from '../../components/common';
import { useConfig } from '../../contexts/ConfigContext';
import { useNetwork } from '../../contexts/NetworkContext';
import { useAuth } from '../../contexts/AuthContext';
import { useOfflineQueue } from '../../hooks';

const DebugScreen: React.FC = () => {
  const theme = useTheme();
  const { config, updateConfig } = useConfig();
  const { isOnline } = useNetwork();
  const { user } = useAuth();
  const { queue, clearQueue, isProcessing } = useOfflineQueue();
  
  const [mockLatency, setMockLatency] = useState(800);
  const [forcePaymentSuccess, setForcePaymentSuccess] = useState(true);
  const [cachedData, setCachedData] = useState<any>(null);

  const handleClearStorage = async () => {
    try {
      await AsyncStorage.clear();
      await SecureStore.deleteItemAsync('wakanda_access_token');
      await SecureStore.deleteItemAsync('wakanda_refresh_token');
      alert('All local storage cleared!');
    } catch (error) {
      alert('Error clearing storage: ' + error);
    }
  };

  const handleViewCachedData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const data: any = {};
      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          try {
            data[key] = JSON.parse(value);
          } catch {
            data[key] = value;
          }
        }
      }
      setCachedData(data);
    } catch (error) {
      alert('Error reading cache: ' + error);
    }
  };

  const handleToggleMockMode = () => {
    updateConfig({ MOCK_MODE: !config.MOCK_MODE });
  };

  return (
    <ScreenContainer scrollable={true} showOfflineBanner={true}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text variant="titleLarge" style={{ marginBottom: 16, fontWeight: '600' }}>
            Debug Panel
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 16 }}>
            Development tools and utilities
          </Text>
        </Card>

        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text variant="titleMedium" style={{ marginBottom: 16, fontWeight: '600' }}>
            Environment Info
          </Text>
          <List.Item
            title="Environment"
            description={config.ENVIRONMENT || 'development'}
            left={(props) => <List.Icon {...props} icon="information" />}
          />
          <Divider />
          <List.Item
            title="Mock Mode"
            description={config.MOCK_MODE ? 'Enabled' : 'Disabled'}
            left={(props) => <List.Icon {...props} icon="test-tube" />}
            right={() => (
              <Switch
                value={config.MOCK_MODE}
                onValueChange={handleToggleMockMode}
              />
            )}
          />
          <Divider />
          <List.Item
            title="API Base URL"
            description={config.apiBaseUrl || 'Not set'}
            left={(props) => <List.Icon {...props} icon="web" />}
          />
          <Divider />
          <List.Item
            title="Network Status"
            description={isOnline ? 'Online' : 'Offline'}
            left={(props) => <List.Icon {...props} icon={isOnline ? 'wifi' : 'wifi-off'} />}
          />
          <Divider />
          <List.Item
            title="User ID"
            description={user?.id || 'Not logged in'}
            left={(props) => <List.Icon {...props} icon="account" />}
          />
        </Card>

        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text variant="titleMedium" style={{ marginBottom: 16, fontWeight: '600' }}>
            Mock Settings
          </Text>
          <List.Item
            title="Mock Latency (ms)"
            description={`${mockLatency}ms`}
            left={(props) => <List.Icon {...props} icon="timer" />}
          />
          <Divider />
          <List.Item
            title="Force Payment Success"
            description={forcePaymentSuccess ? 'Yes' : 'No'}
            left={(props) => <List.Icon {...props} icon="credit-card-check" />}
            right={() => (
              <Switch
                value={forcePaymentSuccess}
                onValueChange={setForcePaymentSuccess}
              />
            )}
          />
        </Card>

        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text variant="titleMedium" style={{ marginBottom: 16, fontWeight: '600' }}>
            Offline Queue
          </Text>
          <List.Item
            title="Queue Status"
            description={isProcessing ? 'Processing...' : `${queue.length} items`}
            left={(props) => <List.Icon {...props} icon="queue" />}
          />
          <Divider />
          <Button
            mode="outlined"
            onPress={clearQueue}
            disabled={queue.length === 0}
            style={{ marginTop: 8 }}
          >
            Clear Queue
          </Button>
        </Card>

        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text variant="titleMedium" style={{ marginBottom: 16, fontWeight: '600' }}>
            Storage Management
          </Text>
          <Button
            mode="contained"
            onPress={handleClearStorage}
            buttonColor={theme.colors.error}
            style={{ marginBottom: 8 }}
          >
            Clear All Storage
          </Button>
          <Button
            mode="outlined"
            onPress={handleViewCachedData}
          >
            View Cached Data
          </Button>
          {cachedData && (
            <View style={styles.cacheDataContainer}>
              <Text variant="bodySmall" style={{ fontFamily: 'monospace' }}>
                {JSON.stringify(cachedData, null, 2)}
              </Text>
            </View>
          )}
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
  },
  card: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  cacheDataContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    maxHeight: 300,
  },
});

export default DebugScreen;



