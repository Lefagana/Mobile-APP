import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { Text, Surface, IconButton, Avatar, useTheme } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ScreenContainer } from '../../../components/common/ScreenContainer';
import { mockMessages } from '../../../services/mocks/chatMockData';
import { VendorStackParamList } from '../../../navigation/types';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type ChatDetailRouteProp = RouteProp<VendorStackParamList, 'ChatDetail'>;

export default function ChatDetail() {
    const navigation = useNavigation();
    const route = useRoute<ChatDetailRouteProp>();
    const theme = useTheme();
    const { chatId, customerName } = route.params;

    // Load messages for this chat
    const [messages, setMessages] = useState(mockMessages[chatId] || []);
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        navigation.setOptions({
            title: customerName || 'Chat',
        });
    }, [navigation, customerName]);

    const sendMessage = () => {
        if (!inputText.trim()) return;

        const newMessage = {
            id: `msg_${Date.now()}`,
            chat_id: chatId,
            sender_type: 'vendor' as const,
            sender_id: 'vend_001',
            sender_name: 'LocalMart Pro',
            content: inputText.trim(),
            type: 'text' as const,
            is_read: true,
            created_at: new Date().toISOString(),
        };

        setMessages(prev => [...prev, newMessage]);
        setInputText('');

        // Scroll to bottom
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const renderMessage = ({ item }: { item: typeof messages[0] }) => {
        const isVendor = item.sender_type === 'vendor';
        const messageDate = new Date(item.created_at);
        const timeString = messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return (
            <View style={[
                styles.messageRow,
                isVendor ? styles.vendorRow : styles.customerRow
            ]}>
                {!isVendor && (
                    <Avatar.Text size={32} label={item.sender_name.substring(0, 2)} style={styles.avatar} />
                )}

                <View style={[
                    styles.messageBubble,
                    isVendor ? styles.vendorBubble : styles.customerBubble,
                    { backgroundColor: isVendor ? theme.colors.primary : '#F0F0F0' }
                ]}>
                    <Text style={[
                        styles.messageText,
                        { color: isVendor ? '#FFF' : '#000' }
                    ]}>
                        {item.content}
                    </Text>
                    <Text style={[
                        styles.messageTime,
                        { color: isVendor ? 'rgba(255,255,255,0.7)' : '#999' }
                    ]}>
                        {timeString}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <ScreenContainer style={{ backgroundColor: '#FFF' }} withBottomPadding={false}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
                />

                <Surface style={styles.inputContainer} elevation={4}>
                    <IconButton icon="plus" size={24} iconColor={theme.colors.primary} onPress={() => { }} />
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    <IconButton
                        icon="send"
                        size={24}
                        iconColor={theme.colors.primary}
                        disabled={!inputText.trim()}
                        onPress={sendMessage}
                    />
                </Surface>
            </KeyboardAvoidingView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    listContent: {
        padding: 16,
        paddingBottom: 20,
    },
    messageRow: {
        flexDirection: 'row',
        marginBottom: 16,
        alignItems: 'flex-end',
    },
    vendorRow: {
        justifyContent: 'flex-end',
    },
    customerRow: {
        justifyContent: 'flex-start',
    },
    avatar: {
        marginRight: 8,
        backgroundColor: '#E0E0E0',
    },
    messageBubble: {
        maxWidth: '75%',
        padding: 12,
        borderRadius: 16,
    },
    vendorBubble: {
        borderBottomRightRadius: 4,
    },
    customerBubble: {
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    messageTime: {
        fontSize: 10,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 8,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    input: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        maxHeight: 100,
        marginHorizontal: 4,
        fontSize: 16,
    },
});
