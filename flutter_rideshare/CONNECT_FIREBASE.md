# 🔥 Connect Your Flutter App to Firebase Console

## ✅ You've Already Created Firebase Project - Great!

Now follow these steps to connect your app:

---

## 📱 **STEP 1: Download Android Configuration File**

### Go to Firebase Console:
1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the **⚙️ Settings** icon → **Project settings**
4. Scroll to **Your apps** section

### Add Android App (if not already added):
1. Click **Add app** → Select **Android** icon
2. Enter these details:
   - **Android package name:** `com.rideshare.rideshare`
   - **App nickname (optional):** RideShare Hub
   - **Debug signing certificate SHA-1 (optional):** Leave blank for now
3. Click **Register app**

### Download google-services.json:
1. Click **Download google-services.json**
2. Save the file to your computer

---

## 📂 **STEP 2: Place Configuration File**

### Copy google-services.json to your project:

**IMPORTANT:** Place the file in this exact location:
```
flutter_rideshare/
└── android/
    └── app/
        └── google-services.json  ← PUT FILE HERE
```

**Command to verify placement:**
```bash
cd flutter_rideshare
ls -la android/app/google-services.json
```

You should see the file listed.

---

## 🗄️ **STEP 3: Enable Firestore Database**

### In Firebase Console:
1. Go to **Build** → **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select your preferred location (e.g., `asia-south1` for India)
5. Click **Enable**

### Configure Security Rules:

After database is created, go to **Rules** tab and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write for development (CHANGE FOR PRODUCTION!)
    match /{document=**} {
      allow read, write: if true;
    }
    
    // Production rules (uncomment when ready):
    // match /customers/{customerId} {
    //   allow read, write: if request.auth != null && request.auth.uid == customerId;
    // }
    // match /drivers/{driverId} {
    //   allow read, write: if request.auth != null && request.auth.uid == driverId;
    // }
    // match /cars/{carId} {
    //   allow read: if true;
    //   allow write: if request.auth != null;
    // }
    // match /bookings/{bookingId} {
    //   allow read, write: if request.auth != null;
    // }
    // match /otps/{otpId} {
    //   allow read, write: if true;
    // }
  }
}
```

Click **Publish**

---

## 🔐 **STEP 4: Enable Authentication (Optional but Recommended)**

### In Firebase Console:
1. Go to **Build** → **Authentication**
2. Click **Get started**
3. Enable **Phone** authentication:
   - Click **Phone** → **Enable** → **Save**
4. This allows OTP verification to work

---

## 🏗️ **STEP 5: Build Your App**

### Clean and rebuild:
```bash
cd flutter_rideshare

# Clean previous builds
flutter clean

# Get dependencies
flutter pub get

# Build APK
flutter build apk --release
```

### Or use the build script:
```bash
chmod +x build_apk.sh
./build_apk.sh
```

---

## ✅ **STEP 6: Verify Connection**

### Run the app:
```bash
flutter run
```

### What to expect:
- ✅ **If connected:** App opens to Home Screen
- ❌ **If not connected:** Shows "Firebase Setup Required" screen

### Check logs for Firebase initialization:
```bash
flutter run --verbose | grep -i firebase
```

You should see:
```
✓ Firebase initialized successfully
✓ Firestore instance created
```

---

## 🧪 **STEP 7: Test Database Connection**

### Test creating a customer:
1. Open the app
2. Click **I'm a Customer**
3. Enter phone number: `+919876543210`
4. Enter OTP: `123456` (any 6 digits for test mode)
5. Fill in customer details
6. Click **Register**

### Verify in Firebase Console:
1. Go to **Firestore Database**
2. You should see a new collection: `customers`
3. Click to view the customer document

---

## 📊 **Expected Firestore Collections**

After using the app, you'll see these collections:

```
Firestore Database
├── customers/          (Customer profiles)
├── drivers/            (Driver profiles)
├── cars/               (Vehicle listings)
├── bookings/           (Ride bookings)
└── otps/               (OTP verification codes)
```

---

## 🔧 **Troubleshooting**

### Problem: "Firebase Setup Required" screen appears

**Solution:**
1. Verify `google-services.json` is in `android/app/` folder
2. Check the file is not empty (should be ~1-2 KB)
3. Run `flutter clean && flutter pub get`
4. Rebuild: `flutter build apk --release`

### Problem: "FirebaseException: [core/no-app]"

**Solution:**
1. Ensure Firebase is initialized in `main.dart`
2. Check `pubspec.yaml` has all Firebase dependencies
3. Run `flutter pub get`

### Problem: "Permission denied" when writing to Firestore

**Solution:**
1. Check Firestore Security Rules are in "test mode"
2. Verify rules allow read/write: `allow read, write: if true;`
3. Wait 1-2 minutes for rules to propagate

### Problem: Build fails with "google-services plugin" error

**Solution:**
1. Check `android/build.gradle` has:
   ```gradle
   classpath 'com.google.gms:google-services:4.4.0'
   ```
2. Check `android/app/build.gradle` has:
   ```gradle
   apply plugin: 'com.google.firebase.crashlytics'
   ```

---

## 🎯 **Quick Checklist**

- [ ] Firebase project created
- [ ] `google-services.json` downloaded
- [ ] File placed in `android/app/` folder
- [ ] Firestore Database enabled
- [ ] Security rules configured
- [ ] Phone authentication enabled (optional)
- [ ] App rebuilt with `flutter build apk`
- [ ] App tested and connects successfully
- [ ] Test data appears in Firestore Console

---

## 📞 **Need Help?**

### Check Firebase initialization:
```bash
cd flutter_rideshare
grep -r "Firebase.initializeApp" lib/
```

### Verify dependencies:
```bash
cat pubspec.yaml | grep firebase
```

### Check Android configuration:
```bash
cat android/app/build.gradle | grep google-services
```

---

## 🚀 **You're All Set!**

Once `google-services.json` is in place and you rebuild the app, Firebase will be fully connected!

**Next Steps:**
1. Download `google-services.json` from Firebase Console
2. Place it in `android/app/` folder
3. Run `flutter build apk --release`
4. Test the app

**Your app is ready to connect - just add the configuration file!** 🎉
