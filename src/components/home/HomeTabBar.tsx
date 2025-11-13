import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useTheme, Portal } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { CustomerStackParamList, AuthStackParamList } from '../../navigation/types';
import type { StackNavigationProp } from '@react-navigation/stack';
import { createShadow } from '../../utils/shadows';

type HomeTabBarNavigationProp = StackNavigationProp<CustomerStackParamList>;

// Auth stack screen names - HomeTabBar should NOT render on these
const AUTH_SCREEN_NAMES: Array<keyof AuthStackParamList> = [
  'Splash',
  'RoleSelector',
  'RolePurposeModal',
  'PhoneInput',
  'OTPVerify',
  'Onboarding',
];

export interface HomeTabBarProps {}

const tabs: Array<{
  name: keyof CustomerStackParamList;
  icon: string;
  label: string;
}> = [
  { name: 'Home', icon: 'home', label: 'Home' },
  { name: 'Vendors', icon: 'store', label: 'Vendors' },
  { name: 'Wallet', icon: 'wallet', label: 'Wallet' },
  { name: 'Messages', icon: 'message-text', label: 'Messages' },
  { name: 'Profile', icon: 'account', label: 'Profile' },
];

export const HomeTabBar: React.FC<HomeTabBarProps> = () => {
  const theme = useTheme();
  const navigation = useNavigation<HomeTabBarNavigationProp>();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const unreadCount = 0;
  
  const currentRoute = route.name;
  
  // Check if we're on an Auth/onboarding screen - don't render HomeTabBar on these
  const isAuthScreen = AUTH_SCREEN_NAMES.includes(currentRoute as keyof AuthStackParamList);
  
  // Get parent navigator to check if we're in Auth stack
  const parent = navigation.getParent();
  let parentRouteName: string | undefined;
  
  try {
    const parentState = parent?.getState();
    if (parentState?.routes && parentState.index !== undefined) {
      parentRouteName = parentState.routes[parentState.index]?.name;
    }
  } catch (e) {
    // Ignore errors accessing parent state
  }
  
  // Don't render if:
  // 1. Current route is an Auth screen
  // 2. We're in the Auth stack (parent route is 'Auth')
  if (isAuthScreen || parentRouteName === 'Auth') {
    return null;
  }
  
  // Additional check: Only render on CustomerStack main screens
  const mainCustomerScreens: Array<keyof CustomerStackParamList> = [
    'Home',
    'Vendors',
    'Wallet',
    'Messages',
    'Profile',
  ];
  
  // Don't render on detail screens or other non-main screens
  if (!mainCustomerScreens.includes(currentRoute as keyof CustomerStackParamList)) {
    return null;
  }

  // Check if this is the Home screen (has HomeHeader above it)
  const isHomeScreen = currentRoute === 'Home';

  const handleTabPress = (tabName: keyof CustomerStackParamList) => {
    if (tabName !== currentRoute) {
      navigation.navigate(tabName);
    }
  };

  const tabBarContent = (
    <View
      style={[
        styles.container,
        isHomeScreen ? styles.containerRelative : styles.containerAbsolute,
        !isHomeScreen && { top: insets.top }, // Account for safe area on non-Home screens
        {
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.outlineVariant,
        },
      ]}
    >
      {tabs.map(tab => {
        const isActive = currentRoute === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => handleTabPress(tab.name)}
            activeOpacity={0.7}
          >
            <View style={styles.iconWrapper}>
              <MaterialCommunityIcons
                name={tab.icon as any}
                size={22}
                color={isActive ? theme.colors.primary : theme.colors.onSurfaceVariant}
              />
              {tab.name === 'Messages' && unreadCount > 0 && (
                <View style={[styles.badge, { backgroundColor: theme.colors.error }]}> 
                  <Text style={[styles.badgeText, { color: theme.colors.onError }]}>
                    {unreadCount > 99 ? '99+' : String(unreadCount)}
                  </Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.label,
                {
                  color: isActive ? theme.colors.primary : theme.colors.onSurfaceVariant,
                  fontWeight: isActive ? '600' : '400',
                },
              ]}
            >
              {tab.label}
            </Text>
            {isActive && (
              <View
                style={[
                  styles.indicator,
                  {
                    backgroundColor: theme.colors.primary,
                  },
                ]}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  // Wrap in Portal for non-Home screens to ensure it's above other content
  if (isHomeScreen) {
    return tabBarContent;
  }

  return <Portal>{tabBarContent}</Portal>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    height: 56,
  },
  containerRelative: {
    // Relative positioning for Home screen (below HomeHeader)
    position: 'relative',
  },
  containerAbsolute: {
    // Absolute positioning for other main screens (sticky at top)
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    ...createShadow({
      color: '#000',
      offset: { width: 0, height: 2 },
      opacity: 0.1,
      radius: 3,
    }),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 4,
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    marginTop: 2,
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: '20%',
    height: 2,
    borderRadius: 1,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -12,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 12,
  },
});

export default HomeTabBar;

