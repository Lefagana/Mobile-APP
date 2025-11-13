import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  useTheme,
  Card,
  List,
  Divider,
  Switch,
} from 'react-native-paper';
import { ScreenContainer } from '../../components/common';

const Notifications: React.FC = () => {
  const theme = useTheme();
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotions, setPromotions] = useState(true);
  const [messages, setMessages] = useState(true);
  const [paymentReminders, setPaymentReminders] = useState(false);
  const [deliveryAlerts, setDeliveryAlerts] = useState(true);
  const [systemUpdates, setSystemUpdates] = useState(false);

  return (
    <ScreenContainer scrollable={false} showOfflineBanner={true}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Card style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16, fontWeight: '600' }}>
            Order Notifications
          </Text>
          <List.Item
            title="Order Updates"
            description="Notifications about your order status"
            left={(props) => <List.Icon {...props} icon="package-variant" />}
            right={() => (
              <Switch value={orderUpdates} onValueChange={setOrderUpdates} />
            )}
          />
          <Divider />
          <List.Item
            title="Delivery Alerts"
            description="Get notified when your order is out for delivery"
            left={(props) => <List.Icon {...props} icon="truck-delivery" />}
            right={() => (
              <Switch value={deliveryAlerts} onValueChange={setDeliveryAlerts} />
            )}
          />
        </Card>

        <Card style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16, fontWeight: '600' }}>
            Messages
          </Text>
          <List.Item
            title="New Messages"
            description="Notifications when you receive messages"
            left={(props) => <List.Icon {...props} icon="message-text" />}
            right={() => (
              <Switch value={messages} onValueChange={setMessages} />
            )}
          />
        </Card>

        <Card style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16, fontWeight: '600' }}>
            Marketing & Promotions
          </Text>
          <List.Item
            title="Promotions & Offers"
            description="Get notified about deals and discounts"
            left={(props) => <List.Icon {...props} icon="tag" />}
            right={() => (
              <Switch value={promotions} onValueChange={setPromotions} />
            )}
          />
        </Card>

        <Card style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16, fontWeight: '600' }}>
            Reminders
          </Text>
          <List.Item
            title="Payment Reminders"
            description="Reminders for pending payments"
            left={(props) => <List.Icon {...props} icon="credit-card" />}
            right={() => (
              <Switch value={paymentReminders} onValueChange={setPaymentReminders} />
            )}
          />
          <Divider />
          <List.Item
            title="System Updates"
            description="Important app updates and announcements"
            left={(props) => <List.Icon {...props} icon="update" />}
            right={() => (
              <Switch value={systemUpdates} onValueChange={setSystemUpdates} />
            )}
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

export default Notifications;

