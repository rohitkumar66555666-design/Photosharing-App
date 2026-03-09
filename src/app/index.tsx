import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Event } from '../types';

export default function Home() {
    const router = useRouter();
    const [events, setEvents] = useState<Event[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    // Refresh when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            fetchEvents();
        }, [])
    );

    const fetchEvents = async () => {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (data) setEvents(data);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchEvents();
        setRefreshing(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Events</Text>
            
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={styles.createButton}
                    onPress={() => router.push('/create-event')}
                >
                    <Text style={styles.buttonText}>Create New Event</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.joinButton}
                    onPress={() => router.push('/join-event')}
                >
                    <Text style={styles.buttonText}>Join Event</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={events}
                keyExtractor={(item) => item.id}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#007AFF']}
                        tintColor="#007AFF"
                    />
                }
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={styles.eventCard}
                        onPress={() => router.push(`/event/${item.id}`)}
                    >
                        <Text style={styles.eventName}>{item.name}</Text>
                        <Text style={styles.eventDate}>{new Date(item.date).toLocaleDateString()}</Text>
                        <Text style={styles.eventDesc}>{item.description}</Text>
                        {item.access_code && (
                            <Text style={styles.accessCode}>Code: {item.access_code}</Text>
                        )}
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 40,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    createButton: {
        flex: 1,
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    joinButton: {
        flex: 1,
        backgroundColor: '#34C759',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    eventCard: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    eventName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    eventDate: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    eventDesc: {
        fontSize: 14,
        color: '#888',
    },
    accessCode: {
        fontSize: 12,
        color: '#007AFF',
        fontWeight: 'bold',
        marginTop: 5,
    },
});