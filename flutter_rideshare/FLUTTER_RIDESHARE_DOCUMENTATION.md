# Flutter RideShare - Complete Documentation

## Project Overview

**Flutter RideShare** is a comprehensive ride-sharing and car hire application designed specifically for West Bengal, India. The app connects passengers with drivers offering various vehicle types across 441+ locations spanning all 23 districts of West Bengal.

### Key Features

- **Customer Features:**
  - Search and book rides by origin and destination
  - Real-time vehicle availability
  - Multiple vehicle type support (Car, SUV, Van, Bus, Minibus, Motorcycle, Auto Rickshaw, Truck)
  - One-way and round-trip booking options
  - OTP-based authentication
  - Location autocomplete with 441+ locations
  - Booking history and management

- **Driver Features:**
  - Driver registration with document verification (Aadhaar, License)
  - Vehicle listing and management
  - Multi-vehicle support per driver
  - Booking tracking and earnings
  - Admin verification workflow
  - Real-time dashboard

- **General Features:**
  - Modern Material 3 design with light/dark themes
  - Firebase integration for real-time data
  - REST API fallback support
  - Local notifications
  - Geolocation services
  - Interactive maps
  - Offline-capable architecture

## Technology Stack

### Frontend
- **Framework:** Flutter 3.0+
- **State Management:** Provider
- **UI Components:** Material 3
- **Fonts:** Google Fonts (Poppins, Inter)

### Backend Integration
- **Primary:** Firebase (Firestore, Realtime Database, Auth, Storage)
- **Fallback:** REST API with HTTP
- **Data Format:** JSON

### Key Packages
```yaml
dependencies:
  # Core
  flutter: sdk
  provider: ^6.1.1
  http: ^1.1.0

  # Firebase
  firebase_core: ^3.8.0
  firebase_database: ^11.3.2
  firebase_auth: ^5.3.3
  firebase_storage: ^12.3.7
  cloud_firestore: ^5.5.2

  # Location
  geolocator: ^10.1.0
  geocoding: ^2.1.1

  # UI/UX
  google_fonts: ^6.2.1
  flutter_map: ^7.0.2
  shimmer: ^3.0.0
  cached_network_image: ^3.4.1
  fl_chart: ^0.69.0

  # Utilities
  shared_preferences: ^2.2.2
  flutter_local_notifications: ^18.0.1
  permission_handler: ^11.3.1
```

## Project Structure

```
flutter_rideshare/
├── lib/
│   ├── config/
│   │   └── api_config.dart              # API configuration & environment setup
│   ├── data/
│   │   ├── landmarks.dart                # West Bengal landmarks data
│   │   └── locations.dart                # 441+ location database
│   ├── models/
│   │   ├── booking.dart                  # Booking data model
│   │   ├── car.dart                      # Vehicle data model
│   │   ├── customer.dart                 # Customer data model
│   │   └── driver.dart                   # Driver data model
│   ├── providers/
│   │   └── app_provider.dart             # Central state management
│   ├── screens/
│   │   ├── home_screen.dart              # Landing page
│   │   ├── customer_screen.dart          # Customer ride search & booking
│   │   ├── driver_screen.dart            # Driver dashboard
│   │   └── driver_register_screen.dart   # Driver registration & login
│   ├── services/
│   │   ├── api_service.dart              # REST API integration
│   │   ├── firebase_service.dart         # Firebase operations
│   │   ├── location_service.dart         # GPS & geocoding
│   │   ├── map_service.dart              # Map rendering
│   │   └── notification_service.dart     # Local notifications
│   ├── widgets/
│   │   ├── add_car_dialog.dart           # Vehicle listing dialog
│   │   ├── booking_dialog.dart           # Booking confirmation
│   │   ├── custom_gradient_button.dart   # Custom UI buttons
│   │   ├── notification_badge.dart       # Notification indicators
│   │   ├── route_map_view.dart           # Interactive map widget
│   │   ├── shimmer_loading.dart          # Loading animations
│   │   ├── stats_card.dart               # Dashboard statistics
│   │   └── vehicle_marker.dart           # Map markers
│   └── main.dart                         # App entry point
├── android/                              # Android-specific files
├── ios/                                  # iOS-specific files
└── pubspec.yaml                          # Dependencies & configuration
```

