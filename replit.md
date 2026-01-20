# RideShare - Vehicle Hire Application

## Overview
A React-based vehicle hire/ride-sharing application supporting multiple vehicle types (cars, buses, vans, motorcycles, etc.). Drivers can list vehicles with routes and fares, customers can browse and book rides. Features landmark-based location selection for easy navigation.

## Project Architecture

### Framework
- **React 18** with TypeScript
- **Express.js** backend server
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter
- **UI Components**: Custom shadcn-style components with Radix primitives
- **Styling**: Tailwind CSS with dark/light theme support

### Directory Structure
```
├── client/
│   ├── index.html           # Web entry point
│   └── src/
│       ├── main.tsx         # React entry point
│       ├── App.tsx          # Routes and providers
│       ├── index.css        # Tailwind + theme CSS
│       ├── components/
│       │   ├── ui/          # Reusable UI components
│       │   ├── theme-toggle.tsx
│       │   ├── add-car-dialog.tsx
│       │   └── booking-dialog.tsx
│       ├── pages/
│       │   ├── home.tsx     # Landing page
│       │   ├── customer.tsx # Browse and book rides
│       │   └── driver.tsx   # List and manage cars
│       ├── hooks/
│       │   ├── use-theme.tsx
│       │   └── use-toast.ts
│       └── lib/
│           ├── queryClient.ts
│           └── utils.ts
├── server/
│   ├── index.ts             # Express server entry
│   ├── routes.ts            # API routes
│   ├── storage.ts           # Database storage with PostgreSQL
│   └── db.ts                # Drizzle ORM database connection
├── shared/
│   └── schema.ts            # Zod schemas and types
├── tailwind.config.ts
├── tsconfig.json
└── postcss.config.js
```

### API Routes
**Vehicles:**
- `GET /api/cars` - List all cars
- `GET /api/cars/search?origin=X&destination=Y` - Search with route matching
- `POST /api/cars` - Create a car listing (requires approved driver)
- `PATCH /api/cars/:id` - Update a car
- `DELETE /api/cars/:id` - Delete a car

**Bookings:**
- `GET /api/bookings` - List all bookings
- `POST /api/bookings` - Create a booking (requires customer login)

**OTP Authentication:**
- `POST /api/auth/otp/send` - Send 6-digit OTP (5-minute expiry)
- `POST /api/auth/otp/verify` - Verify OTP before login/register

**Customer Auth:**
- `POST /api/auth/customer/register` - Register customer (requires verified OTP)
- `POST /api/auth/customer/login` - Login with mobile (requires verified OTP)
- `GET /api/auth/customer/me` - Get current customer session

**Driver Auth:**
- `POST /api/auth/driver/register` - Register driver (requires verified OTP, Aadhaar, license)
- `POST /api/auth/driver/login` - Login with mobile (requires verified OTP)
- `GET /api/auth/driver/me` - Get current driver session
- `GET /api/drivers` - List all drivers (admin)
- `PATCH /api/drivers/:id/verify` - Approve/reject driver (admin)

**Admin Auth:**
- `POST /api/auth/admin/login` - Admin login with username/password
- `POST /api/auth/admin/logout` - Admin logout
- `GET /api/auth/admin/me` - Get current admin session

### Page Routes
- `/` - Home page with role selection
- `/customer` - Browse available rides and book seats
- `/driver` - Driver dashboard to manage vehicles
- `/driver/register` - Driver registration and login
- `/admin` - Admin panel with dashboard, vehicle management, booking overview, and driver verification

### Data Models
- **Car/Vehicle**: Vehicle type, driver info, route (origin/destination), fares, timings, seats (up to 60 for buses)
- **Booking**: Customer info, vehicle reference, seats booked, trip type, fare

### Vehicle Types Supported
- Car, SUV, Van, Bus, Minibus, Motorcycle, Auto Rickshaw, Truck

