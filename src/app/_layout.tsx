import { Stack } from 'expo-router';

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: 'Events' }} />
            <Stack.Screen name="create-event" options={{ title: 'Create Event' }} />
            <Stack.Screen name="join-event" options={{ title: 'Join Event' }} />
            <Stack.Screen name="event/[id]" options={{ title: 'Event Details' }} />
            <Stack.Screen name="gallery/[id]" options={{ title: 'Photo Gallery' }} />
            <Stack.Screen name="web-gallery/[id]" options={{ title: 'Photo Gallery', headerShown: false }} />
        </Stack>
    );
}