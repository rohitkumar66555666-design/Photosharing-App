# QR Code Feature - How It Works

## For Event Organizers / Cameraman:

1. Create an event from the home screen
2. Open the event and click "Take Photo" to capture photos
3. Click "Show QR Code for Guests" button
4. Display the QR code on a screen or print it

## For Guests:

1. Scan the QR code with your phone camera or Expo Go app
2. The app will open the gallery view for that specific event
3. Browse all photos from the event
4. Click "Download" button under any photo to save it to your device
5. Photos are saved to your phone's gallery in an album named after the event

## Features:

- Each event has a unique QR code
- Guests can view all photos uploaded to the event
- One-tap download to save photos to device
- Photos are organized in albums by event name
- Real-time updates as new photos are uploaded

## Technical Details:

- QR code contains deep link: `photosharing://gallery/{event-id}`
- Photos are stored in Supabase storage
- Downloads require storage permission on the device
