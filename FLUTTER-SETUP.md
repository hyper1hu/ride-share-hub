# Flutter Setup Guide for Windows - Step by Step

## 🎯 What You Need to Run the Mobile App

You have 2 options:
1. **Install Flutter** (to build and test the mobile app)
2. **Skip Flutter** (run web app only for now)

---

## Option 1: Install Flutter (Recommended)

### Step 1: Download Flutter SDK

1. **Open your web browser**
2. **Go to**: https://docs.flutter.dev/get-started/install/windows
3. **Click**: "Download Flutter SDK" button
4. **File will download**: `flutter_windows_X.X.X-stable.zip` (~1 GB)

### Step 2: Extract Flutter

1. **Create a folder**: `C:\flutter` (or any location you prefer, avoid spaces in path)
2. **Right-click** the downloaded ZIP file
3. **Select**: "Extract All..."
4. **Extract to**: `C:\flutter`
   - Final path should be: `C:\flutter\flutter\bin`

### Step 3: Add Flutter to PATH

#### Method A: Using System Settings (Recommended)
1. **Press**: `Windows + R`
2. **Type**: `sysdm.cpl` and press Enter
3. **Click**: "Environment Variables" button
4. **Under "User variables"**, find and select "Path"
5. **Click**: "Edit"
6. **Click**: "New"
7. **Add**: `C:\flutter\flutter\bin`
8. **Click**: "OK" on all windows
9. **Restart** your terminal/PowerShell

#### Method B: Quick PowerShell (Temporary)
```powershell
$env:Path += ";C:\flutter\flutter\bin"
```

### Step 4: Verify Installation

**Close and reopen** your terminal, then run:
```bash
flutter --version
```

You should see:
```
Flutter 3.x.x • channel stable
```

### Step 5: Run Flutter Doctor

```bash
flutter doctor
```

