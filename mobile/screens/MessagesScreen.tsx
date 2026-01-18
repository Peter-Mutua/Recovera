import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { LocalDatabase } from '../services/storage';

interface Message {
    id: number;
    source: string;
    sender: string;
    content: string;
    timestamp: number;
}

export default function MessagesScreen() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [filter, setFilter] = useState<string>('all');

    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = () => {
        const db = new LocalDatabase();
        const allMessages = db.getAllMessages() as Message[];
        setMessages(allMessages);
    };

    const filteredMessages = messages.filter((msg) => {
        if (filter === 'all') return true;
        return msg.source === filter;
    });

    const getSourceColor = (source: string) => {
        const colors: any = {
            sms: '#007AFF',
            whatsapp: '#25D366',
            notification: '#FF9500',
            media: '#FF2D55',
        };
        return colors[source.toLowerCase()] || '#666';
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    const renderMessage = ({ item }: { item: Message }) => (
        <View style={styles.messageCard}>
            <View style={styles.messageHeader}>
                <View style={[styles.sourceBadge, { backgroundColor: getSourceColor(item.source) }]}>
                    <Text style={styles.sourceBadgeText}>{item.source.toUpperCase()}</Text>
                </View>
                <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
            </View>
            <Text style={styles.sender}>{item.sender}</Text>
            <Text style={styles.content} numberOfLines={3}>
                {item.content}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Recovered Messages</Text>
                <Text style={styles.count}>{filteredMessages.length} messages</Text>
            </View>

            <View style={styles.filterContainer}>
                {['all', 'sms', 'whatsapp', 'notification'].map((f) => (
                    <TouchableOpacity
                        key={f}
                        style={[styles.filterButton, filter === f && styles.filterButtonActive]}
                        onPress={() => setFilter(f)}
                    >
                        <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                            {f.toUpperCase()}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={filteredMessages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>📭</Text>
                        <Text style={styles.emptyText}>No messages found</Text>
                        <Text style={styles.emptySubtext}>Start a scan to recover messages</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 20,
        paddingTop: 60,
        backgroundColor: '#007AFF',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    count: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.9,
        marginTop: 4,
    },
    filterContainer: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#fff',
        gap: 8,
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
    },
    filterButtonActive: {
        backgroundColor: '#007AFF',
    },
    filterText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '600',
    },
    filterTextActive: {
        color: '#fff',
    },
    listContainer: {
        padding: 16,
    },
    messageCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    messageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    sourceBadge: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 12,
    },
    sourceBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    timestamp: {
        fontSize: 12,
        color: '#999',
    },
    sender: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    content: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingTop: 60,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#666',
    },
});
