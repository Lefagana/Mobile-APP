import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import {
  Text,
  useTheme,
  Card,
  List,
  Divider,
  IconButton,
  Button,
} from 'react-native-paper';
import { ScreenContainer } from '../../components/common';

const HelpCenter: React.FC = () => {
  const theme = useTheme();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const faqSections = [
    {
      id: 'orders',
      title: 'Orders & Delivery',
      questions: [
        {
          q: 'How do I track my order?',
          a: 'You can track your order from the Orders screen. For orders out for delivery, you can use the Live Tracking feature to see real-time updates.',
        },
        {
          q: 'How long does delivery take?',
          a: 'Delivery times vary by location and vendor. Typically, orders are delivered within 30-60 minutes for local orders.',
        },
        {
          q: 'Can I cancel my order?',
          a: 'You can cancel orders that are still pending. Once accepted by the vendor, cancellation may not be possible.',
        },
      ],
    },
    {
      id: 'payments',
      title: 'Payments & Wallet',
      questions: [
        {
          q: 'What payment methods are accepted?',
          a: 'We accept Paystack (cards), Wallet, Cash on Delivery, USSD, and Bank Transfer.',
        },
        {
          q: 'How do I top up my wallet?',
          a: 'Go to Wallet screen and tap "Top Up". You can choose from quick amounts or enter a custom amount.',
        },
        {
          q: 'Is my payment information secure?',
          a: 'Yes, all payment information is encrypted and secure. We use industry-standard security measures.',
        },
      ],
    },
    {
      id: 'account',
      title: 'Account & Profile',
      questions: [
        {
          q: 'How do I update my profile?',
          a: 'Go to Profile screen and tap "Edit Profile". You can update your name and email.',
        },
        {
          q: 'Can I change my phone number?',
          a: 'Phone number changes require verification. Please contact support for assistance.',
        },
      ],
    },
  ];

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@wakanda.com');
  };

  const handleCallSupport = () => {
    Linking.openURL('tel:+2348000000000');
  };

  return (
    <ScreenContainer scrollable={false} showOfflineBanner={true}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Contact Support */}
        <Card style={[styles.sectionCard, { backgroundColor: theme.colors.primaryContainer }]}>
          <Text variant="titleLarge" style={{ color: theme.colors.onPrimaryContainer, marginBottom: 8, fontWeight: '600' }}>
            Need Help?
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onPrimaryContainer, marginBottom: 16 }}>
            Our support team is here to help you 24/7
          </Text>
          <View style={styles.contactButtons}>
            <Button
              mode="contained"
              icon="phone"
              onPress={handleCallSupport}
              style={styles.contactButton}
              buttonColor={theme.colors.primary}
            >
              Call Support
            </Button>
            <Button
              mode="outlined"
              icon="email"
              onPress={handleContactSupport}
              style={styles.contactButton}
              textColor={theme.colors.onPrimaryContainer}
            >
              Email Support
            </Button>
          </View>
        </Card>

        {/* FAQ Sections */}
        {faqSections.map((section) => (
          <Card
            key={section.id}
            style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}
          >
            <TouchableOpacity
              onPress={() => toggleSection(section.id)}
              style={styles.sectionHeader}
            >
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                {section.title}
              </Text>
              <IconButton
                icon={expandedSections[section.id] ? 'chevron-up' : 'chevron-down'}
                size={24}
                iconColor={theme.colors.onSurface}
              />
            </TouchableOpacity>

            {expandedSections[section.id] && (
              <>
                {section.questions.map((faq, index) => (
                  <View key={index}>
                    {index > 0 && <Divider />}
                    <View style={styles.faqItem}>
                      <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, fontWeight: '600', marginBottom: 8 }}>
                        {faq.q}
                      </Text>
                      <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                        {faq.a}
                      </Text>
                    </View>
                  </View>
                ))}
              </>
            )}
          </Card>
        ))}

        {/* Quick Links */}
        <Card style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16, fontWeight: '600' }}>
            Quick Links
          </Text>
          <List.Item
            title="Track Order"
            left={(props) => <List.Icon {...props} icon="package-variant" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('Track Order')}
          />
          <Divider />
          <List.Item
            title="Order History"
            left={(props) => <List.Icon {...props} icon="history" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('Order History')}
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
  contactButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  contactButton: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  faqItem: {
    paddingVertical: 12,
  },
});

export default HelpCenter;

