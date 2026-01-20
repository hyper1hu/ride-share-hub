# Ride Share Hub

A full-stack ride-sharing platform for West Bengal with web and mobile applications.

## Tech Stack

- **Backend**: Node.js, Express, TypeScript, PostgreSQL, Drizzle ORM
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Radix UI
- **Mobile**: Flutter (iOS & Android)

## Prerequisites

### For Web App (Backend + Frontend)
1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
3. **Git** - [Download](https://git-scm.com/)

### For Mobile App
4. **Flutter SDK** (v3.0 or higher) - [Install Guide](https://flutter.dev/docs/get-started/install)
5. **Android Studio** (for Android) - [Download](https://developer.android.com/studio)
6. **Xcode** (for iOS, Mac only) - Available on App Store

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup PostgreSQL Database

#### Option A: Local PostgreSQL
1. Install PostgreSQL
2. Create a database:
```sql
CREATE DATABASE rideshare;
```

#### Option B: Cloud PostgreSQL (Free)
- **Neon**: https://neon.tech/
- **Supabase**: https://supabase.com/
- **ElephantSQL**: https://www.elephantsql.com/

### 3. Configure Environment Variables

The `.env` file has been created. Update it with your database credentials:

```env
DATABASE_URL=postgresql://username:password@host:5432/rideshare
SESSION_SECRET=your-secret-key-here
NODE_ENV=development
```

### 4. Setup Database Schema

```bash
# Generate migration files
npm run db:generate

# Push schema to database
npm run db:push
```

### 5. Run the Web App

```bash
npm run dev
```

The app will be available at: http://localhost:5000

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

## Project Structure

```
├── client/              # React frontend
│   └── src/
│       ├── pages/       # Route pages
│       ├── components/  # UI components
│       └── lib/         # Utilities
├── server/              # Express backend
│   ├── index.ts         # Server entry
│   ├── routes.ts        # API routes
│   ├── db.ts           # Database connection
│   └── storage.ts      # Data access layer
├── shared/              # Shared types & schemas
│   └── schema.ts       # Database schema
├── flutter_rideshare/   # Flutter mobile app
└── script/             # Build scripts
```

## Running the Mobile App

### Setup
```bash
cd flutter_rideshare
flutter pub get
```

### Configure API URL

Edit `lib/main.dart` and update the API URL:
- **Android Emulator**: `http://10.0.2.2:5000`
- **iOS Simulator**: `http://localhost:5000`
- **Physical Device**: `http://YOUR_COMPUTER_IP:5000`

### Run
```bash
# List available devices
flutter devices

# Run on connected device/emulator
flutter run
```

### Build
```bash
# Android APK
flutter build apk

# Android App Bundle (for Play Store)
flutter build appbundle

# iOS (Mac only)
flutter build ios
```

## Features

### Customer Portal
- Browse available rides by route
- Search with 441+ West Bengal locations
- Book rides with OTP authentication
- View booking history

### Driver Portal
- Register with Aadhaar & License verification
- List vehicles (8 types supported)
- Manage routes and pricing
- Track bookings

### Admin Portal
- Verify driver documents
- Manage vehicles and bookings
- View platform statistics
- Monitor revenue

### Mobile App
- Cross-platform iOS & Android
- GPS location services
- Offline location search
- Dark/Light theme

## Vehicle Types Supported

1. Car
2. SUV
3. Van
4. Bus
5. Minibus
6. Motorcycle
7. Auto Rickshaw
8. Truck

## API Endpoints

### Authentication
- `POST /api/auth/customer/register` - Customer registration
- `POST /api/auth/customer/login` - Customer login
- `POST /api/auth/driver/register` - Driver registration
- `POST /api/auth/driver/login` - Driver login
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/otp/send` - Send OTP
- `POST /api/auth/otp/verify` - Verify OTP

### Vehicles
- `GET /api/cars` - List all vehicles
- `GET /api/cars/search?origin=X&destination=Y` - Search vehicles
- `POST /api/cars` - Create vehicle listing
- `PATCH /api/cars/:id` - Update vehicle
- `DELETE /api/cars/:id` - Delete vehicle

### Bookings
- `GET /api/bookings` - List all bookings
- `GET /api/bookings/my` - Customer's bookings
- `POST /api/bookings` - Create booking
- `PATCH /api/bookings/:id` - Update booking

### Admin
- `GET /api/drivers` - List drivers
- `PATCH /api/drivers/:id/verify` - Verify driver
- `GET /api/stats` - Platform statistics

## Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running
- Check DATABASE_URL in `.env`
- Ensure database exists

### Port Already in Use
Change port in `server/index.ts`:
```typescript
const port = 5000; // Change to available port
```

### Flutter Build Issues
```bash
flutter clean
flutter pub get
flutter doctor -v
```

## Development

### Database Changes
After modifying `shared/schema.ts`:
```bash
npm run db:generate
npm run db:push
```

### View Database
```bash
npm run db:studio
```

## Production Build

```bash
# Build frontend and backend
npm run build

# Start production server
node dist/index.cjs
```

## License

ISC

## Support

For issues or questions, please create an issue in the repository.
