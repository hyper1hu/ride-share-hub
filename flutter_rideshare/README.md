# RideShare Flutter App

A cross-platform car hire/ride-sharing application built with Flutter.

## Setup Instructions

1. **Install Flutter SDK**
   - Download from: https://flutter.dev/docs/get-started/install
   - Add Flutter to your PATH
   - Run `flutter doctor` to verify installation

2. **Install an IDE**
   - VS Code with Flutter extension, OR
   - Android Studio with Flutter plugin

3. **Set up a device**
   - For Android: Install Android Studio and set up an emulator
   - For iOS (Mac only): Install Xcode and set up a simulator
   - Or connect a physical device

4. **Run the app**
   ```bash
   cd flutter_rideshare
   flutter pub get
   flutter run
   ```

## Project Structure

```
lib/
├── main.dart              # App entry point
├── models/
│   ├── car.dart           # Car data model
│   └── booking.dart       # Booking data model
├── providers/
│   └── app_provider.dart  # State management
├── screens/
│   ├── home_screen.dart   # Landing page
│   ├── customer_screen.dart # Browse & book rides
│   └── driver_screen.dart # Manage car listings
└── widgets/
    ├── add_car_dialog.dart    # Add car form
    └── booking_dialog.dart    # Booking form
```

## Features

- Light/dark theme toggle
- Driver dashboard to list cars
- Customer view to browse and book rides
- One-way and round-trip booking options
- Local state management with Provider

## Build for Production

```bash
# Android APK
flutter build apk

# Android App Bundle (for Play Store)
flutter build appbundle

# iOS (Mac only)
flutter build ios
```
