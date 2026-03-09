# 📸 PhotoSharing - Event Photo Management App

A collaborative photo sharing app for events built with React Native, Expo, and Supabase. Perfect for weddings, parties, conferences, and any event where multiple photographers need to contribute photos.

## ✨ Features

### 🎉 Event Management
- Create and manage multiple events
- Auto-generated unique access codes for each event
- Delete events with all associated photos
- Pull-to-refresh event list
- Auto-refresh when returning to home screen

### 📷 Photo Capture & Upload
- Direct camera integration for instant photo capture
- Automatic upload to Supabase cloud storage
- Real-time photo sync across all devices
- Photo organization by event

### 🤝 Collaboration
- Share events via 6-character access codes
- Multiple contributors can join and upload photos
- Member tracking (who joined when)
- Role-based access (owner/contributor/viewer)

### 🔗 Sharing & Access
- QR code generation for easy guest access
- Scan with any camera app (Google Camera, iPhone Camera)
- Web-based gallery for guests (no app installation required)
- Share via access code or QR code

### 💾 Photo Downloads
- Individual photo downloads
- Download all photos at once
- Photos saved to device gallery
- Organized in albums by event name

## 🚀 Tech Stack

- **React Native** - Cross-platform mobile development
- **Expo** - Development framework and tooling
- **Expo Router** - File-based navigation
- **Supabase** - Backend database and storage
- **TypeScript** - Type safety
- **expo-image-picker** - Camera integration
- **react-native-qrcode-svg** - QR code generation

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Supabase account
- Android Studio (for Android) or Xcode (for iOS)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Photosharing
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy `src/lib/supabase.example.ts` to `src/lib/supabase.ts`
   - Add your Supabase URL and anon key

4. Run database migrations:
   - Open Supabase SQL Editor
   - Run `supabase-fix.sql`
   - Run `collaborative-features.sql`

5. Create storage bucket:
   - Go to Storage in Supabase
   - Create bucket named `event-photos`
   - Make it public
   - Follow instructions in `SUPABASE_SETUP.md`

## 🏃 Running the App

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web
```

## 📱 Usage

### For Event Organizers:
1. Create a new event
2. Share the access code with photographers
3. Display QR code for guests to view photos

### For Photographers:
1. Join event using access code
2. Take photos directly in the app
3. Photos automatically upload to the cloud

### For Guests:
1. Scan QR code with phone camera
2. View all event photos in browser
3. Download favorite photos

## 📂 Project Structure

```
Photosharing/
├── src/
│   ├── app/                    # Expo Router screens
│   │   ├── index.tsx          # Home screen (event list)
│   │   ├── create-event.tsx   # Create new event
│   │   ├── join-event.tsx     # Join existing event
│   │   ├── event/[id].tsx     # Event details & photo upload
│   │   ├── gallery/[id].tsx   # Photo gallery (app)
│   │   └── web-gallery/[id].tsx # Web gallery (browser)
│   ├── lib/
│   │   └── supabase.ts        # Supabase client config
│   └── types/
│       └── index.ts           # TypeScript interfaces
├── assets/                     # App icons and images
├── app.json                    # Expo configuration
└── package.json               # Dependencies
```

## 🗄️ Database Schema

### Tables:
- **events** - Event information with access codes
- **photos** - Photo URLs linked to events
- **event_members** - Collaboration tracking

See `collaborative-features.sql` for complete schema.

## 🔐 Security Notes

- Never commit `src/lib/supabase.ts` with real credentials
- Use environment variables for production
- Review Supabase RLS policies before production deployment
- Current setup has RLS disabled for development

## 📖 Documentation

- `SUPABASE_SETUP.md` - Database and storage setup
- `COLLABORATION_GUIDE.md` - Collaboration features guide
- `APP_FEATURES.md` - Complete feature list
- `QR_CODE_INSTRUCTIONS.md` - QR code usage guide

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for your events!

## 🐛 Troubleshooting

### "Could not find table 'public.events'"
- Run the SQL scripts in Supabase SQL Editor

### "Row level security policy violation"
- Run `supabase-fix.sql` to disable RLS for development

### "Property 'blob' doesn't exist"
- Already fixed - using ArrayBuffer instead

### QR code not scanning
- Ensure both devices are on same WiFi
- Use Expo Go app to scan
- Check that dev server is running

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

Made with ❤️ for event photographers and organizers
# Photosharing-App
# Photosharing-App
