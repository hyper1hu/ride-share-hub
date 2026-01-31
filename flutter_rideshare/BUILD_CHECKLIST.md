# Flutter Rideshare - Build Checklist

Use this checklist to ensure your app builds successfully.

## Pre-Build Checklist

### 1. Flutter Environment
- [ ] Flutter SDK installed (`flutter --version`)
- [ ] Android SDK installed (for Android builds)
- [ ] Xcode installed (for iOS builds on macOS)

### 2. Dependencies
- [ ] Run `flutter pub get` successfully
- [ ] No errors in pubspec.yaml
- [ ] All packages resolved

### 3. Firebase Configuration

**Required Files:**
- [ ] `android/app/google-services.json` exists (for Android)
- [ ] OR `lib/firebase_options.dart` configured via FlutterFire CLI

**Firebase Console Setup:**
- [ ] Firebase project created
- [ ] Firestore Database enabled
- [ ] Security rules configured (test mode for development)
- [ ] Android app added to Firebase project with correct package name

**Package Name Verification:**
- [ ] Firebase package name: `com.rideshare.rideshare`
- [ ] Matches `android/app/build.gradle` applicationId
- [ ] Matches `google-services.json` package_name

### 4. Android Build Configuration

**Files to verify:**
- [ ] `android/build.gradle` - Contains Google Services classpath
- [ ] `android/app/build.gradle` - Applies Google Services plugin
- [ ] `android/app/debug.keystore` exists (for debug builds)

**Gradle configuration:**
```groovy
// android/build.gradle should have:
dependencies {
    classpath 'com.google.gms:google-services:4.4.2'
}

// android/app/build.gradle should have:
if (file("google-services.json").exists()) {
    apply plugin: "com.google.gms.google-services"
}
```

### 5. Source Code Verification

**Required files exist:**
- [x] lib/main.dart
- [x] lib/services/backend/bootstrap.dart
- [x] lib/services/backend/firestore_backend.dart
- [x] lib/services/location_service.dart
- [x] lib/services/map_service.dart
- [x] lib/models/ (all model files)
- [x] lib/screens/ (all screen files)
- [x] lib/widgets/ (all widget files)

## Build Commands

### Debug Build (for testing)
```bash
flutter clean
flutter pub get
flutter build apk --debug
```

**Expected output:**
```
✓ Built build/app/outputs/flutter-apk/app-debug.apk
```

### Release Build (for distribution)
```bash
flutter clean
flutter pub get
flutter build apk --release
```

**Expected output:**
```
✓ Built build/app/outputs/flutter-apk/app-release.apk
```

### App Bundle (for Google Play)
```bash
flutter build appbundle --release
```

**Expected output:**
```
✓ Built build/app/outputs/bundle/release/app-release.aab
```

## Common Build Errors

### Error: "google-services.json is missing"

**Fix:**
1. Download from Firebase Console → Project Settings → Your apps
2. Place in `android/app/google-services.json`
3. Verify package name matches

### Error: "Could not resolve com.google.gms:google-services"

**Fix:**
```bash
# Clean and rebuild
flutter clean
cd android && ./gradlew clean && cd ..
flutter pub get
flutter build apk
```

### Error: "Execution failed for task :app:processDebugGoogleServices"

**Fix:**
- Verify `google-services.json` is in correct location
- Check package name in `google-services.json` matches `android/app/build.gradle`
- Ensure file is valid JSON (not corrupted)

### Error: "Firebase initialization failed"

**Fix:**
This is a runtime error, not a build error. It means:
- App built successfully
- Firebase config is missing or incorrect at runtime
- Download `google-services.json` from Firebase Console

## Post-Build Verification

### After Build Succeeds

1. **Check APK exists:**
   ```bash
   ls -lh build/app/outputs/flutter-apk/app-release.apk
   ```

2. **Check APK size:**
   - Debug APK: ~50-80 MB (expected)
   - Release APK: ~30-50 MB (expected)

3. **Install on device:**
   ```bash
   adb install build/app/outputs/flutter-apk/app-release.apk
   ```

4. **Test Firebase connection:**
   - Launch app
   - Try to register as customer/driver
   - Check Firestore Console for new data

### Runtime Verification

When app launches successfully:
- [ ] No crash on startup
- [ ] Can select Customer/Driver
- [ ] Can enter phone number
- [ ] Map loads correctly
- [ ] Location permissions requested
- [ ] Data saves to Firestore

## Building Without google-services.json

The app will **build successfully** even without `google-services.json`, but:
- ❌ Firebase will NOT work at runtime
- ❌ App will crash when trying to use Firebase features
- ✅ You can still test the build process

**To build without Firebase (for testing only):**
1. Comment out Firebase initialization in `lib/services/backend/bootstrap.dart`
2. Use mock backend instead of Firestore
3. Build normally

## Production Build Checklist

Before releasing to users:

- [ ] Use proper release signing (not debug keystore)
- [ ] Update Firestore security rules (remove test mode)
- [ ] Enable Firebase Authentication
- [ ] Set up Crashlytics
- [ ] Configure ProGuard rules
- [ ] Test on multiple devices
- [ ] Verify all permissions work
- [ ] Test offline functionality
- [ ] Performance testing
- [ ] Security audit

## File Locations Reference

```
flutter_rideshare/
├── android/
│   ├── app/
│   │   ├── build.gradle          # App-level config
│   │   ├── google-services.json  # ⚠️ REQUIRED for Firebase
│   │   └── debug.keystore        # For debug signing
│   └── build.gradle              # Project-level config
├── lib/
│   ├── main.dart
│   ├── firebase_options.dart     # Alternative to google-services.json
│   └── services/backend/
│       └── bootstrap.dart        # Firebase initialization
├── pubspec.yaml                  # Dependencies
└── build/
    └── app/outputs/
        └── flutter-apk/
            ├── app-debug.apk     # Debug build output
            └── app-release.apk   # Release build output
```

## Support Resources

- [Flutter Documentation](https://flutter.dev/docs)
- [Firebase Setup Guide](./FIREBASE_SETUP.md)
- [Quick Start Guide](./QUICKSTART.md)
- [Complete Setup Guide](./SETUP_GUIDE.md)

---

**Status:** ✅ App is ready to build once Firebase is configured
**Last Verified:** January 2026
