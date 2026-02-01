# Chaloo Ride Mobile App

Flutter-based mobile application for customers and drivers.

## Features

### For Customers
- OTP-based authentication
- Search rides by origin and destination
- View available vehicles with pricing
- Book rides instantly
- Track booking history
- Real-time booking status updates

### For Drivers
- Driver registration with verification
- Vehicle registration and management
- View incoming booking requests
- Accept/reject bookings
- Track earnings
- Manage profile and documents

## Download APK

This repo does not check in APK artifacts.
Build locally via the steps below.

## Build from Source

### Prerequisites

- Flutter SDK 3.0 or higher
- Android Studio / Xcode
- Dart SDK (included with Flutter)

### Setup Instructions

#### 1. Install Flutter

**Windows/Linux/macOS:**
```bash
git clone https://github.com/flutter/flutter.git -b stable
export PATH="$PATH:`pwd`/flutter/bin"
flutter doctor
```

Or download from [Flutter.dev](https://flutter.dev/docs/get-started/install)

#### 2. Clone Repository

```bash
cd flutter_rideshare
```

#### 3. Install Dependencies

```bash
flutter pub get
```

#### 3a. Configure Firebase/Firestore (Recommended)

See `FIREBASE_SETUP.md`.

#### 4. Build APK

**Release APK (Recommended):**
```bash
flutter build apk --release
```

**Debug APK:**
```bash
flutter build apk --debug
```

**Split APKs by Architecture (Smaller size):**
```bash
flutter build apk --split-per-abi --release
```

Build output location:
- `build/app/outputs/flutter-apk/app-release.apk`
- `build/app/outputs/flutter-apk/app-armeabi-v7a-release.apk`
- `build/app/outputs/flutter-apk/app-arm64-v8a-release.apk`
- `build/app/outputs/flutter-apk/app-x86_64-release.apk`

#### 6. Run on Device/Emulator

**Android:**
```bash
flutter run -d android
```

**iOS:**
```bash
flutter run -d ios
```

**List available devices:**
```bash
flutter devices
```

## Build Flavors

The app supports multiple build flavors:

### Development
```bash
flutter build apk --flavor development --release
```

### Production
```bash
flutter build apk --flavor production --release
```

## Project Structure

```
flutter_rideshare/
├── lib/
│   ├── main.dart              # App entry point
│   ├── models/                # Data models
│   │   ├── user.dart
│   │   ├── vehicle.dart
│   │   └── booking.dart
│   ├── screens/               # UI screens
│   │   ├── auth/
│   │   ├── customer/
│   │   └── driver/
│   ├── services/              # API services
│   │   ├── auth_service.dart
│   │   ├── booking_service.dart
│   │   └── vehicle_service.dart
│   └── widgets/               # Reusable widgets
├── android/                   # Android configuration
├── ios/                       # iOS configuration
├── pubspec.yaml              # Dependencies

```

## Dependencies

Key Flutter packages used:

- `provider` - State management
- `shared_preferences` - Local preferences (theme + cached user data)
- `firebase_core` - Firebase bootstrap
- `cloud_firestore` - Firestore database
- `firebase_auth` - Firebase Auth (phone auth can be added)
- `intl` - Internationalization

See `pubspec.yaml` for complete list.

## Testing

### Run Unit Tests
```bash
flutter test
```

### Run Integration Tests
```bash
flutter test integration_test
```

## Build Configurations

### Android Build Configuration

**Minimum SDK:** 23 (Android 6.0)
**Target SDK:** 36
**Compile SDK:** 36

Edit in `android/app/build.gradle`:
```gradle
android {
    compileSdkVersion 36
    defaultConfig {
        minSdkVersion 23
        targetSdkVersion 36
        versionCode 1
        versionName "2.0.0"
    }
}
```

### iOS Build Configuration

**Minimum iOS Version:** 12.0

Edit in `ios/Podfile`:
```ruby
platform :ios, '12.0'
```

## Signing (For Release)

### Android Signing

1. Create keystore:
```bash
keytool -genkey -v -keystore chaloo_ride.keystore -alias chaloo_ride \
  -keyalg RSA -keysize 2048 -validity 10000
```

2. Create `android/key.properties`:
```properties
storePassword=your-store-password
keyPassword=your-key-password
keyAlias=chaloo_ride
storeFile=/path/to/chaloo_ride.keystore
```

3. Build signed APK:
```bash
flutter build apk --release
```

## Troubleshooting

### Common Issues

**Issue:** "Flutter command not found"
**Solution:**
```bash
export PATH="$PATH:/path/to/flutter/bin"
flutter doctor
```

**Issue:** "Gradle build failed"
**Solution:**
```bash
cd android
./gradlew clean
cd ..
flutter clean
flutter pub get
flutter build apk
```

**Issue:** "SDK license not accepted"
**Solution:**
```bash
flutter doctor --android-licenses
```

### Firebase Notes

This app uses Firebase Firestore as the database (no custom API server).
See `FIREBASE_SETUP.md`.

## Release Checklist

Before releasing new version:

- [ ] Update version in `pubspec.yaml`
- [ ] Update `versionCode` and `versionName` in `android/app/build.gradle`
- [ ] Test on physical devices (Android/iOS)
- [ ] Build release APK: `flutter build apk --release`
- [ ] Test release APK on device
- [ ] Create signed APK with release keystore
- [ ] Upload to repository with version tag

## Performance Optimization

**Reduce APK Size:**
```bash
flutter build apk --split-per-abi --release
```

**Analyze APK Size:**
```bash
flutter build apk --analyze-size
```

**Enable Obfuscation:**
```bash
flutter build apk --obfuscate --split-debug-info=/<project>/debug-info
```

## Support

For issues:
1. Check [Troubleshooting](#troubleshooting) section
2. Run `flutter doctor` to check environment
3. Check Flutter version: `flutter --version`
4. Review build logs for errors
5. Open GitHub issue with error details

## Resources

- [Flutter Documentation](https://flutter.dev/docs)
- [Dart Language](https://dart.dev)
- [Flutter Packages](https://pub.dev)

---

## Firebase Setup

See `FIREBASE_SETUP.md`.

---

**Current Version:** v2.0.0
**Minimum Flutter:** 3.0.0
**Platforms:** Android, iOS
