# RideShare - Flutter Car Hire Application

## Overview
A Flutter car hire/ride-sharing application where drivers can list their cars with routes (A to B) and fares, and customers can browse and book rides. Features two main sections - one for drivers and one for customers.

## Project Architecture

### Framework
- **Flutter** with Material Design 3
- **State Management**: Provider
- **Navigation**: Flutter Navigator routes

### Directory Structure
```
lib/
├── main.dart              # App entry point, theming, routes
├── models/
│   ├── car.dart           # Car data model
│   └── booking.dart       # Booking data model
├── services/
│   └── data_service.dart  # In-memory data management
├── screens/
│   ├── home_screen.dart   # Landing page with role selection
│   ├── customer_screen.dart # Browse and book rides
│   └── driver_screen.dart # List and manage cars
└── widgets/
    ├── add_car_dialog.dart   # Form for drivers to list cars
    └── booking_dialog.dart   # Form for customers to book
web/
├── index.html             # Web entry point
└── manifest.json          # PWA manifest
```

### Routes
- `/` - Home page with role selection
- `/customer` - Browse available rides and book seats
- `/driver` - List cars and manage listings

### Data Models
- **Car**: Driver info, route (origin/destination), fares, timings, seats
- **Booking**: Customer info, car reference, seats booked, trip type, fare

## Features
- Light/dark theme toggle
- Material Design 3 styling
- Responsive layout for web and mobile
- In-memory data storage

## Development Commands
- `flutter run -d web-server --web-hostname=0.0.0.0 --web-port=5000` - Run on web
