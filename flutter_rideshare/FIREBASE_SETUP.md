# Firebase Setup (Chaloo Ride)

This Flutter app is **Firebase-only**:

- **Database:** Firebase Firestore
- **Auth:** Firebase Auth (optional; app currently uses OTP stored in Firestore)

The app will try `Firebase.initializeApp()` at startup. If initialization fails, it will show a setup screen telling you how to add Firebase config.

## 1) Create Firebase project

- Create a Firebase project in the Firebase Console.
- Enable **Firestore Database**.

## 2) Add Firebase to Flutter

Use FlutterFire CLI:

```bash
dart pub global activate flutterfire_cli
flutterfire configure
```

This generates platform config files such as:

- `android/app/google-services.json`
- `ios/Runner/GoogleService-Info.plist`
- `lib/firebase_options.dart` (if you choose to generate it)

## 3) Android configuration

- Ensure `android/app/google-services.json` exists.
- Ensure Google Services Gradle plugin is applied.

## 4) Firestore collections used

The backend stores data in these collections:

- `customers` (doc id = customer mobile)
- `drivers` (doc id = driver mobile)
- `cars` (doc id = car id)
- `bookings` (doc id = booking id)
- `otps` (doc id = `userType-mobile`)

## 5) Security rules (starter)

These are a *starter* set of rules for development only.

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

Replace with proper auth rules before production.
