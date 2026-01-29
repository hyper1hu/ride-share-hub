# TODO (Step-by-step)

This checklist keeps the project stable while you configure Firebase and build APKs.

## 1) Firebase Console (Required)

- [ ] Create a Firebase project
- [ ] Enable **Firestore Database**
- [ ] (Optional) Enable **Firebase Auth** (Phone) if you want real phone OTP

## 2) Add Android app in Firebase

- [ ] Firebase Console → Project settings → Your apps → Android
- [ ] Add package name: `com.rideshare.rideshare` (matches `android/app/build.gradle`)
- [ ] Download `google-services.json`
- [ ] Place it at: `android/app/google-services.json`

## 3) Fetch dependencies

- [ ] `flutter pub get`

## 4) Validate code health

- [ ] `flutter analyze`
- [ ] `flutter test`

## 5) Build APK

- [ ] Debug APK: `flutter build apk --debug`
- [ ] Release APK: `flutter build apk --release`

Output path:
- `build/app/outputs/flutter-apk/app-development-debug.apk`
- `build/app/outputs/flutter-apk/app-production-debug.apk`
- `build/app/outputs/flutter-apk/app-development-release.apk`
- `build/app/outputs/flutter-apk/app-production-release.apk`

## 6) Firestore Collections Used

- `customers` (doc id = mobile)
- `drivers` (doc id = mobile)
- `cars` (doc id = carId)
- `bookings` (doc id = bookingId)
- `otps` (doc id = `userType-mobile`)

## 7) Production hardening (Later)

- [ ] Replace Firestore-stored OTP with Firebase Phone Auth
- [ ] Add Firestore security rules (no `allow read, write: if true`)
- [ ] Add role-based access (customer/driver)
- [ ] Add server timestamps consistently and read them safely
