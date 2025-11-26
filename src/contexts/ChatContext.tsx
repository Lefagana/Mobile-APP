import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { Chat, Message, MessageTemplate, ChatStats } from '../types/chat';
import {
    mockChats,
    mockMessages,
    mockMessageTemplates,
    mockChatStats,
} from '../services/mocks/chatMockData';

interface ChatContextType {
    // Chats
    chats: Chat[];
    activeChats: Chat[];
    unreadCount: number;
    isLoading: boolean;
    error: string | null;

    // Messages
    getMessages: (chatId: string) => Message[];
    sendMessage: (chatId: string, content: string, type?: Message['type']) => Promise<void>;
    markAsRead: (chatId: string) => Promise<void>;

    // Templates
    templates: MessageTemplate[];
    createTemplate: (template: Partial<MessageTemplate>) => Promise<void>;
    updateTemplate: (templateId: string, updates: Partial<MessageTemplate>) => Promise<void>;
    deleteTemplate: (templateId: string) => Promise<void>;

    // Stats
    stats: ChatStats | null;

    // Actions
    refreshChats: () => Promise<void>;
    archiveChat: (chatId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
    children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
    const { user } = useAuth();
    const [chats, setChats] = useState<Chat[]>([]);
    const [messages, setMessages] = useState<Record<string, Message[]>>({});
    const [templates, setTemplates] = useState<MessageTemplate[]>([]);
    const [stats, setStats] = useState<ChatStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load chat data when user changes
    useEffect(() => {
        if (user?.role === 'vendor') {
            loadChatData();
        } else {
            clearChatData();
        }
    }, [user]);

    const loadChatData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            setChats(mockChats);
            setMessages(mockMessages);
            setTemplates(mockMessageTemplates);
            setStats(mockChatStats);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load chat data');
            console.error('Error loading chat data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const clearChatData = () => {
        setChats([]);
        setMessages({});
        setTemplates([]);
        setStats(null);
        setIsLoading(false);
        setError(null);
    };

    const getMessages = (chatId: string): Message[] => {
        return messages[chatId] || [];
    };

    const sendMessage = async (chatId: string, content: string, type: Message['type'] = 'text') => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 300));

            const newMessage: Message = {
                id: `msg_${Date.now()}`,
                chat_id: chatId,
                sender_type: 'vendor',
                sender_id: user?.id || 'vend_001',
                sender_name: user?.name || 'Vendor',
                content,
                type,
                is_read: true,
                created_at: new Date().toISOString(),
            };

            // Add message to chat
            setMessages(prev => ({
                ...prev,
                [chatId]: [...(prev[chatId] || []), newMessage],
            }));

            // Update chat last message
            setChats(prev =>
                prev.map(chat =>
                    chat.id === chatId
                        ? {
                            ...chat,
                            last_message: content,
                            last_message_time: new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                        }
                        : chat
                )
            );
        } catch (err) {
            throw new Error('Failed to send message');
        }
    };

    const markAsRead = async (chatId: string) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 200));

            // Mark all messages as read
            setMessages(prev => ({
                ...prev,
                [chatId]: (prev[chatId] || []).map(msg => ({ ...msg, is_read: true })),
            }));

            // Update chat unread count
            setChats(prev =>
                prev.map(chat =>
                    chat.id === chatId ? { ...chat, unread_count: 0 } : chat
                )
            );
        } catch (err) {
            console.error('Failed to mark as read:', err);
        }
    };

    const createTemplate = async (templateData: Partial<MessageTemplate>) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            const newTemplate: MessageTemplate = {
                id: `tmpl_${Date.now()}`,
                vendor_id: user?.id || 'vend_001',
                category: templateData.category || 'custom',
                title: templateData.title || 'New Template',
                content: templateData.content || '',
                is_active: true,
                usage_count: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            setTemplates(prev => [newTemplate, ...prev]);
        } catch (err) {
            throw new Error('Failed to create template');
        }
    };

    const updateTemplate = async (templateId: string, updates: Partial<MessageTemplate>) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            setTemplates(prev =>
                prev.map(tmpl =>
                    tmpl.id === templateId
                        ? { ...tmpl, ...updates, updated_at: new Date().toISOString() }
                        : tmpl
                )
            );
        } catch (err) {
            throw new Error('Failed to update template');
        }
    };

    const deleteTemplate = async (templateId: string) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 300));

            setTemplates(prev => prev.filter(tmpl => tmpl.id !== templateId));
        } catch (err) {
            throw new Error('Failed to delete template');
        }
    };

    const refreshChats = async () => {
        await loadChatData();
    };

    const archiveChat = async (chatId: string) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 300));

            setChats(prev =>
                prev.map(chat =>
                    chat.id === chatId ? { ...chat, status: 'archived' as const } : chat
                )
            );
        } catch (err) {
            throw new Error('Failed to archive chat');
        }
    };

    const activeChats = chats.filter(chat => chat.status === 'active');
    const unreadCount = chats.reduce((sum, chat) => sum + chat.unread_count, 0);

    const value: ChatContextType = {
        chats,
        activeChats,
        unreadCount,
        isLoading,
        error,
        getMessages,
        sendMessage,
        markAsRead,
        templates,
        createTemplate,
        updateTemplate,
        deleteTemplate,
        stats,
        refreshChats,
        archiveChat,
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = (): ChatContextType => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};
