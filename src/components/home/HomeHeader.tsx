import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SearchBar } from '../common/SearchBar';
import { Badge } from '../common/Badge';
import { useCart } from '../../contexts/CartContext';
import { IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import type { CustomerStackParamList } from '../../navigation/types';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useLocalization } from '../../contexts/LocalizationContext';

type HomeScreenNavigationProp = StackNavigationProp<CustomerStackParamList>;

export interface HomeHeaderProps {
  onSearchPress?: () => void;
  onCameraPress?: () => void;
  onCartPress?: () => void;
  onNotificationPress?: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  onSearchPress,
  onCameraPress,
  onCartPress,
  onNotificationPress,
}) => {
  const theme = useTheme();
  const { getItemCount } = useCart();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user, isAuthenticated } = useAuth();
  const { t } = useLocalization();

  const cartItemCount = getItemCount();
  
  // Fetch unread notification count
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['notifications', 'unreadCount', user?.id],
    queryFn: () => api.notifications.getUnreadCount(user!.id),
    enabled: isAuthenticated && !!user?.id,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const notificationCount = unreadCount || 0;

  const handleCartPress = () => {
    if (onCartPress) {
      onCartPress();
    } else {
      navigation.navigate('Cart');
    }
  };

  const handleNotificationPress = () => {
    if (onNotificationPress) {
      onNotificationPress();
    } else {
      navigation.navigate('NotificationList');
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.outlineVariant,
        },
      ]}
    >
      <View style={styles.searchContainer}>
        <SearchBar
          onPress={onSearchPress}
          onCameraPress={onCameraPress}
          editable={false}
          showCameraButton={true}
          accessibilityLabel={t('home.searchProduct')}
          accessibilityHint={t('a11y.openSearchHint')}
        />
      </View>
      <View style={styles.utilitiesContainer}>
        {/* <View style={styles.iconWrapper}>
          <IconButton
            icon="shopping-outline"
            size={24}
            iconColor={theme.colors.onSurface}
            onPress={handleCartPress}
            accessibilityLabel={`Shopping cart${cartItemCount > 0 ? `, ${cartItemCount} items` : ', empty'}`}
            accessibilityRole="button"
            accessibilityHint="Opens your shopping cart"
          />
          {cartItemCount > 0 && (
            <Badge
              count={cartItemCount}
              size="small"
              style={styles.badge}
              accessibilityLabel={`${cartItemCount} items in cart`}
            />
          )}
        </View>  */}

        
          <IconButton
            icon="map-marker-outline"
            size={20}
            iconColor={theme.colors.onSurfaceVariant}
            accessibilityLabel={t('home.title') + ' location'}
            accessibilityRole="image"
            accessibilityHint={t('home.title')}
          />
       
        <View style={styles.iconWrapper}>
          <IconButton
            icon="bell-outline"
            size={24}
            iconColor={theme.colors.onSurface}
            onPress={handleNotificationPress}
            accessibilityLabel={
              notificationCount > 0
                ? `${t('notifications.title')}, ${notificationCount} ${t('notifications.newOrder').toLowerCase()}`
                : `${t('notifications.title')}, ${t('notifications.noNotifications')}`
            }
            accessibilityRole="button"
            accessibilityHint={t('notifications.title')}
            accessibilityState={{ busy: false }}
          />
          {notificationCount > 0 && (
            <Badge
              count={notificationCount}
              size="small"
              style={styles.badge}
            />
          )}
        </View>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 12,
    minHeight: 64,
  },
  searchContainer: {
    flex: 1,
  },
  utilitiesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconWrapper: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
});

export default HomeHeader;
