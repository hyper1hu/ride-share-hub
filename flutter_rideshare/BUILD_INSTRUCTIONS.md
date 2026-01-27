# 📱 RideShare Flutter App - Build Instructions

Complete guide to build and deploy the RideShare mobile application for Android.

## 📋 Prerequisites

### Required Software
- **Flutter SDK** (3.0.0 or higher)
  - Download: https://flutter.dev/docs/get-started/install
- **Android Studio** or **Android SDK Command-line Tools**
  - Download: https://developer.android.com/studio
- **Java JDK** (11 or higher)
- **Git** (for version control)

### Verify Installation
```bash
flutter doctor
```

This command checks your environment and displays a report. Ensure all required components are installed.

## 🚀 Quick Start

### 1. Clone and Setup
```bash
cd flutter_rideshare
flutter pub get
```

### 2. Configure API Endpoint

Edit `lib/config/api_config.dart` and update the base URL:

**For Development (Local Server):**
```dart
static const String baseUrl = 'http://10.0.2.2:5000'; // Android Emulator
// OR
static const String baseUrl = 'http://192.168.1.100:5000'; // Physical Device (use your IP)
```

**For Production:**
```dart
static const String baseUrl = 'https://your-app.onrender.com';
```

### 3. Run on Device/Emulator

**Android Emulator:**
```bash
flutter run
```

**Physical Device:**
1. Enable USB Debugging on your Android device
2. Connect via USB
3. Run: `flutter run`

## 📦 Building APK

### Method 1: Using Build Script (Recommended)

```bash
chmod +x build_apk.sh
./build_apk.sh
```

Follow the interactive prompts to select:
1. Development build (debug)
2. Production build (release)
3. Custom API URL

### Method 2: Manual Build Commands

**Debug APK (for testing):**
```bash
flutter build apk --debug
```

**Release APK (for distribution):**
```bash
flutter build apk --release
```

**Release APK with Custom API:**
```bash
flutter build apk --release --dart-define=API_BASE_URL=https://your-api.com
```

**Split APKs by ABI (smaller size):**
```bash
flutter build apk --release --split-per-abi
```

This creates separate APKs for:
- `app-armeabi-v7a-release.apk` (32-bit ARM)
- `app-arm64-v8a-release.apk` (64-bit ARM)
- `app-x86_64-release.apk` (64-bit x86)

### Method 3: Build with Flavors

**Development Flavor:**
```bash
flutter build apk --debug --flavor development
```

**Production Flavor:**
```bash
flutter build apk --release --flavor production --dart-define=API_BASE_URL=https://your-api.com
```

## 📍 APK Location

After building, find your APK at:
```
build/app/outputs/flutter-apk/app-release.apk
```

Or for split APKs:
```
build/app/outputs/flutter-apk/app-armeabi-v7a-release.apk
build/app/outputs/flutter-apk/app-arm64-v8a-release.apk
build/app/outputs/flutter-apk/app-x86_64-release.apk
```

## 📲 Installing APK

### Method 1: Direct Installation
1. Transfer APK to Android device
2. Enable "Install from Unknown Sources" in Settings
3. Open APK file and install

### Method 2: ADB Installation
```bash
adb install build/app/outputs/flutter-apk/app-release.apk
```

### Method 3: Wireless Installation
```bash
# Connect device to same WiFi
adb tcpip 5555
adb connect <device-ip>:5555
adb install build/app/outputs/flutter-apk/app-release.apk
```

## 🔐 Code Signing (Production)

For production releases, you should use proper code signing.

### 1. Create Keystore
```bash
keytool -genkey -v -keystore rideshare-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias rideshare
```

### 2. Create key.properties
Create `android/key.properties`:
```properties
storePassword=<your-store-password>
keyPassword=<your-key-password>
keyAlias=rideshare
storeFile=<path-to-keystore>/rideshare-release-key.jks
```

### 3. Update build.gradle
The `android/app/build.gradle` is already configured to use signing configs.

### 4. Build Signed APK
```bash
flutter build apk --release
```

## 🎯 Build Configurations