This will check what's missing. You'll see:
- ✅ Flutter (installed)
- ❌ Android toolchain (optional - we'll fix this)
- ❌ Chrome (optional)
- ❌ Visual Studio (optional)

**Don't worry!** We'll fix the important ones.

---

## Step 6: Install Android Studio (For Android Apps)

### Why Android Studio?
- Provides Android SDK
- Includes Android Emulator
- Required to build Android apps

### Installation Steps:

1. **Download Android Studio**
   - Go to: https://developer.android.com/studio
   - Click "Download Android Studio"
   - Run the installer

2. **During Installation**
   - ✅ Check "Android SDK"
   - ✅ Check "Android Virtual Device"
   - Click through the wizard

3. **First Launch Setup**
   - Open Android Studio
   - Click "Next" through the setup wizard
   - Select "Standard" installation
   - Wait for SDK components to download (~2 GB)

4. **Configure Flutter**
   ```bash
   flutter config --android-studio-dir="C:\Program Files\Android Studio"
   ```

5. **Accept Android Licenses**
   ```bash
   flutter doctor --android-licenses
   ```
   - Type `y` for each prompt

---

## Step 7: Setup Android Emulator

### Create Virtual Device:

1. **Open Android Studio**
2. **Click**: "More Actions" → "Virtual Device Manager"
3. **Click**: "Create Device"
4. **Select**: "Pixel 5" (or any phone)
5. **Click**: "Next"
6. **Download**: System Image (select "S" or latest)
7. **Click**: "Next" → "Finish"

### Start Emulator:
In your project terminal:
```bash
flutter emulators --launch <emulator_id>
```

Or click ▶️ play button in Android Studio's Device Manager

---

## Step 8: Setup Your Ride Share App

Now that Flutter is installed, let's setup your app:

### Navigate to Flutter Project:
```bash
cd flutter_rideshare
```

### Install Dependencies:
```bash
flutter pub get
```

### Check Devices:
```bash
flutter devices
```

You should see:
- Windows (desktop) - always available
- Chrome (web) - if Chrome installed
- Android emulator - if running

---

## Step 9: Configure API Connection

### Find Your Computer's IP Address:
```bash
ipconfig
```
Look for "IPv4 Address" (e.g., 192.168.1.100)

### Update API URL:

Open `flutter_rideshare\lib\services\api_service.dart`

Change line ~10:
```dart
// Before
static const String baseUrl = 'https://your-replit-url';

// After (choose based on your device):
static const String baseUrl = 'http://10.0.2.2:5000';  // Android emulator
// OR
static const String baseUrl = 'http://localhost:5000';  // Windows/Chrome
// OR
static const String baseUrl = 'http://192.168.1.XXX:5000';  // Physical device
```

---

## Step 10: Run the App!

### Start Backend Server (in main terminal):
```bash
cd ..
npm run dev
```
Keep this running!

### Start Flutter App (in new terminal):
```bash
cd flutter_rideshare
flutter run
```

### Select Device:
If multiple devices available, you'll be asked:
```
[1]: Windows (desktop)
[2]: Chrome (web)
[3]: Android SDK (emulator)
```
Type the number and press Enter.

---

## 🎉 Success Indicators

You'll know it's working when you see:
1. ✅ Backend server: "[express] serving on port 5000"
2. ✅ Flutter: "Flutter run key commands"
3. ✅ App opens with "Find Your Ride" screen

---

## 🚀 Quick Commands Reference

```bash
# Check Flutter
flutter doctor

# List devices
flutter devices

# Run app (auto-select device)
flutter run

# Run on specific device
flutter run -d windows        # Windows desktop
flutter run -d chrome         # Chrome browser
flutter run -d android        # Android emulator

# Hot reload (while app is running)
Press 'r' in terminal

# Hot restart (full restart)
Press 'R' in terminal

# Build APK
flutter build apk

# Clean project
flutter clean
```

---

## Option 2: Skip Flutter for Now (Run Web App Only)

If you want to test the app without installing Flutter:

### Just run the web app:
```bash
npm run dev
```

Then open: http://localhost:5000

You can:
- ✅ Test admin portal
- ✅ Test customer bookings
- ✅ Test driver registration
- ✅ View all features

**Install Flutter later** when ready for mobile testing.

---

## 🆘 Troubleshooting

### "flutter not recognized"
- Restart terminal after adding to PATH
- Verify Flutter is in PATH: `echo $env:Path`
- Make sure you extracted to correct location

### "No devices available"
- Install Android Studio
- Create and start an emulator
- Or run on Windows: `flutter run -d windows`
- Or run on Chrome: `flutter run -d chrome`

### "Android licenses not accepted"
```bash
flutter doctor --android-licenses
```

### App won't connect to server
1. Make sure backend is running: `npm run dev`
2. Check API URL in `api_service.dart`
3. For Android emulator, use `10.0.2.2` not `localhost`
4. For physical device, use your PC's IP address

### Build errors
```bash
cd flutter_rideshare
flutter clean
flutter pub get
flutter run
```

---

## 📋 Installation Checklist

- [ ] Download Flutter SDK
- [ ] Extract to C:\flutter
- [ ] Add to PATH
- [ ] Verify: `flutter --version`
- [ ] Run: `flutter doctor`
- [ ] Install Android Studio (optional)
- [ ] Accept Android licenses
- [ ] Create Android emulator (optional)
- [ ] Run: `flutter pub get`
- [ ] Update API URL in api_service.dart
- [ ] Start backend: `npm run dev`
- [ ] Run app: `flutter run`

---

## ⏱️ Time Estimates

- Download Flutter: 10-20 minutes
- Install Flutter: 5 minutes
- Install Android Studio: 30-45 minutes
- Total: ~1 hour for complete setup

**Or skip Android Studio** and run on Windows/Chrome in 15 minutes!

---

## 🎯 Recommended for Quick Start

**Easiest path to test the app NOW:**

1. **Run web app** (5 minutes):
   ```bash
   npm run dev
   ```
   Open: http://localhost:5000

2. **Install Flutter later** when you want mobile testing

This way you can test everything today and add mobile later!
