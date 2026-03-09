# Collaboration & Sharing Guide

## 🎉 New Collaborative Features

Your PhotoSharing app now supports full collaboration! Multiple people can join events, upload photos, and create shared albums together.

---

## 📋 Setup Instructions

### 1. Run the SQL Script
Go to your Supabase SQL Editor and run the entire `collaborative-features.sql` file. This will:
- Create the `event_members` table
- Add `access_code`, `is_public`, and `allow_contributions` columns to events
- Auto-generate unique 6-character access codes for all events
- Set up triggers for automatic code generation

---

## 🚀 How It Works

### Creating an Event (Event Organizer)
1. Open the app
2. Tap "Create New Event"
3. Fill in event details
4. Event is created with a unique access code (e.g., "ABC123")
5. Share the access code or QR code with others

### Joining an Event (Contributors)
1. Open the app
2. Tap "Join Event" button
3. Enter the access code shared by the organizer
4. Enter your name
5. Tap "Join Event"
6. You're now a contributor and can upload photos!

### Sharing Options

#### Option 1: Access Code (For Contributors)
- Share the 6-character code (e.g., "ABC123")
- Others can join via the app and upload photos
- Perfect for photographers and event staff

#### Option 2: QR Code (For Guests)
- Display the QR code at the event
- Guests scan with their phone camera
- Opens web gallery (no app needed)
- Guests can view and download photos
- Perfect for event attendees

---

## 🎯 User Roles

### Owner
- Creates the event
- Can upload photos
- Can share access code and QR code

### Contributor
- Joins via access code
- Can upload photos
- Can view all event photos
- Perfect for multiple photographers

### Viewer (Guest)
- Accesses via QR code
- Can view photos
- Can download photos
- No app installation required

---

## 📱 Features

### Home Screen
- **Create New Event** button - Start a new collaborative album
- **Join Event** button - Join existing events with access code
- Event list shows access codes for easy reference

### Event Detail Screen
- **Access Code Display** - Prominently shows the code at the top
- **Take Photo** button - Capture and upload photos
- **Share Event** button - Shows both access code and QR code
- **Photo Grid** - View all photos from all contributors

### Join Event Screen
- Simple form with access code and name
- Validates code before joining
- Prevents duplicate joins
- Instant access after joining

### Share Modal
- **Access Code Section** - Large, easy-to-read code for sharing
- **QR Code Section** - Scannable code for guest access
- Clear instructions for each sharing method

---

## 🔄 Collaboration Flow

```
Event Organizer:
1. Creates event → Gets access code (ABC123)
2. Shares code with photographers
3. Displays QR code at venue

Photographers:
1. Opens app → Taps "Join Event"
2. Enters code ABC123
3. Starts uploading photos

Guests:
1. Scans QR code with phone camera
2. Views photos in browser
3. Downloads favorite photos
```

---

## 💡 Use Cases

### Wedding Photography
- Main photographer creates event
- Assistant photographers join with code
- Guests scan QR code to view/download photos

### Corporate Events
- Event manager creates album
- Multiple photographers contribute
- Attendees access photos via QR code

### Birthday Parties
- Host creates event
- Friends join and upload their photos
- Everyone can download the full album

### Conferences
- Organizer creates event per session
- Official photographers contribute
- Attendees download session photos

---

## 🔐 Security Features

- Unique 6-character access codes
- Codes are randomly generated
- No duplicate codes possible
- Member tracking (who joined when)
- Role-based access (owner/contributor/viewer)

---

## 📊 Database Schema

### events table (updated)
```sql
- id (UUID)
- name (TEXT)
- description (TEXT)
- date (DATE)
- access_code (TEXT, unique) ← NEW
- is_public (BOOLEAN) ← NEW
- allow_contributions (BOOLEAN) ← NEW
- created_at (TIMESTAMP)
```

### event_members table (new)
```sql
- id (UUID)
- event_id (UUID, foreign key)
- user_name (TEXT)
- role (TEXT: owner/contributor/viewer)
- joined_at (TIMESTAMP)
```

---

## 🎨 UI Improvements

### Access Code Display
- Large, bold text
- Letter-spaced for readability
- Blue highlight box
- Copy-friendly format

### Share Modal
- Two clear sections (Code + QR)
- Helpful hints for each method
- Clean, modern design
- Easy to understand

### Join Event Screen
- Simple, focused form
- Auto-uppercase for codes
- Name input for tracking
- Helpful instructions

---

## 🚀 Next Steps

1. Run `collaborative-features.sql` in Supabase
2. Restart your app
3. Create a test event
4. Try joining with the access code
5. Test photo uploads from multiple "users"
6. Scan the QR code to test guest access

---

## ✅ Complete Feature List

- ✅ Auto-generated access codes
- ✅ Join events via code
- ✅ Multiple contributors per event
- ✅ Member tracking
- ✅ QR code sharing for guests
- ✅ Web gallery for non-app users
- ✅ Photo downloads
- ✅ Real-time photo sync
- ✅ Beautiful UI for sharing

Your app is now a fully collaborative photo sharing platform! 🎉
