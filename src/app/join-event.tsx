import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function JoinEvent() {
    const router = useRouter();
    const [accessCode, setAccessCode] = useState('');
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleJoinEvent = async () => {
        if (!accessCode || !userName) {
            Alert.alert('Error', 'Please enter both access code and your name');
            return;
        }

        setLoading(true);

        try {
            // Find event by access code
            const { data: event, error: eventError } = await supabase
                .from('events')
                .select('*')
                .eq('access_code', accessCode.toUpperCase())
                .single();

            if (eventError || !event) {
                Alert.alert('Error', 'Invalid access code. Please check and try again.');
                setLoading(false);
                return;
            }

            // Check if user already joined
            const { data: existingMember } = await supabase
                .from('event_members')
                .select('*')
                .eq('event_id', event.id)
                .eq('user_name', userName)
                .single();

            if (!existingMember) {
                // Add user as member
                const { error: memberError } = await supabase
                    .from('event_members')
                    .insert([{
                        event_id: event.id,
                        user_name: userName,
                        role: 'contributor'
                    }]);

                if (memberError) {
                    Alert.alert('Error', memberError.message);
                    setLoading(false);
                    return;
                }
            }

            Alert.alert('Success', `You've joined "${event.name}"!`, [
                {
                    text: 'OK',
                    onPress: () => router.push(`/event/${event.id}`)
                }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Join Event</Text>
            <Text style={styles.subtitle}>Enter the event access code to join and contribute photos</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Access Code (e.g., ABC123)"
                value={accessCode}
                onChangeText={(text) => setAccessCode(text.toUpperCase())}
                autoCapitalize="characters"
                maxLength={6}
            />
            
            <TextInput
                style={styles.input}
                placeholder="Your Name"
                value={userName}
                onChangeText={setUserName}
            />
            
            <TouchableOpacity 
                style={[styles.button, loading && styles.buttonDisabled]} 
                onPress={handleJoinEvent}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Joining...' : 'Join Event'}
                </Text>
            </TouchableOpacity>

            <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>💡 How to join:</Text>
                <Text style={styles.infoText}>1. Get the access code from the event organizer</Text>
                <Text style={styles.infoText}>2. Enter the code above</Text>
                <Text style={styles.infoText}>3. Enter your name</Text>
                <Text style={styles.infoText}>4. Start contributing photos!</Text>
            </View>
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
        marginBottom: 10,
        marginTop: 40,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
    },
    input: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonDisabled: {
        backgroundColor: '#999',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    infoBox: {
        backgroundColor: '#E3F2FD',
        padding: 20,
        borderRadius: 10,
        marginTop: 30,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#1976D2',
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
});
