import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Alert, Image, TouchableOpacity } from 'react-native';
import {
  Text,
  useTheme,
  TextInput,
  IconButton,
  ActivityIndicator,
  Avatar,
  Chip,
} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useRoute, useNavigation, useFocusEffect, RouteProp } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { CustomerStackParamList } from '../../navigation/types';
import { ScreenContainer, ErrorState } from '../../components/common';
import { Message } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useNetwork } from '../../contexts/NetworkContext';
import { useOfflineQueue } from '../../hooks/useOfflineQueue';
import { formatRelativeTime } from '../../utils/formatters';

type ChatWindowRouteProp = RouteProp<CustomerStackParamList, 'ChatWindow'>;

type ChatWindowNavigationProp = StackNavigationProp<CustomerStackParamList, 'ChatWindow'>;

const ChatWindow: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<ChatWindowNavigationProp>();
  const route = useRoute<ChatWindowRouteProp>();
  const { chatId } = route.params;
  const { user } = useAuth();
  const { isOnline } = useNetwork();
  const { queueAction } = useOfflineQueue();
  const queryClient = useQueryClient();
  const flatListRef = useRef<FlatList>(null);
  const [messageText, setMessageText] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [showQuickReplies, setShowQuickReplies] = useState(false);

  // Fetch chat details
  const { data: chat } = useQuery({
    queryKey: ['chat', chatId],
    queryFn: () => api.chat.getById(chatId),
  });

  // Fetch messages
  const {
    data: messages,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['chat-messages', chatId],
    queryFn: () => api.chat.messages(chatId),
    refetchInterval: 5000, // Poll every 5 seconds for new messages
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => api.chat.sendMessage(chatId, user?.id || 'user_001', content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages', chatId] });
      queryClient.invalidateQueries({ queryKey: ['chats', user?.id] });
      setMessageText('');
      // Scroll to bottom after sending
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    },
  });

  // Mark as read when screen is focused
  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        api.chat.markAsRead(chatId, user.id);
        queryClient.invalidateQueries({ queryKey: ['chats', user.id] });
      }
    }, [chatId, user?.id, queryClient])
  );

  const handlePickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to send images!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
      selectionLimit: 5 - selectedImages.length,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map(asset => asset.uri);
      setSelectedImages(prev => [...prev, ...newImages].slice(0, 5));
    }
  }, [selectedImages]);

  const handleRemoveImage = useCallback((index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const QUICK_REPLIES = [
    'Hello',
    'Thanks',
    'OK',
    'Where is my order?',
    'I need help',
  ];

  const handleQuickReply = useCallback((reply: string) => {
    setMessageText(reply);
    setShowQuickReplies(false);
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!messageText.trim() && selectedImages.length === 0) return;
    if (sendMessageMutation.isPending) return;

    const content = messageText.trim() || '';
    const attachments = selectedImages.map(uri => ({
      type: 'image',
      url: uri, // In real app, these would be uploaded to storage first
    }));
    
    // If offline, queue the message
    if (!isOnline) {
      try {
        await queueAction('message:send', {
          chatId,
          senderId: user?.id || 'user_001',
          content,
          attachments,
        });
        
        // Optimistically add message to UI
        const optimisticMessage: Message = {
          id: `temp_${Date.now()}`,
          chat_id: chatId,
          sender_id: user?.id || 'user_001',
          content,
          attachments,
          created_at: new Date().toISOString(),
          read: false,
        };
        
        // Update local cache optimistically
        queryClient.setQueryData(['chat-messages', chatId], (old: Message[] = []) => [
          ...old,
          optimisticMessage,
        ]);
        
        setMessageText('');
        setSelectedImages([]);
        
        // Scroll to bottom
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
        
        return;
      } catch (error) {
        console.error('Failed to queue message:', error);
        Alert.alert('Error', 'Failed to queue message. Please try again.');
        return;
      }
    }

    // Online: send immediately (with attachments)
    // Note: In real app, images would be uploaded first, then message sent with image URLs
    sendMessageMutation.mutate(content);
    setSelectedImages([]);
  }, [messageText, selectedImages, sendMessageMutation, isOnline, queueAction, chatId, user?.id, queryClient]);

  const renderMessage = useCallback(
    ({ item }: { item: Message }) => {
      const isOwnMessage = item.sender_id === user?.id;
      const messageTime = formatRelativeTime(item.created_at);

      return (
        <View
          style={[
            styles.messageContainer,
            isOwnMessage ? styles.ownMessageContainer : styles.otherMessageContainer,
          ]}
        >
          {!isOwnMessage && (
            <Avatar.Image
              size={32}
              source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop' }}
              style={styles.messageAvatar}
            />
          )}
          <View
            style={[
              styles.messageBubble,
              isOwnMessage
                ? { backgroundColor: theme.colors.primary, borderBottomLeftRadius: 16, borderBottomRightRadius: 4 }
                : { backgroundColor: theme.colors.surfaceVariant, borderBottomLeftRadius: 4, borderBottomRightRadius: 16 },
            ]}
          >
            {/* Image Attachments */}
            {item.attachments && item.attachments.length > 0 && (
              <View style={styles.messageImages}>
                {item.attachments
                  .filter(att => att.type === 'image')
                  .map((att, idx) => (
                    <Image
                      key={idx}
                      source={{ uri: att.url }}
                      style={styles.messageImage}
                      resizeMode="cover"
                    />
                  ))}
              </View>
            )}
            
            {/* Text Content */}
            {item.content && (
              <Text
                variant="bodyMedium"
                style={[
                  styles.messageText,
                  isOwnMessage
                    ? { color: theme.colors.onPrimary }
                    : { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {item.content}
              </Text>
            )}
            
            <Text
              variant="bodySmall"
              style={[
                styles.messageTime,
                isOwnMessage
                  ? { color: theme.colors.onPrimary }
                  : { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {messageTime}
            </Text>
          </View>
        </View>
      );
    },
    [theme, user]
  );

  // Scroll to bottom when messages load
  useEffect(() => {
    if (messages && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }
  }, [messages]);

  if (isLoading && !messages) {
    return (
      <ScreenContainer scrollable={true}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  if (isError) {
    return (
      <ScreenContainer scrollable={false}>
        <ErrorState
          title="Failed to Load Messages"
          message="Unable to load chat messages. Please try again."
          onRetry={refetch}
        />
      </ScreenContainer>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScreenContainer scrollable={false} showOfflineBanner={true}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesContainer}
          inverted={false}
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
                No messages yet. Start the conversation!
              </Text>
            </View>
          }
          refreshing={isLoading}
          onRefresh={refetch}
        />

        {/* Quick Replies */}
        {showQuickReplies && (
          <View style={[styles.quickRepliesContainer, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.quickRepliesHeader}>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Quick Replies
              </Text>
              <IconButton
                icon="close"
                size={20}
                onPress={() => setShowQuickReplies(false)}
              />
            </View>
            <View style={styles.quickRepliesList}>
              {QUICK_REPLIES.map((reply, index) => (
                <Chip
                  key={index}
                  mode="outlined"
                  onPress={() => handleQuickReply(reply)}
                  style={styles.quickReplyChip}
                >
                  {reply}
                </Chip>
              ))}
            </View>
          </View>
        )}

        {/* Selected Images Preview */}
        {selectedImages.length > 0 && (
          <View style={[styles.imagePreviewContainer, { backgroundColor: theme.colors.surface }]}>
            <FlatList
              data={selectedImages}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.imagePreviewList}
              renderItem={({ item, index }) => (
                <View style={styles.imagePreviewItem}>
                  <Image source={{ uri: item }} style={styles.imagePreview} />
                  <IconButton
                    icon="close-circle"
                    size={20}
                    style={styles.removeImageButton}
                    onPress={() => handleRemoveImage(index)}
                  />
                </View>
              )}
              keyExtractor={(item, index) => `preview-${index}`}
            />
          </View>
        )}

        {/* Message Input */}
        <View
          style={[
            styles.inputContainer,
            { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.outline },
          ]}
        >
              <IconButton
                icon="image-outline"
                size={24}
                onPress={handlePickImage}
                disabled={selectedImages.length >= 5}
              />
              <IconButton
                icon={showQuickReplies ? 'keyboard' : 'message-reply-text'}
                size={24}
                onPress={() => setShowQuickReplies(!showQuickReplies)}
              />
          <TextInput
            mode="outlined"
            placeholder="Type a message..."
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={500}
            style={styles.input}
            contentStyle={styles.inputContent}
            right={
              <TextInput.Icon
                icon="send"
                iconColor={(messageText.trim() || selectedImages.length > 0) ? theme.colors.primary : theme.colors.onSurfaceVariant}
                onPress={handleSendMessage}
                disabled={(!messageText.trim() && selectedImages.length === 0) || sendMessageMutation.isPending}
              />
            }
            onSubmitEditing={handleSendMessage}
            returnKeyType="send"
          />
          {sendMessageMutation.isPending && (
            <ActivityIndicator size="small" color={theme.colors.primary} style={styles.sendingIndicator} />
          )}
        </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
    gap: 8,
  },
  ownMessageContainer: {
    justifyContent: 'flex-end',
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    backgroundColor: '#F5F5F5',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 10,
    opacity: 0.7,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    gap: 8,
  },
  input: {
    flex: 1,
    maxHeight: 100,
  },
  inputContent: {
    maxHeight: 100,
  },
  sendingIndicator: {
    marginLeft: 8,
  },
  quickRepliesContainer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  quickRepliesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickRepliesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickReplyChip: {
    marginRight: 8,
    marginBottom: 4,
  },
  imagePreviewContainer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  imagePreviewList: {
    gap: 8,
  },
  imagePreviewItem: {
    position: 'relative',
    marginRight: 8,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    margin: 0,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  messageImages: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
});

export default ChatWindow;

