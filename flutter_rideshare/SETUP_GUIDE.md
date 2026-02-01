# Chaloo Ride - Complete Setup Guide

## Prerequisites

Before you begin, ensure you have:
- Flutter SDK installed (version 3.0.0 or higher)
- Android Studio or Xcode (for Android/iOS development)
- A Firebase account and project
- Git installed

## Step 1: Clone and Install Dependencies

```bash
# Clone the repository (if needed)
git clone <your-repo-url>
cd flutter_rideshare

# Install Flutter dependencies
flutter pub get
```

## Step 2: Firebase Configuration

### Option A: Using FlutterFire CLI (Recommended)

This is the easiest and most automated approach:

```bash
# Install FlutterFire CLI globally
dart pub global activate flutterfire_cli

# Configure Firebase for your project
flutterfire configure --project=your-firebase-project-id
```

The CLI will:
- Generate `lib/firebase_options.dart` with your project's configuration
- Create platform-specific config files
- Set up Firebase for both Android and iOS

### Option B: Manual Configuration (Android)

If you prefer manual setup or FlutterFire CLI doesn't work:

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" or select an existing project
   - Follow the setup wizard

2. **Enable Firestore Database**
   - In your Firebase project, go to "Firestore Database"
   - Click "Create database"
   - Start in test mode (you'll update security rules later)
   - Choose a location close to your users

3. **Download google-services.json**
   - In Firebase Console, go to Project Settings (gear icon)
   - Scroll to "Your apps" section
   - Click "Add app" → Android
   - Enter package name: `com.rideshare.rideshare`
   - Download `google-services.json`

4. **Place the Configuration File**
   ```bash
   # Place google-services.json in the Android app directory
   cp /path/to/downloaded/google-services.json android/app/google-services.json
   ```

5. **Verify File Location**
   ```bash
   ls -la android/app/google-services.json
   # Should show the file exists
   ```

## Step 3: Firestore Database Setup

### Initialize Collections

The app uses these Firestore collections:
- `customers` - Customer user profiles (doc id = mobile number)
- `drivers` - Driver profiles and status (doc id = mobile number)
- `cars` - Vehicle information (doc id = car id)
- `bookings` - Ride bookings (doc id = booking id)
- `otps` - OTP verification codes (doc id = `userType-mobile`)

### Security Rules (Development Only)

**⚠️ WARNING: These rules are for DEVELOPMENT ONLY**

In Firebase Console → Firestore Database → Rules, use:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**Before production**, implement proper security rules like:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Customers can read/write their own data
    match /customers/{customerId} {
      allow read, write: if request.auth != null && request.auth.uid == customerId;
    }

    // Drivers can read/write their own data
    match /drivers/{driverId} {
      allow read, write: if request.auth != null && request.auth.uid == driverId;
    }

    // Customers can read available drivers
    match /drivers/{driverId} {
      allow read: if request.auth != null;
    }

    // Bookings accessible by customer or driver
    match /bookings/{bookingId} {
      allow read, write: if request.auth != null &&
        (resource.data.customerId == request.auth.uid ||
         resource.data.driverId == request.auth.uid);
    }

    // Cars readable by authenticated users
    match /cars/{carId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/drivers/$(request.auth.uid)).data.carId == carId;
    }

    // OTPs should have TTL and rate limiting in production
    match /otps/{otpId} {
      allow read, write: if true; // Implement proper validation
    }
  }
}
```

## Step 4: Build the App

### For Android

```bash
# Debug build (for testing)
flutter build apk --debug

# Release build (for distribution)
flutter build apk --release

# The APK will be at: build/app/outputs/flutter-apk/app-release.apk
```

### For iOS

```bash
# Build for iOS
flutter build ios --release

# Or open in Xcode
open ios/Runner.xcworkspace
```

## Step 5: Run the App

### On Physical Device (Recommended for location features)

```bash
# Connect your Android/iOS device via USB
# Enable USB debugging on Android

# Check connected devices
flutter devices

# Run the app
flutter run --release
```

### On Emulator

```bash
# Start an Android emulator
flutter emulators --launch <emulator_name>

# Or start from Android Studio

# Run the app
flutter run
```

## Step 6: Test Firebase Connection

When you first launch the app:

1. **If Firebase is configured correctly:**
   - App will show the home screen
   - You can select "Customer" or "Driver"
   - OTP login will work

2. **If Firebase is NOT configured:**
   - App will crash or show error message
   - Error will mention "Firebase initialization failed"
   - Follow the error message to fix configuration

### Test Firestore Connection

1. Open the app
2. Try to register as a customer or driver
3. Check Firebase Console → Firestore Database
4. You should see new documents in `customers` or `drivers` collection

## Common Issues and Solutions

### Issue: "Firebase initialization failed"

**Solution:**
- Verify `google-services.json` exists in `android/app/`
- Check that the package name matches: `com.rideshare.rideshare`
- Ensure Firebase project has Firestore enabled
- Try cleaning and rebuilding:
  ```bash
  flutter clean
  flutter pub get
  flutter run
  ```

### Issue: "google-services.json not found"

**Solution:**
- Download from Firebase Console → Project Settings → Your apps
- Place in `android/app/google-services.json`
- Rebuild the app

### Issue: "PERMISSION_DENIED" in Firestore

**Solution:**
- Check Firestore security rules in Firebase Console
- For development, use the permissive rules shown above
- For production, implement proper authentication rules

### Issue: Location not working

**Solution:**
- Grant location permissions when app requests them
- Enable GPS on your device
- Test on a physical device (emulator location can be unreliable)

### Issue: App crashes on startup

**Solution:**
1. Check logs: `flutter logs`
2. Verify Firebase configuration
3. Ensure all dependencies are installed: `flutter pub get`
4. Clean and rebuild: `flutter clean && flutter run`

## Production Deployment Checklist

Before releasing to production:

- [ ] Update Firestore security rules (remove `allow read, write: if true`)
- [ ] Set up Firebase Authentication (replace OTP-in-Firestore with Firebase Auth)
- [ ] Configure proper signing for Android (`android/app/build.gradle`)
- [ ] Set up iOS signing and provisioning profiles
- [ ] Enable Firebase Analytics
- [ ] Set up Crashlytics for error reporting
- [ ] Test thoroughly on multiple devices
- [ ] Implement rate limiting for OTP requests
- [ ] Add proper error handling and user feedback
- [ ] Set up backend Cloud Functions for sensitive operations
- [ ] Configure Google Maps API keys and billing
- [ ] Review and optimize Firestore indexes
- [ ] Set up monitoring and alerts

## App Features Overview

### Customer Flow
1. Enter mobile number → Receive OTP
2. Select pickup and drop-off locations on map
3. View available drivers nearby
4. Request ride
5. Track driver location in real-time
6. Complete ride and view receipt

### Driver Flow
1. Register with vehicle details
2. Enter mobile number → Receive OTP
3. Toggle availability (Online/Offline)
4. Receive ride requests
5. Accept/Reject rides
6. Navigate to pickup location
7. Start trip → Complete trip
8. View earnings and trip history

## Additional Resources

- [Flutter Documentation](https://flutter.dev/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [FlutterFire Documentation](https://firebase.flutter.dev/docs/overview)
- [Geolocator Plugin](https://pub.dev/packages/geolocator)
- [Flutter Map Plugin](https://pub.dev/packages/flutter_map)

## Support

For issues or questions:
1. Check the error logs: `flutter logs`
2. Review Firebase Console for backend errors
3. Consult the documentation linked above
4. Check GitHub issues (if applicable)

---

**Last Updated:** January 2026
**App Version:** 2.0.0