## Architecture

### State Management Flow

```
User Action
    ↓
Screen/Widget
    ↓
AppProvider (Provider)
    ↓
Service Layer (ApiService/FirebaseService)
    ↓
Backend (Firebase/REST API)
    ↓
Response Processing
    ↓
State Update (notifyListeners)
    ↓
UI Rebuild
```

### Data Flow

1. **Authentication Flow:**
   - User enters mobile number
   - OTP generated and stored (Firebase Realtime DB or REST API)
   - User enters OTP
   - OTP verified
   - User logged in or redirected to registration

2. **Booking Flow:**
   - Customer searches by origin/destination
   - Available vehicles fetched from Firebase/API
   - Customer selects vehicle and trip type
   - Customer enters/confirms details
   - Booking created in Firestore
   - Notification sent to customer
   - Driver dashboard updated

3. **Driver Registration Flow:**
   - Driver enters mobile number
   - OTP verification
   - Driver enters personal details (name, age)
   - Driver enters documents (Aadhaar, License)
   - Registration submitted to Firebase
   - Status: Pending verification
   - Admin approves/rejects
   - Driver can list vehicles once approved

## Firebase Integration

### Collections Structure

#### Firestore Collections

**cars**
```json
{
  "id": "unique_id",
  "vehicleType": "car|suv|van|bus|minibus|motorcycle|auto_rickshaw|truck",
  "driverName": "John Doe",
  "driverPhone": "9876543210",
  "carModel": "Swift Dzire",
  "carNumber": "WB 01 AB 1234",
  "origin": "Kolkata",
  "destination": "Darjeeling",
  "fare": 5000,
  "returnFare": 4500,
  "departureTime": "8:00 AM",
  "returnTime": "6:00 PM",
  "seatsAvailable": 4,
  "status": "available|booked|unavailable",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**bookings**
```json
{
  "id": "unique_id",
  "carId": "car_id",
  "customerId": "customer_id",
  "customerName": "Jane Doe",
  "customerPhone": "9876543210",
  "seatsBooked": 2,
  "tripType": "one_way|round_trip",
  "totalFare": 10000,
  "status": "confirmed|completed|cancelled",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**customers**
```json
{
  "id": "unique_id",
  "mobile": "9876543210",
  "name": "Jane Doe",
  "age": 28,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**drivers**
```json
{
  "id": "unique_id",
  "mobile": "9876543210",
  "name": "John Doe",
  "age": 35,
  "aadhaarNumber": "1234 5678 9012",
  "licenseNumber": "WB01 20240001234",
  "verificationStatus": "pending|approved|rejected",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### Realtime Database Structure

**otps**
```json
{
  "9876543210": {
    "otp": "123456",
    "userType": "customer|driver",
    "expiresAt": 1704067200000,
    "createdAt": { ".sv": "timestamp" }
  }
}
```

### Fallback Architecture

The app implements a smart fallback system:

```dart
// Example from ApiService
static Future<List<Car>> getCars() async {
  // Try Firebase first if available
  if (_useFirebase) {
    try {
      return await FirebaseService.getCars();
    } catch (e) {
      print('Firebase failed, trying REST API: $e');
    }
  }

  // Fallback to REST API
  try {
    final response = await http.get(Uri.parse('$baseUrl/api/cars'));
    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      return data.map((json) => Car.fromJson(json)).toList();
    }
    return [];
  } catch (e) {
    print('Error fetching cars: $e');
    return [];
  }
}
```

## REST API Endpoints (Fallback)

### Authentication
- `POST /api/auth/otp/send` - Send OTP
- `POST /api/auth/otp/verify` - Verify OTP
- `POST /api/auth/customer/register` - Register customer
- `POST /api/auth/customer/login` - Login customer
- `POST /api/auth/driver/register` - Register driver
- `POST /api/auth/driver/login` - Login driver

### Cars
- `GET /api/cars` - Get all cars
- `GET /api/cars/search?origin=X&destination=Y` - Search cars
- `POST /api/cars` - Create car listing
- `DELETE /api/cars/:id` - Delete car listing

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create booking

## UI/UX Design

### Theme System

The app supports both light and dark themes with Material 3 design principles:

**Light Theme:**
- Primary: Deep Blue (#1E3A8A)
- Secondary: Vibrant Blue (#3B82F6)
- Tertiary: Teal (#14B8A6)
- Background: Light Gray (#F8FAFC)

**Dark Theme:**
- Primary: Vibrant Blue (#3B82F6)
- Secondary: Light Blue (#60A5FA)
- Tertiary: Teal (#14B8A6)
- Background: Dark Navy (#0F172A)

### Key UI Components

1. **Home Screen**
   - Hero section with location coverage
   - Action cards for customer/driver access
   - Statistics display
   - Popular routes showcase
   - Vehicle type chips

2. **Customer Screen**
   - Location autocomplete search
   - Vehicle list with filters
   - Card-based vehicle display
   - Booking bottom sheet

3. **Driver Screen**
   - Verification status display
   - Vehicle listing dashboard
   - Booking management
   - Earnings summary

4. **Driver Registration**
   - Multi-step authentication
   - Document input forms
   - OTP display (dev mode)
   - Profile view

## Location Database

The app includes a comprehensive database of 441+ locations across West Bengal:

### Regions
- Kolkata (25+ locations)
- North Bengal (14+ locations including Darjeeling, Siliguri)
- Beaches (7+ locations including Digha, Mandarmani)
- Central Bengal (8+ locations)
- Religious/Cultural sites (6+ locations)
- Other districts (15+ locations)
- Nearby states (7+ locations)

### Location Features
- Autocomplete search with aliases
- Region-based filtering
- Landmark support
- GPS integration

## Setup Instructions

### Prerequisites
- Flutter SDK 3.0 or higher
- Dart SDK 3.0 or higher
- Android Studio / Xcode (for mobile development)
- Firebase project (optional)

### Installation Steps

1. **Clone the repository**
   ```bash
   cd flutter_rideshare
   ```

2. **Install dependencies**
   ```bash
   flutter pub get
   ```

3. **Firebase Setup (Optional)**

   If using Firebase:
   - Create a Firebase project at https://console.firebase.google.com
   - Add Android app (package: `com.rideshare.app`)
   - Download `google-services.json` → `android/app/`
   - Add iOS app (bundle ID: `com.rideshare.app`)
   - Download `GoogleService-Info.plist` → `ios/Runner/`
   - Enable Firestore, Realtime Database, Authentication
   - Set up security rules:

   **Firestore Rules:**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /cars/{carId} {
         allow read: if true;
         allow write: if request.auth != null;
       }
       match /bookings/{bookingId} {
         allow read, write: if request.auth != null || true;
       }
       match /customers/{customerId} {
         allow read, write: if true;
       }
       match /drivers/{driverId} {
         allow read, write: if true;
       }
     }
   }
   ```

   **Realtime Database Rules:**
   ```json
   {
     "rules": {
       "otps": {
         ".read": false,
         ".write": true,
         "$mobile": {
           ".read": false,
           ".write": true
         }
       }
     }
   }
   ```

4. **Configure API Endpoint (if using REST API)**

   Edit `lib/config/api_config.dart`:
   ```dart
   static const String baseUrl = String.fromEnvironment(
     'API_BASE_URL',
     defaultValue: 'http://10.0.2.2:5000', // For Android Emulator
   );
   ```

   Or build with environment variable:
   ```bash
   flutter run --dart-define=API_BASE_URL=https://your-api.com
   ```

5. **Run the app**
   ```bash
   flutter run
   ```

### Platform-Specific Configuration

#### Android
- Minimum SDK: 21 (Android 5.0)
- Target SDK: 34 (Android 14)
- Permissions required:
  - Internet
  - Location (fine & coarse)
  - Notifications

Edit `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
<uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
```

#### iOS
- Minimum version: 12.0
- Permissions required in `ios/Runner/Info.plist`:
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location to show nearby rides and calculate distances</string>
<key>NSLocationAlwaysUsageDescription</key>
<string>We need your location to track your ride</string>
```

## Building for Production

### Android APK
```bash
flutter build apk --release --dart-define=API_BASE_URL=https://your-production-api.com
```

### Android App Bundle (for Play Store)
```bash
flutter build appbundle --release --dart-define=API_BASE_URL=https://your-production-api.com
```

### iOS App
```bash
flutter build ios --release --dart-define=API_BASE_URL=https://your-production-api.com
```

## Environment Configuration

The app supports multiple environments:

**Development (default):**
```bash
flutter run
# Uses: http://10.0.2.2:5000 (Android Emulator)
```

**Staging:**
```bash
flutter run --dart-define=API_BASE_URL=https://staging-api.com
```

**Production:**
```bash
flutter build apk --release --dart-define=API_BASE_URL=https://api.rideshare.com
```

## Features Implementation Details

### OTP Authentication

1. **Send OTP:**
   - Generates 6-digit OTP
   - Stores in Firebase Realtime Database or REST API
   - Expires in 5 minutes
   - Display in dev mode for testing

2. **Verify OTP:**
   - Validates against stored OTP
   - Checks expiration
   - Removes OTP after verification
   - Returns success/failure

### Vehicle Search

- Origin/destination autocomplete
- Fuzzy search with aliases
- Real-time filtering
- Vehicle type icons
- Availability status
- Fare display (one-way/round-trip)

### Booking System

- Seat selection
- Trip type selection (one-way/round-trip)
- Dynamic fare calculation
- Customer registration (if new)
- Booking confirmation
- Notification trigger

### Driver Verification

- Document collection (Aadhaar, License)
- Admin approval workflow
- Status badges (Pending/Approved/Rejected)
- Dashboard access control

## Testing

### Unit Tests
```bash
flutter test
```

### Integration Tests
```bash
flutter test integration_test/
```

### Widget Tests
Located in `test/widget_test.dart`

## Troubleshooting

### Common Issues

1. **Firebase initialization fails:**
   - App will automatically fall back to REST API
   - Check `google-services.json` / `GoogleService-Info.plist` placement
   - Verify Firebase project configuration

2. **Location permissions not working:**
   - Check `AndroidManifest.xml` and `Info.plist` permissions
   - Ensure location services are enabled on device
   - Request permissions at runtime

3. **Build failures:**
   - Run `flutter clean && flutter pub get`
   - Check Flutter version: `flutter --version`
   - Update dependencies: `flutter pub upgrade`

4. **API connection issues:**
   - For Android Emulator, use `10.0.2.2` instead of `localhost`
   - For iOS Simulator, use `localhost` or `127.0.0.1`
   - For physical device, use computer's local IP

## Performance Optimization

- Image caching with `cached_network_image`
- Lazy loading with `ListView.builder`
- Shimmer loading states
- Efficient state management with Provider
- Minimal rebuilds with `Consumer` widgets
- Firebase query optimization with indexes

## Security Considerations

- OTP expiration (5 minutes)
- Aadhaar number masking
- Secure Firebase rules
- HTTPS for REST API
- Input validation
- Permission handling

## Future Enhancements

- [ ] Real-time ride tracking with GPS
- [ ] In-app chat between driver and customer
- [ ] Payment gateway integration
- [ ] Rating and review system
- [ ] Push notifications via FCM
- [ ] Admin panel for verification
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Ride sharing (pool rides)
- [ ] Driver earnings reports

## Contributing

When contributing to this project:

1. Follow Flutter/Dart style guide
2. Write meaningful commit messages
3. Add comments for complex logic
4. Test on both Android and iOS
5. Update documentation for new features

## License

This project is part of the RideShare Hub ecosystem for West Bengal transportation.

## Support

For issues or questions:
- Check existing documentation
- Review Firebase console logs
- Check network connectivity
- Verify API endpoint configuration

---

## Version History

**v2.0.0 (Current)**
- Firebase integration with Firestore and Realtime Database
- Complete UI overhaul with Material 3
- 441+ location database
- OTP authentication
- Driver verification workflow
- Multi-vehicle type support
- Dark mode support
- Improved state management
- Comprehensive error handling

**v1.0.0**
- Initial release
- Basic ride booking
- REST API integration
- Simple UI

---

**Last Updated:** January 2026
**Maintained By:** RideShare Development Team
