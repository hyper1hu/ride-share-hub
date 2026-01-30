# 🚀 Firebase Quick Start - 5 Minutes Setup

## ⚡ Fast Track to Connect Firebase

### Step 1: Download Configuration (2 minutes)
```bash
1. Open: https://console.firebase.google.com/
2. Select your project
3. Settings (⚙️) → Project settings
4. Your apps → Android app
5. Download google-services.json
```

### Step 2: Place File (30 seconds)
```bash
# Copy the downloaded file to your project
cp ~/Downloads/google-services.json android/app/

# Verify it's there
ls -la android/app/google-services.json
```

### Step 3: Enable Firestore (1 minute)
```bash
1. Firebase Console → Build → Firestore Database
2. Create database → Start in test mode
3. Choose location (e.g., asia-south1)
4. Click Enable
```

### Step 4: Build App (2 minutes)
```bash
# Run the setup script
./setup_firebase.sh

# Or manually:
flutter clean
flutter pub get
flutter build apk --release
```

### Step 5: Test (1 minute)
```bash
# Run the app
flutter run

# Or install APK on device
adb install build/app/outputs/flutter-apk/app-release.apk
```

---

## ✅ Verification Checklist

- [ ] `google-services.json` in `android/app/` folder
- [ ] Firestore Database enabled in Firebase Console
- [ ] App builds without errors
- [ ] App opens (not showing "Firebase Setup Required")
- [ ] Can register as customer/driver
- [ ] Data appears in Firestore Console

---

## 🔧 One-Line Commands

### Check if file exists:
```bash
test -f android/app/google-services.json && echo "✓ Found" || echo "✗ Missing"
```

### Quick build:
```bash
flutter clean && flutter pub get && flutter build apk --release
```

### Install on connected device:
```bash
flutter install
```

---

## 🆘 Quick Troubleshooting

### Problem: "Firebase Setup Required" screen
**Fix:** 
```bash
# Verify file exists
ls android/app/google-services.json

# If missing, download from Firebase Console
# If exists, rebuild:
flutter clean && flutter pub get && flutter build apk
```

### Problem: Build fails
**Fix:**
```bash
# Clean everything
flutter clean
rm -rf build/
rm -rf android/build/
rm -rf android/app/build/

# Rebuild
flutter pub get
flutter build apk --release
```

### Problem: "Permission denied" in Firestore
**Fix:**
```
1. Firebase Console → Firestore → Rules
2. Change to: allow read, write: if true;
3. Click Publish
4. Wait 1 minute
```

---

## 📱 Package Name Reference

**Always use this package name in Firebase Console:**
```
com.rideshare.rideshare
```

---

## 🎯 Expected Result

After setup, you should see:
- ✅ App opens to Home Screen
- ✅ Can register as Customer
- ✅ Can register as Driver
- ✅ Data saves to Firestore
- ✅ Can view bookings

---

## 📚 Detailed Guides

- **Full Setup:** See `CONNECT_FIREBASE.md`
- **Security Rules:** See `firestore.rules`
- **Original Setup:** See `FIREBASE_SETUP.md`

---

## 🔥 Firebase Collections Created

After using the app:
```
Firestore Database
├── customers/     (Customer profiles)
├── drivers/       (Driver profiles)  
├── cars/          (Vehicle listings)
├── bookings/      (Ride bookings)
└── otps/          (OTP codes)
```

---

**That's it! Your app should now be connected to Firebase.** 🎉
