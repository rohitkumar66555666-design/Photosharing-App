import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import QRCode from 'react-native-qrcode-svg';
import Constants from 'expo-constants';
import { supabase } from '../../lib/supabase';
import { Event, Photo } from '../../types';

export default function EventDetail() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [event, setEvent] = useState<Event | null>(null);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [uploading, setUploading] = useState(false);
    const [showQR, setShowQR] = useState(false);

    const getGalleryUrl = () => {
        const debuggerHost = Constants.expoConfig?.hostUri;
        if (debuggerHost) {
            const host = debuggerHost.split(':')[0];
            const port = debuggerHost.split(':')[1] || '8081';
            return `http://${host}:${port}/web-gallery/${id}`;
        }
        return `https://yourapp.com/web-gallery/${id}`;
    };

    const galleryUrl = getGalleryUrl();

    useEffect(() => {
        fetchEvent();
        fetchPhotos();
    }, []);

    const fetchEvent = async () => {
        const { data } = await supabase
            .from('events')
            .select('*')
            .eq('id', id)
            .single();
        
        if (data) setEvent(data);
    };

    const fetchPhotos = async () => {
        const { data } = await supabase
            .from('photos')
            .select('*')
            .eq('event_id', id)
            .order('created_at', { ascending: false });
        
        if (data) setPhotos(data);
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Camera permission is required');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            uploadPhoto(result.assets[0].uri);
        }
    };

    const uploadPhoto = async (uri: string) => {
        setUploading(true);
        
        try {
            const fileName = `${id}/${Date.now()}.jpg`;
            
            const base64 = await fetch(uri);
            const arrayBuffer = await base64.arrayBuffer();
            const fileData = new Uint8Array(arrayBuffer);

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('event-photos')
                .upload(fileName, fileData, {
                    contentType: 'image/jpeg',
                    upsert: false
                });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('event-photos')
                .getPublicUrl(fileName);

            const { error: dbError } = await supabase
                .from('photos')
                .insert([{ event_id: id, image_url: publicUrl }]);

            if (dbError) throw dbError;

            Alert.alert('Success', 'Photo uploaded successfully');
            fetchPhotos();
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setUploading(false);
        }
    };

    const deleteEvent = async () => {
        Alert.alert(
            'Delete Event',
            `Are you sure you want to delete "${event?.name}"? This will delete all photos and cannot be undone.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const { data: files } = await supabase.storage
                                .from('event-photos')
                                .list(id as string);

                            if (files && files.length > 0) {
                                const filePaths = files.map(file => `${id}/${file.name}`);
                                await supabase.storage
                                    .from('event-photos')
                                    .remove(filePaths);
                            }

                            const { error } = await supabase
                                .from('events')
                                .delete()
                                .eq('id', id);

                            if (error) throw error;

                            Alert.alert('Success', 'Event deleted successfully');
                            router.back();
                        } catch (error: any) {
                            Alert.alert('Error', error.message);
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{event?.name}</Text>
            <Text style={styles.description}>{event?.description}</Text>
            
            {event?.access_code && (
                <View style={styles.accessCodeBox}>
                    <Text style={styles.accessCodeLabel}>Access Code:</Text>
                    <Text style={styles.accessCodeText}>{event.access_code}</Text>
                    <Text style={styles.accessCodeHint}>Share this code with others to let them join and contribute photos</Text>
                </View>
            )}
            
            <TouchableOpacity 
                style={styles.button}
                onPress={takePhoto}
                disabled={uploading}
            >
                <Text style={styles.buttonText}>
                    {uploading ? 'Uploading...' : '📷 Take Photo'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.button, styles.qrButton]}
                onPress={() => setShowQR(true)}
            >
                <Text style={styles.buttonText}>🔗 Share Event (QR Code)</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.button, styles.deleteButton]}
                onPress={deleteEvent}
            >
                <Text style={styles.buttonText}>🗑️ Delete Event</Text>
            </TouchableOpacity>

            <Text style={styles.photosTitle}>Photos ({photos.length})</Text>
            
            <FlatList
                data={photos}
                numColumns={2}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Image source={{ uri: item.image_url }} style={styles.photo} />
                )}
            />

            <Modal
                visible={showQR}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowQR(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Share Event</Text>
                        <Text style={styles.modalSubtitle}>{event?.name}</Text>
                        
                        <View style={styles.shareSection}>
                            <Text style={styles.shareSectionTitle}>Access Code</Text>
                            <View style={styles.codeBox}>
                                <Text style={styles.codeText}>{event?.access_code}</Text>
                            </View>
                            <Text style={styles.shareHint}>Share this code for others to join via app</Text>
                        </View>

                        <View style={styles.shareSection}>
                            <Text style={styles.shareSectionTitle}>QR Code for Guests</Text>
                            <View style={styles.qrContainer}>
                                <QRCode
                                    value={galleryUrl}
                                    size={200}
                                    backgroundColor="white"
                                />
                            </View>
                            <Text style={styles.shareHint}>Scan to view photos (no app needed)</Text>
                        </View>
                        
                        <TouchableOpacity 
                            style={styles.closeButton}
                            onPress={() => setShowQR(false)}
                        >
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 40,
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    accessCodeBox: {
        backgroundColor: '#E3F2FD',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        alignItems: 'center',
    },
    accessCodeLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    accessCodeText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#007AFF',
        letterSpacing: 4,
        marginBottom: 5,
    },
    accessCodeHint: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    qrButton: {
        backgroundColor: '#FF9500',
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    photosTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    photo: {
        width: '48%',
        height: 150,
        margin: '1%',
        borderRadius: 10,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        width: '90%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    modalSubtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    shareSection: {
        width: '100%',
        marginBottom: 20,
        alignItems: 'center',
    },
    shareSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    codeBox: {
        backgroundColor: '#E3F2FD',
        padding: 15,
        borderRadius: 10,
        marginBottom: 5,
    },
    codeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#007AFF',
        letterSpacing: 4,
    },
    shareHint: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    qrContainer: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 5,
    },
    closeButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
    },
});
