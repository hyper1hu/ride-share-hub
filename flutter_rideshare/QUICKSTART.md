# Quick Start - Flutter Rideshare App

Get the app running in 5 minutes!

## 1. Install Dependencies

```bash
flutter pub get
```

## 2. Configure Firebase

### Easy Way (FlutterFire CLI)

```bash
# Install FlutterFire CLI
dart pub global activate flutterfire_cli

# Configure Firebase
flutterfire configure --project=your-firebase-project-id
```

### Manual Way

1. Download `google-services.json` from Firebase Console
2. Place it here: `android/app/google-services.json`

## 3. Set Up Firestore

In Firebase Console:
1. Create Firestore Database
2. Start in **Test Mode** (for development)

## 4. Build & Run

```bash
# Debug build
flutter run

# Release APK
flutter build apk --release
# Output: build/app/outputs/flutter-apk/app-release.apk
```

## 5. Test It Works

1. Open the app
2. Select "Customer" or "Driver"
3. Enter a phone number (any 10 digits for testing)
4. Check Firebase Console → Firestore Database
5. You should see data appearing in collections

## Troubleshooting

**App crashes on startup?**
- Make sure `google-services.json` is in `android/app/`
- Run: `flutter clean && flutter pub get && flutter run`

**No data in Firestore?**
- Check Firestore rules are set to allow read/write
- Verify your Firebase project has Firestore enabled

## What's Next?

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for:
- Detailed configuration steps
- Production deployment checklist
- Security rules setup
- Common issues and solutions

## Project Structure

```
lib/
├── main.dart                 # App entry point
├── models/                   # Data models
├── screens/                  # UI screens
├── services/
│   ├── backend/             # Firebase integration
│   ├── location_service.dart
│   ├── map_service.dart
│   └── notification_service.dart
├── widgets/                 # Reusable UI components
└── firebase_options.dart    # Firebase configuration
```

## Key Files to Check

- ✅ `android/app/google-services.json` - Firebase config
- ✅ `lib/services/backend/bootstrap.dart` - Firebase initialization
- ✅ `lib/services/backend/firestore_backend.dart` - Database operations
- ✅ `pubspec.yaml` - Dependencies

---

**Ready to build?** Run `flutter run` and you're good to go!
