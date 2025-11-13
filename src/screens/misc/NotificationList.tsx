import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, RefreshControl, FlatList, ScrollView } from 'react-native';
import {
  Text,
  useTheme,
  Card,
  IconButton,
  List,
  Divider,
  Badge,
  ActivityIndicator,
  Chip,
  Button,
} from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { ScreenContainer, EmptyState, ErrorState } from '../../components/common';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { Notification } from '../../types';
import { formatRelativeTime } from '../../utils/formatters';
import type { CustomerStackParamList } from '../../navigation/types';

type NavigationProp = StackNavigationProp<CustomerStackParamList>;

const NotificationList: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Fetch notifications
  const {
    data: notifications = [],
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['notifications', user?.id, filter],
    queryFn: () =>
      api.notifications.list(user!.id, {
        unread_only: filter === 'unread',
      }),
    enabled: isAuthenticated && !!user?.id,
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) =>
      api.notifications.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unreadCount'] });
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: () => api.notifications.markAllAsRead(user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unreadCount'] });
    },
  });

  const handleNotificationPress = (notification: Notification) => {
    // Mark as read
    if (!notification.read) {
      markAsReadMutation.mutate(notification.id);
    }

    // Navigate to deep link if available
    if (notification.deep_link) {
      const { screen, params } = notification.deep_link;
      navigation.navigate(screen as any, params);
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const getNotificationIcon = (type: string, icon?: string) => {
    if (icon) return icon;
    switch (type) {
      case 'order':
        return 'package-variant';
      case 'delivery':
        return 'truck-delivery';
      case 'message':
        return 'message-text';
      case 'promotion':
        return 'tag';
      case 'payment':
        return 'credit-card';
      case 'system':
        return 'information';
      default:
        return 'bell';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'order':
        return theme.colors.primary;
      case 'delivery':
        return theme.colors.primary;
      case 'message':
        return '#4CAF50';
      case 'promotion':
        return '#FF9800';
      case 'payment':
        return '#2196F3';
      case 'system':
        return theme.colors.secondary;
      default:
        return theme.colors.primary;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      onPress={() => handleNotificationPress(item)}
      activeOpacity={0.7}
    >
      <Card
        style={[
          styles.notificationCard,
          {
            backgroundColor: item.read
              ? theme.colors.surface
              : theme.colors.primaryContainer + '20',
            borderLeftWidth: item.read ? 0 : 4,
            borderLeftColor: getNotificationColor(item.type),
          },
        ]}
      >
        <List.Item
          title={item.title}
          description={item.message}
          titleStyle={[
            styles.title,
            !item.read && { fontWeight: '600' },
          ]}
          descriptionStyle={styles.description}
          left={(props) => (
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: getNotificationColor(item.type) + '20' },
              ]}
            >
              <List.Icon
                {...props}
                icon={getNotificationIcon(item.type, item.icon)}
                color={getNotificationColor(item.type)}
              />
            </View>
          )}
          right={() => (
            <View style={styles.rightContent}>
              <Text
                variant="labelSmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                {formatRelativeTime(item.created_at)}
              </Text>
              {!item.read && (
                <View
                  style={[
                    styles.unreadDot,
                    { backgroundColor: theme.colors.primary },
                  ]}
                />
              )}
            </View>
          )}
        />
      </Card>
    </TouchableOpacity>
  );

  if (!isAuthenticated || !user) {
    return (
      <ScreenContainer scrollable={false} showOfflineBanner={true}>
        <View style={styles.loadingContainer}>
          <EmptyState
            icon="account-alert"
            title="Authentication Required"
            message="Please log in to view notifications"
          />
        </View>
      </ScreenContainer>
    );
  }

  if (isLoading) {
    return (
      <ScreenContainer scrollable={false} showOfflineBanner={true}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text variant="bodyMedium" style={{ marginTop: 16, color: theme.colors.onSurfaceVariant }}>
            Loading notifications...
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  if (isError) {
    return (
      <ScreenContainer scrollable={false} showOfflineBanner={true}>
        <ErrorState
          title="Failed to Load Notifications"
          message="Unable to load your notifications. Please try again."
          onRetry={refetch}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable={false} showOfflineBanner={true}>
      <View style={styles.container}>
        {/* Header */}
        <View
          style={[
            styles.header,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
            Notifications
          </Text>
          {unreadCount > 0 && (
            <Button
              mode="text"
              onPress={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending}
              compact
            >
              Mark all as read
            </Button>
          )}
        </View>

        {/* Filter Tabs */}
        <View style={[styles.filterContainer, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.outline }]}>
          <Chip
            mode={filter === 'all' ? 'flat' : 'outlined'}
            selected={filter === 'all'}
            onPress={() => setFilter('all')}
            style={[styles.filterChip, filter === 'all' && { backgroundColor: theme.colors.primaryContainer }]}
            textStyle={{ color: filter === 'all' ? theme.colors.onPrimaryContainer : theme.colors.onSurface }}
          >
            All {notifications.length > 0 && `(${notifications.length})`}
          </Chip>
          <Chip
            mode={filter === 'unread' ? 'flat' : 'outlined'}
            selected={filter === 'unread'}
            onPress={() => setFilter('unread')}
            style={[styles.filterChip, filter === 'unread' && { backgroundColor: theme.colors.primaryContainer }]}
            textStyle={{ color: filter === 'unread' ? theme.colors.onPrimaryContainer : theme.colors.onSurface }}
          >
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </Chip>
        </View>

        {/* Notifications List */}
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContentContainer}
          ListEmptyComponent={() => (
            <EmptyState
              icon="bell-off"
              title={filter === 'unread' ? 'No Unread Notifications' : 'No Notifications'}
              message={
                filter === 'unread'
                  ? "You're all caught up!"
                  : 'You will see notifications here when you receive updates'
              }
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={theme.colors.primary}
            />
          }
          ItemSeparatorComponent={() => <Divider />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  markAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  filterChip: {
    borderRadius: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  listContentContainer: {
    paddingVertical: 8,
  },
  notificationCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 1,
  },
  title: {
    fontSize: 14,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    lineHeight: 18,
  },
  iconContainer: {
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  rightContent: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 4,
  },
});

export default NotificationList;



