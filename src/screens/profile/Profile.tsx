import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import {
  Text,
  useTheme,
  Card,
  Avatar,
  List,
  Divider,
  IconButton,
  Button,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { CustomerStackParamList } from '../../navigation/types';
import { ScreenContainer, LoginPromptModal } from '../../components/common';
import { HomeTabBar } from '../../components/home';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthGuard } from '../../utils/authGuard';

type ProfileNavigationProp = StackNavigationProp<CustomerStackParamList, 'Profile'>;

const Profile: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<ProfileNavigationProp>();
  const { user, isAuthenticated, logout } = useAuth();
  const { handleLoginSuccess, dismissLoginPrompt } = useAuthGuard();
  const [loginModalVisible, setLoginModalVisible] = useState(true);

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleOrders = () => {
    navigation.navigate('OrdersList');
  };

  const handleAddressBook = () => {
    navigation.navigate('AddressBook');
  };

  const handlePaymentMethods = () => {
    navigation.navigate('PaymentMethods');
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  const handleNotifications = () => {
    navigation.navigate('Notifications');
  };

  const handleNotificationList = () => {
    navigation.navigate('NotificationList');
  };

  const handleDebug = () => {
    navigation.navigate('Debug');
  };

  const handleHelpCenter = () => {
    navigation.navigate('HelpCenter');
  };

  const handleLogout = () => {
    logout();
  };

  if (!isAuthenticated) {
    return (
      <ScreenContainer scrollable={false}>
        <HomeTabBar />
        <View style={styles.loadingContainer}>
          <Text variant="headlineSmall" style={{ marginBottom: 16, textAlign: 'center' }}>
            Profile
          </Text>
          <Text variant="bodyMedium" style={{ marginBottom: 16, textAlign: 'center' }}>
            Please login to access your profile
          </Text>
          <LoginPromptModal
            visible={loginModalVisible}
            onDismiss={() => setLoginModalVisible(false)}
            message="Please login to access your profile and account settings"
            onLoginSuccess={handleLoginSuccess}
          />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable={false} showOfflineBanner={true}>
      <HomeTabBar />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <Card style={[styles.profileCard, { backgroundColor: theme.colors.primaryContainer }]}>
          <View style={styles.profileHeader}>
            <Avatar.Image
              size={80}
              source={{
                uri: user?.profile_pic || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
              }}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Text variant="headlineSmall" style={{ color: theme.colors.onPrimaryContainer, fontWeight: '600' }}>
                {user?.name || 'User'}
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onPrimaryContainer, marginTop: 4 }}>
                {user?.phone}
              </Text>
              {user?.email && (
                <Text variant="bodySmall" style={{ color: theme.colors.onPrimaryContainer, marginTop: 4 }}>
                  {user.email}
                </Text>
              )}
            </View>
            <IconButton
              icon="pencil"
              size={24}
              iconColor={theme.colors.onPrimaryContainer}
              onPress={handleEditProfile}
            />
          </View>
        </Card>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickActionButton, { backgroundColor: theme.colors.surface }]}
            onPress={handleOrders}
          >
            <IconButton icon="package-variant" size={32} iconColor={theme.colors.primary} />
            <Text variant="bodySmall" style={{ color: theme.colors.onSurface, marginTop: 4 }}>
              Orders
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickActionButton, { backgroundColor: theme.colors.surface }]}
            onPress={() => navigation.navigate('Wallet')}
          >
            <IconButton icon="wallet" size={32} iconColor={theme.colors.primary} />
            <Text variant="bodySmall" style={{ color: theme.colors.onSurface, marginTop: 4 }}>
              Wallet
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickActionButton, { backgroundColor: theme.colors.surface }]}
            onPress={() => navigation.navigate('Messages')}
          >
            <IconButton icon="message-text" size={32} iconColor={theme.colors.primary} />
            <Text variant="bodySmall" style={{ color: theme.colors.onSurface, marginTop: 4 }}>
              Messages
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickActionButton, { backgroundColor: theme.colors.surface }]}
            onPress={handleAddressBook}
          >
            <IconButton icon="map-marker" size={32} iconColor={theme.colors.primary} />
            <Text variant="bodySmall" style={{ color: theme.colors.onSurface, marginTop: 4 }}>
              Addresses
            </Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <Card style={[styles.menuCard, { backgroundColor: theme.colors.surface }]}>
          <List.Item
            title="Edit Profile"
            description="Update your personal information"
            left={(props) => <List.Icon {...props} icon="account-edit" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleEditProfile}
          />
          <Divider />
          <List.Item
            title="Address Book"
            description="Manage your delivery addresses"
            left={(props) => <List.Icon {...props} icon="map-marker-multiple" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleAddressBook}
          />
          <Divider />
          <List.Item
            title="Payment Methods"
            description="Manage your payment options"
            left={(props) => <List.Icon {...props} icon="credit-card" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handlePaymentMethods}
          />
          <Divider />
          <List.Item
            title="Notifications"
            description="Manage your notification preferences"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleNotifications}
          />
          <Divider />
          <List.Item
            title="In-App Notifications"
            description="View your notification history"
            left={(props) => <List.Icon {...props} icon="bell-ring" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleNotificationList}
          />
          <Divider />
          <List.Item
            title="Settings"
            description="App settings and preferences"
            left={(props) => <List.Icon {...props} icon="cog" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleSettings}
          />
          <Divider />
          <List.Item
            title="Help & Support"
            description="Get help and contact support"
            left={(props) => <List.Icon {...props} icon="help-circle" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleHelpCenter}
          />
          <Divider />
          <List.Item
            title="Debug Tools"
            description="Development and testing utilities"
            left={(props) => <List.Icon {...props} icon="bug" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleDebug}
          />
        </Card>

        {/* Logout Button */}
        <Button
          mode="outlined"
          icon="logout"
          onPress={handleLogout}
          style={styles.logoutButton}
          textColor={theme.colors.error}
        >
          Logout
        </Button>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 56, // Padding for sticky HomeTabBar
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  profileCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    backgroundColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  menuCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 8,
  },
});

export default Profile;
