import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { supabase } from '../../lib/supabase';
import { Event, Photo } from '../../types';

export default function Gallery() {
    const { id } = useLocalSearchParams();
    const [event, setEvent] = useState<Event | null>(null);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [downloading, setDownloading] = useState<string | null>(null);

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

    const downloadPhoto = async (photo: Photo) => {
        try {
            setDownloading(photo.id);
            
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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{event?.name}</Text>
            <Text style={styles.subtitle}>Event Gallery</Text>
            <Text style={styles.description}>{event?.description}</Text>
            
            {photos.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No photos yet</Text>
                    <Text style={styles.emptySubtext}>Photos will appear here as they are uploaded</Text>
                </View>
            ) : (
                <FlatList
                    data={photos}
                    numColumns={2}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.photoContainer}>
                            <Image source={{ uri: item.image_url }} style={styles.photo} />
                            <TouchableOpacity 
                                style={styles.downloadButton}
                                onPress={() => downloadPhoto(item)}
                                disabled={downloading === item.id}
                            >
                                <Text style={styles.downloadText}>
                                    {downloading === item.id ? 'Downloading...' : 'Download'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
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
        marginTop: 40,
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 18,
        color: '#007AFF',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#999',
        marginBottom: 10,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
    },
    photoContainer: {
        width: '48%',
        margin: '1%',
        marginBottom: 15,
    },
    photo: {
        width: '100%',
        height: 150,
        borderRadius: 10,
        marginBottom: 5,
    },
    downloadButton: {
        backgroundColor: '#34C759',
        padding: 8,
        borderRadius: 5,
        alignItems: 'center',
    },
    downloadText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
});
