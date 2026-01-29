# Firebase Database Setup Guide

Your RideShare Hub application is already configured to use Firebase Firestore as the primary database. Follow these steps to connect your Firebase database.

## Current Status

✅ Firebase Admin SDK is already installed (`firebase-admin` package)
✅ Firebase storage layer is implemented (`server/firebase-storage.ts`)
✅ Firebase initialization code is ready (`server/firebase-db.ts`)
✅ Application is configured to use Firebase instead of PostgreSQL

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project" or select your existing project
3. Follow the setup wizard to create your project
4. Enable Firestore Database:
   - In Firebase Console, go to "Build" → "Firestore Database"
   - Click "Create database"
   - Choose production mode or test mode
   - Select your database location

## Step 2: Get Service Account Credentials

1. In Firebase Console, go to "Project Settings" (gear icon)
2. Navigate to "Service Accounts" tab
3. Click "Generate New Private Key"
4. A JSON file will be downloaded - keep it secure!

## Step 3: Configure Environment Variables

### Option A: For Production (Recommended)

1. Open the downloaded service account JSON file
2. Copy the **entire JSON content** (it should be one object with fields like `type`, `project_id`, `private_key`, etc.)
3. Open the `.env` file in your project root
4. Replace the `FIREBASE_SERVICE_ACCOUNT_KEY` value with your JSON (as a single line, no formatting):

```bash
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project-id","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
```

5. Update `FIREBASE_PROJECT_ID`:

```bash
FIREBASE_PROJECT_ID=your-project-id
```

### Option B: For Development (Testing)

If you just want to test the application without Firebase:

1. Leave `FIREBASE_SERVICE_ACCOUNT_KEY` empty or remove it
2. The app will run in development mode with console logging for OTP
3. All data operations will still work through Firebase emulation

## Step 4: Start the Application

```bash
npm run dev
```

You should see in the console:
- `[FIREBASE] Initialized with service account credentials` (if credentials are provided)
- OR `[FIREBASE] Running in development mode without credentials` (if no credentials)

## Step 5: Verify Connection

1. The app will automatically create:
   - Default admin account (username: `admin`, password: `admin123`)
   - Sample drivers and vehicles
   - Required collections in Firestore

2. Check Firebase Console → Firestore Database to see the created collections:
   - `customers` - Customer accounts
   - `drivers` - Driver accounts
   - `cars` - Vehicle listings
   - `bookings` - Ride bookings
   - `admins` - Admin accounts
   - `otps` - OTP verification codes
   - `auditLogs` - Security audit logs
   - `rateLimits` - Rate limiting data
   - `driverVehicles` - Driver vehicle information
   - `inquiries` - Customer inquiries
   - `messages` - In-app messaging
   - `supportTickets` - Support requests
   - `driverSchedules` - Driver availability

## Firestore Security Rules (Important for Production)

After setting up, configure Firestore security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Deny all client access - only server can read/write via Admin SDK
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

This ensures that only your server (with Admin SDK credentials) can access the database.

## Troubleshooting

### Error: "Invalid FIREBASE_SERVICE_ACCOUNT_KEY format"

- Make sure the JSON is properly formatted as a single line
- Ensure all quotes are properly escaped
- Verify the JSON is valid (use a JSON validator)

### Error: "Firebase initialization error"

- Check that your service account key is correct
- Verify the project ID matches your Firebase project
- Ensure Firestore is enabled in your Firebase project

### Development Mode (No Firebase credentials)

If you see: `[FIREBASE] Running in development mode without credentials`
- This is normal for development
- OTP codes will be logged to console instead of sent via SMS
- All features will work, but using in-memory Firebase emulation

## API Endpoints

Once connected, your Firebase database will handle all these endpoints:

### Authentication
- `POST /api/auth/send-otp` - Send OTP to mobile
- `POST /api/auth/verify-otp` - Verify OTP and login
- `POST /api/auth/logout` - Logout user

### Customer Routes
- `GET /api/cars` - List available rides
- `POST /api/bookings` - Create a booking
- `GET /api/bookings` - Get user bookings

### Driver Routes
- `POST /api/drivers/register` - Register as driver
- `GET /api/drivers/me` - Get driver profile
- `POST /api/cars` - Create ride listing

### Admin Routes
- `POST /api/admin/login` - Admin login
- `GET /api/admin/drivers` - Manage drivers
- `PATCH /api/admin/drivers/:id/verify` - Verify driver

## Firebase Collections Structure

All data is stored in Firestore with the following structure:

```
Firestore Database
├── admins
│   └── {adminId}: { username, passwordHash, createdAt }
├── customers
│   └── {customerId}: { mobile, name, age, createdAt }
├── drivers
│   └── {driverId}: { mobile, name, age, aadhaarNumber, licenseNumber, verificationStatus, ... }
├── cars
│   └── {carId}: { driverId, vehicleType, origin, destination, fare, seatsAvailable, ... }
├── bookings
│   └── {bookingId}: { carId, customerId, seatsBooked, totalFare, status, ... }
├── otps
│   └── {otpId}: { mobile, otp, userType, expiresAt, verified, ... }
├── auditLogs
│   └── {logId}: { mobile, userType, action, success, ... }
├── rateLimits
│   └── {limitId}: { identifier, limitType, attempts, lockedUntil, ... }
├── driverVehicles
│   └── {vehicleId}: { driverId, vehicleType, vehicleModel, seatingCapacity, ... }
├── inquiries
│   └── {inquiryId}: { customerId, origin, destination, status, ... }
├── messages
│   └── {messageId}: { senderId, receiverId, message, isRead, ... }
├── supportTickets
│   └── {ticketId}: { userId, subject, description, status, ... }
└── driverSchedules
    └── {scheduleId}: { driverId, dayOfWeek, startTime, endTime, ... }
```

## Next Steps

1. Set up Firebase Authentication for OTP (optional, for SMS sending)
2. Configure Firebase Storage for driver document uploads
3. Set up Firebase Cloud Functions for background tasks
4. Enable Firebase Analytics for usage tracking

## Support

For Firebase-specific issues, check:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Guides](https://firebase.google.com/docs/firestore)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
