# RideShare Flutter App

A cross-platform vehicle hire/ride-sharing application for West Bengal, India built with Flutter.

## Features

- **8 Vehicle Types**: Car, SUV, Van, Bus, Minibus, Motorcycle, Auto Rickshaw, Truck
- **441+ Locations**: Comprehensive coverage of all 23 West Bengal districts
- **Driver Registration**: Secure registration with Aadhaar and license verification
- **Customer Booking**: Easy ride booking with mobile number authentication
- **GPS Location**: Auto-detect current location for pickup point suggestions
- **Route Matching**: Find rides even on partial routes (Kolkata→Siliguri matches Kolkata→Darjeeling)
- **Indian Rupees (₹)**: All fares displayed in INR
- **Dark/Light Theme**: Toggle between themes with persistence

## Setup Instructions

### Prerequisites

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

### Running the App

```bash
cd flutter_rideshare
flutter pub get
flutter run
```

### Connecting to Backend

The app connects to the Replit backend by default. To configure the API URL:

1. Open `lib/main.dart`
2. Update the `ApiService.setBaseUrl()` call:
   - For Android emulator: `http://10.0.2.2:5000`
   - For iOS simulator: `http://localhost:5000`
   - For physical device: Use your computer's IP address (e.g., `http://192.168.1.100:5000`)

## Project Structure

```
lib/
├── main.dart                    # App entry point with routes
├── data/
│   └── locations.dart           # 441+ West Bengal locations
├── models/
│   ├── car.dart                 # Vehicle model
│   ├── booking.dart             # Booking model
│   ├── customer.dart            # Customer model
│   └── driver.dart              # Driver model with Aadhaar
├── providers/
│   └── app_provider.dart        # State management with auth
├── screens/
│   ├── home_screen.dart         # Landing page
│   ├── customer_screen.dart     # Browse & book rides
│   ├── driver_screen.dart       # Driver dashboard
│   └── driver_register_screen.dart  # Driver login/register
├── services/
│   ├── api_service.dart         # HTTP API client
│   └── location_service.dart    # GPS location service
└── widgets/
    ├── add_car_dialog.dart      # Vehicle listing form
    └── booking_dialog.dart      # Booking form
```

## Screens

### Home Screen
- Welcome page with role selection
- Links to Customer and Driver portals
- Popular routes display
- Vehicle type showcase

### Customer Screen
- Search rides by origin and destination
- Location autocomplete with 441+ locations
- View available vehicles with details
- Book rides with mobile authentication

### Driver Registration
- Login with mobile number
- New driver registration with:
  - Name, Age, Mobile
  - 12-digit Aadhaar number (stored securely, masked in display)
  - Driving license number
- Verification status display (Pending/Approved/Rejected)

### Driver Dashboard
- View listed vehicles
- Add new vehicles with routes and fares
- Manage bookings
- Only accessible after admin approval

## API Endpoints

The app connects to these backend endpoints:

**Authentication:**
- `POST /api/auth/customer/login` - Customer login
- `POST /api/auth/customer/register` - Customer registration
- `POST /api/auth/driver/login` - Driver login
- `POST /api/auth/driver/register` - Driver registration

**Vehicles:**
- `GET /api/cars` - List all vehicles
- `GET /api/cars/search` - Search with route matching
- `POST /api/cars` - Create vehicle listing

**Bookings:**
- `POST /api/bookings` - Create booking

## Build for Production

```bash
# Android APK
flutter build apk

# Android App Bundle (for Play Store)
flutter build appbundle

# iOS (Mac only)
flutter build ios
```

## Permissions

The app requires these permissions:

**Android** (`android/app/src/main/AndroidManifest.xml`):
```xml
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
```

**iOS** (`ios/Runner/Info.plist`):
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>This app needs access to your location to suggest nearby pickup points.</string>
```

## Tech Stack

- **Flutter 3.x** with Material 3 design
- **Provider** for state management
- **HTTP** for API calls
- **Geolocator** for GPS location
- **Geocoding** for address lookup
- **SharedPreferences** for local storage
