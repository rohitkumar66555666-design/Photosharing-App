import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, Linking, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { supabase } from '../../lib/supabase';
import { Event, Photo } from '../../types';

export default function WebGallery() {
    const { id } = useLocalSearchParams();
    const [event, setEvent] = useState<Event | null>(null);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [downloading, setDownloading] = useState<string | null>(null);

    useEffect(() => {
        fetchEvent();
        fetchPhotos();
        
        // Auto-refresh every 10 seconds to get new photos
        const interval = setInterval(fetchPhotos, 10000);
        return () => clearInterval(interval);
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

    const downloadPhoto = async (photo: Photo) => {
        try {
            setDownloading(photo.id);
            
            if (Platform.OS === 'web') {
                // For web, open in new tab
                Linking.openURL(photo.image_url);
                Alert.alert('Download', 'Photo opened in new tab. Right-click to save.');
                return;
            }

            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Storage permission is required to download photos');
                return;
            }

            const fileUri = FileSystem.documentDirectory + `${photo.id}.jpg`;
            const downloadResult = await FileSystem.downloadAsync(photo.image_url, fileUri);

            const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
            await MediaLibrary.createAlbumAsync(event?.name || 'Event Photos', asset, false);

            Alert.alert('Success', 'Photo downloaded to your gallery!');
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setDownloading(null);
        }
    };

    const downloadAll = async () => {
        Alert.alert(
            'Download All',
            `Download all ${photos.length} photos?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Download',
                    onPress: async () => {
                        for (const photo of photos) {
                            await downloadPhoto(photo);
                        }
                    }
                }
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{event?.name}</Text>
                <Text style={styles.subtitle}>📸 Event Gallery</Text>
                <Text style={styles.description}>{event?.description}</Text>
                <Text style={styles.date}>
                    {event?.date ? new Date(event.date).toLocaleDateString() : ''}
                </Text>
                
                {photos.length > 0 && (
                    <TouchableOpacity 
                        style={styles.downloadAllButton}
                        onPress={downloadAll}
                    >
                        <Text style={styles.downloadAllText}>
                            Download All ({photos.length} photos)
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
            
            {photos.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>📷</Text>
                    <Text style={styles.emptyTitle}>No photos yet</Text>
                    <Text style={styles.emptySubtext}>
                        Photos will appear here as they are uploaded by the photographer
                    </Text>
                </View>
            ) : (
                <View style={styles.grid}>
                    {photos.map((photo) => (
                        <View key={photo.id} style={styles.photoCard}>
                            <Image 
                                source={{ uri: photo.image_url }} 
                                style={styles.photo}
                                resizeMode="cover"
                            />
                            <TouchableOpacity 
                                style={styles.downloadButton}
                                onPress={() => downloadPhoto(photo)}
                                disabled={downloading === photo.id}
                            >
                                <Text style={styles.downloadText}>
                                    {downloading === photo.id ? '⏳ Downloading...' : '⬇️ Download'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            )}
            
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Powered by PhotoSharing App
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        backgroundColor: 'white',
        padding: 20,
        paddingTop: 60,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 20,
        color: '#007AFF',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
        textAlign: 'center',
    },
    date: {
        fontSize: 14,
        color: '#999',
        marginBottom: 15,
    },
    downloadAllButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 25,
        marginTop: 10,
    },
    downloadAllText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        marginTop: 60,
    },
    emptyText: {
        fontSize: 80,
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    emptySubtext: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 10,
    },
    photoCard: {
        width: '48%',
        margin: '1%',
        backgroundColor: 'white',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 15,
    },
    photo: {
        width: '100%',
        height: 200,
    },
    downloadButton: {
        backgroundColor: '#34C759',
        padding: 12,
        alignItems: 'center',
    },
    downloadText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    footer: {
        padding: 20,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: '#999',
    },
});