### Development Build
- Debug mode enabled
- Larger APK size
- Includes debugging symbols
- Uses local API (10.0.2.2:5000)
- Fast build time

### Production Build
- Release mode
- Optimized and minified
- ProGuard enabled
- Uses production API
- Smaller APK size
- Slower build time

## 📊 Build Optimization

### Reduce APK Size
```bash
# Split by ABI
flutter build apk --release --split-per-abi

# Enable ProGuard (already configured)
# See android/app/proguard-rules.pro

# Remove unused resources
flutter build apk --release --shrink
```

### Performance Optimization
```bash
# Profile mode (for performance testing)
flutter build apk --profile

# Enable Dart obfuscation
flutter build apk --release --obfuscate --split-debug-info=./debug-info
```

## 🧪 Testing

### Run Tests
```bash
flutter test
```

### Integration Tests
```bash
flutter drive --target=test_driver/app.dart
```

### Performance Testing
```bash
flutter run --profile
```

## 🐛 Troubleshooting

### Common Issues

**1. Gradle Build Failed**
```bash
cd android
./gradlew clean
cd ..
flutter clean
flutter pub get
flutter build apk
```

**2. SDK Version Issues**
Update `android/app/build.gradle`:
```gradle
compileSdk = 34
minSdk = 21
targetSdk = 34
```

**3. Dependency Conflicts**
```bash
flutter pub upgrade
flutter pub get
```

**4. Out of Memory**
Edit `android/gradle.properties`:
```properties
org.gradle.jvmargs=-Xmx4096m
```

**5. Network Issues (API not reachable)**
- For emulator: Use `10.0.2.2` instead of `localhost`
- For physical device: Use your computer's local IP
- Check firewall settings
- Ensure backend server is running

## 📱 Device Requirements

### Minimum Requirements
- Android 5.0 (API Level 21) or higher
- 100 MB free storage
- Internet connection

### Recommended
- Android 8.0 (API Level 26) or higher
- 200 MB free storage
- 2 GB RAM

## 🌐 API Configuration

### Environment Variables
Build with custom API URL:
```bash
flutter build apk --release --dart-define=API_BASE_URL=https://your-api.com
```

### Multiple Environments
```bash
# Development
flutter run --dart-define=API_BASE_URL=http://10.0.2.2:5000

# Staging
flutter run --dart-define=API_BASE_URL=https://staging.your-api.com

# Production
flutter run --dart-define=API_BASE_URL=https://your-api.com
```

## 📦 App Bundle (Google Play)

For Google Play Store distribution, build an App Bundle:

```bash
flutter build appbundle --release
```

Output: `build/app/outputs/bundle/release/app-release.aab`

## 🚀 Deployment Checklist

- [ ] Update version in `pubspec.yaml`
- [ ] Configure production API URL
- [ ] Create release keystore
- [ ] Update app icons and splash screen
- [ ] Test on multiple devices
- [ ] Build release APK/AAB
- [ ] Test installation on clean device
- [ ] Verify all features work
- [ ] Check app permissions
- [ ] Review ProGuard rules
- [ ] Generate release notes

## 📝 Version Management

Update version in `pubspec.yaml`:
```yaml
version: 2.0.0+2
```

Format: `MAJOR.MINOR.PATCH+BUILD_NUMBER`

## 🔗 Useful Commands

```bash
# Check Flutter version
flutter --version

# List connected devices
flutter devices

# Run in release mode
flutter run --release

# Analyze code
flutter analyze

# Format code
flutter format .

# Clean build
flutter clean

# Update dependencies
flutter pub upgrade

# Check for outdated packages
flutter pub outdated
```

## 📞 Support

For issues or questions:
1. Check Flutter documentation: https://flutter.dev/docs
2. Review error logs: `flutter logs`
3. Check GitHub issues
4. Contact development team

## 🎉 Success!

Once built successfully, you'll have a production-ready APK that can be:
- Installed on any Android device (5.0+)
- Distributed via Google Play Store
- Shared directly with users
- Tested on multiple devices

**Happy Building! 🚀**
