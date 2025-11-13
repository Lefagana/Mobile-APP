import React, { useCallback, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import {
  Text,
  useTheme,
  ActivityIndicator,
  Card,
  Avatar,
  Chip,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { CustomerStackParamList } from '../../navigation/types';
import { ScreenContainer, EmptyState, ErrorState, LoginPromptModal } from '../../components/common';
import { HomeTabBar } from '../../components/home';
import { Chat } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthGuard } from '../../utils/authGuard';
import { formatRelativeTime } from '../../utils/formatters';

type ConversationListNavigationProp = StackNavigationProp<CustomerStackParamList, 'Messages'>;

const ConversationList: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<ConversationListNavigationProp>();
  const { user, isAuthenticated } = useAuth();
  const { handleLoginSuccess, dismissLoginPrompt } = useAuthGuard();
  const [loginModalVisible, setLoginModalVisible] = useState(true);

  // Fetch conversations
  const {
    data: conversations,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['chats', user?.id],
    queryFn: () => api.chat.list(user?.id || 'user_001'),
    enabled: !!user?.id && isAuthenticated,
  });

  const handleConversationPress = useCallback(
    (chat: Chat) => {
      navigation.navigate('ChatWindow', { chatId: chat.id });
    },
    [navigation]
  );

  const getParticipantName = (chat: Chat): string => {
    // In real app, would fetch participant details
    // For now, use IDs to determine type
    const otherParticipant = chat.participants.find((p) => p !== user?.id);
    if (otherParticipant?.startsWith('vend_')) {
      return 'Vendor';
    }
    if (otherParticipant?.startsWith('rider_')) {
      return 'Delivery Rider';
    }
    return 'User';
  };

  const getParticipantAvatar = (chat: Chat): string => {
    // In real app, would fetch participant avatar
    return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop';
  };

  const renderConversation = useCallback(
    ({ item }: { item: Chat }) => {
      const participantName = getParticipantName(item);
      const avatar = getParticipantAvatar(item);

      return (
        <TouchableOpacity onPress={() => handleConversationPress(item)}>
          <Card style={[styles.conversationCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.conversationRow}>
              <Avatar.Image
                size={56}
                source={{ uri: avatar }}
                style={styles.avatar}
              />
              <View style={styles.conversationDetails}>
                <View style={styles.conversationHeader}>
                  <View style={styles.conversationInfo}>
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                      {participantName}
                    </Text>
                    {item.order_id && (
                      <Chip
                        style={[styles.orderChip, { backgroundColor: theme.colors.primaryContainer }]}
                        textStyle={{ color: theme.colors.onPrimaryContainer, fontSize: 10 }}
                      >
                        {item.order_id}
                      </Chip>
                    )}
                  </View>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {formatRelativeTime(item.updated_at)}
                  </Text>
                </View>
                <View style={styles.lastMessageRow}>
                  <Text
                    variant="bodyMedium"
                    style={{ color: theme.colors.onSurfaceVariant, flex: 1 }}
                    numberOfLines={1}
                  >
                    {item.last_message || 'No messages yet'}
                  </Text>
                  {item.unread_count && item.unread_count > 0 && (
                    <Chip
                      style={[styles.unreadBadge, { backgroundColor: theme.colors.primary }]}
                      textStyle={{ color: theme.colors.onPrimary, fontSize: 12, fontWeight: '600' }}
                    >
                      {item.unread_count}
                    </Chip>
                  )}
                </View>
              </View>
            </View>
          </Card>
        </TouchableOpacity>
      );
    },
    [theme, user, handleConversationPress]
  );

  if (!isAuthenticated) {
    return (
      <ScreenContainer scrollable={false}>
        <HomeTabBar />
        <View style={styles.loadingContainer}>
          <Text variant="headlineSmall" style={{ marginBottom: 16, textAlign: 'center' }}>
            Messages
          </Text>
          <Text variant="bodyMedium" style={{ marginBottom: 16, textAlign: 'center' }}>
            Please login to access your messages
          </Text>
          <LoginPromptModal
            visible={loginModalVisible}
            onDismiss={() => setLoginModalVisible(false)}
            message="Please login to access your messages and chat with vendors"
            onLoginSuccess={handleLoginSuccess}
          />
        </View>
      </ScreenContainer>
    );
  }

  if (isLoading) {
    return (
      <ScreenContainer scrollable={false}>
        <HomeTabBar />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  if (isError) {
    return (
      <ScreenContainer scrollable={false}>
        <HomeTabBar />
        <ErrorState
          title="Failed to Load Conversations"
          message="Unable to load your conversations. Please try again."
          onRetry={refetch}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable={false} showOfflineBanner={true}>
      <HomeTabBar />
      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.conversationsContainer}
        ListEmptyComponent={
          <EmptyState
            icon="message-text-outline"
            title="No conversations"
            description="You don't have any conversations yet. Start chatting with vendors or riders about your orders."
          />
        }
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={refetch}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    paddingTop: 88, // Padding for sticky HomeTabBar (56) + extra spacing (32)
  },
  conversationsContainer: {
    padding: 16,
    paddingTop: 80, // Padding for sticky HomeTabBar (56) + safe area + extra spacing
    paddingBottom: 20,
  },
  conversationCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  conversationRow: {
    flexDirection: 'row',
    gap: 12,
  },
  avatar: {
    backgroundColor: '#F5F5F5',
  },
  conversationDetails: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  conversationInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  orderChip: {
    height: 20,
  },
  lastMessageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unreadBadge: {
    height: 24,
    minWidth: 24,
  },
});

export default ConversationList;