## Features
- **Multiple Vehicle Types**: 8 different vehicle types with appropriate icons
- **Landmark Location Selection**: 400+ West Bengal and Indian locations for easy selection
  - **Kolkata**: Howrah Station, Sealdah Station, Victoria Memorial, Dakshineswar, Kalighat, Science City, Park Street, Salt Lake, New Town, Gariahat, Behala, Jadavpur, Dumdum, Barasat
  - **North Bengal**: Darjeeling, Siliguri, NJP Station, Bagdogra Airport, Kalimpong, Kurseong, Mirik, Jalpaiguri, Cooch Behar, Alipurduar, Dooars, Jaldapara
  - **Beaches**: Digha, Mandarmani, Tajpur, Bakkhali, Diamond Harbour
  - **Central Bengal**: Durgapur, Asansol, Bardhaman, Bankura, Bishnupur, Purulia, Hooghly, Chandannagar
  - **Religious/Cultural**: Shantiniketan, Nabadwip, Mayapur, Murshidabad, Belur Math
  - **Other Districts**: Malda, Kharagpur, Haldia, Nadia, Birbhum
  - **Nearby States**: Patna (Bihar), Ranchi (Jharkhand), Bhubaneswar (Odisha), Guwahati (Assam)
- **Currency**: Indian Rupees (₹) for all fares
- Light/dark theme toggle with localStorage persistence
- Responsive layout for web and mobile
- PostgreSQL database for data persistence (Drizzle ORM)
- Form validation with Zod
- Real-time fare calculation
- Search/filter rides by origin, destination, and landmarks

## Development Commands
- `npm run dev` - Start development server on port 5000

## Flutter Mobile App

A complete Flutter mobile app is available in `flutter_rideshare/` folder with:

### Structure
```
flutter_rideshare/
├── lib/
│   ├── main.dart                    # App entry with routes
│   ├── data/locations.dart          # 441+ West Bengal locations
│   ├── models/                      # Car, Booking, Customer, Driver
│   ├── providers/app_provider.dart  # State management with auth
│   ├── screens/                     # Home, Customer, Driver, DriverRegister
│   ├── services/                    # API client, GPS location
│   └── widgets/                     # Dialogs and reusable components
├── pubspec.yaml                     # Dependencies
└── README.md                        # Setup instructions
```

### Running the Mobile App
```bash
cd flutter_rideshare
flutter pub get
flutter run
```

### Features
- All 8 vehicle types with icons
- GPS location detection for pickup suggestions
- Driver registration with Aadhaar/license
- Customer auth with mobile number
- Route matching (partial routes)
- Dark/light theme toggle
- Material 3 design

## Recent Changes (January 2026)
- **PostgreSQL Database**: Migrated from in-memory storage to PostgreSQL with Drizzle ORM
  - Tables: customers, drivers, cars, bookings, admins
  - DatabaseStorage class with full CRUD operations
- **Admin Authentication System**: Password-protected admin panel
  - Session-based login with username/password
  - Default credentials: admin / admin123
  - Admin dashboard with vehicle/booking/driver management
- **Sample Demo Data**: Pre-populated data for testing
  - 5 approved Indian drivers (Rajesh Kumar, Sunil Das, Amit Sharma, Bikash Ghosh, Pradeep Mukherjee)
  - 8 vehicles across all types with West Bengal routes (₹150 - ₹4500 fares)
  - Routes: Kolkata-Siliguri, Howrah-Darjeeling, Sealdah-Digha, Salt Lake-Shantiniketan, etc.
- **OTP Authentication System**: 6-digit OTP with 5-minute expiry for enhanced security
  - 3-step flow: mobile entry → OTP verification → login/register
  - Development mode displays OTP in UI for testing
  - InputOTP component with visual 6-digit input slots (web)
  - OTP methods in Flutter ApiService and AppProvider
- Created comprehensive Flutter mobile app (15 Dart files)
- Added GPS location service with geolocator
- Added driver registration screen with OTP verification flow
- Added customer authentication flow with OTP in booking dialog
- Updated all prices to Indian Rupees (₹)
- Added 441+ comprehensive West Bengal locations
- Added support for 8 vehicle types
- All core web and mobile functionality tested and working
