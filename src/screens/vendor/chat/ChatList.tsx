import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Avatar, Surface, Searchbar, Badge, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../../components/common/ScreenContainer';
import { mockChats } from '../../../services/mocks/chatMockData';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

export default function ChatList() {
    const navigation = useNavigation<any>();
    const theme = useTheme();
    const [searchQuery, setSearchQuery] = React.useState('');

    const filteredChats = mockChats.filter(chat =>
        chat.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.last_message.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderItem = ({ item }: { item: typeof mockChats[0] }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('ChatDetail', { chatId: item.id, customerName: item.customer_name })}
        >
            <Surface style={styles.chatItem} elevation={0}>
                <View style={styles.avatarContainer}>
                    <Avatar.Image size={50} source={{ uri: item.customer_avatar }} />
                    {item.status === 'active' && <View style={styles.onlineIndicator} />}
                </View>

                <View style={styles.chatContent}>
                    <View style={styles.chatHeader}>
                        <Text variant="titleMedium" style={styles.customerName}>{item.customer_name}</Text>
                        <Text variant="bodySmall" style={styles.timeText}>
                            {formatTimeAgo(item.last_message_time)}
                        </Text>
                    </View>

                    <View style={styles.lastMessageContainer}>
                        <Text
                            variant="bodyMedium"
                            numberOfLines={1}
                            style={[
                                styles.lastMessage,
                                item.unread_count > 0 && styles.unreadMessage
                            ]}
                        >
                            {item.last_message}
                        </Text>
                        {item.unread_count > 0 && (
                            <Badge size={22} style={styles.badge}>{item.unread_count}</Badge>
                        )}
                    </View>

                    {item.order_number && (
                        <View style={styles.orderTag}>
                            <MaterialCommunityIcons name="shopping-outline" size={12} color="#666" />
                            <Text variant="labelSmall" style={styles.orderTagText}>{item.order_number}</Text>
                        </View>
                    )}
                </View>
            </Surface>
            <View style={styles.divider} />
        </TouchableOpacity>
    );

    return (
        <ScreenContainer style={{ backgroundColor: '#FFF' }} scrollable={false}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Searchbar
                        placeholder="Search messages..."
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                        style={styles.searchBar}
                        elevation={0}
                    />
                </View>

                <FlatList
                    data={filteredChats}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <MaterialCommunityIcons name="message-text-outline" size={64} color="#CCC" />
                            <Text variant="bodyLarge" style={styles.emptyText}>No messages found</Text>
                        </View>
                    }
                />
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    searchBar: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        height: 48,
    },
    listContent: {
        paddingBottom: 20,
    },
    chatItem: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#FFF',
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 16,
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4CAF50',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    chatContent: {
        flex: 1,
        justifyContent: 'center',
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    customerName: {
        fontWeight: '600',
    },
    timeText: {
        color: '#999',
    },
    lastMessageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    lastMessage: {
        color: '#666',
        flex: 1,
        marginRight: 8,
    },
    unreadMessage: {
        fontWeight: '700',
        color: '#000',
    },
    badge: {
        backgroundColor: '#2196F3',
        fontWeight: 'bold',
    },
    orderTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    orderTagText: {
        color: '#666',
        marginLeft: 4,
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginLeft: 82,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    emptyText: {
        color: '#999',
        marginTop: 16,
    },
});
