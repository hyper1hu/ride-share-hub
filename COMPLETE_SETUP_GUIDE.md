# 🚗 RideShare Hub - Complete Setup & Deployment Guide

**Version 2.0.0** | **Date: January 27, 2026**

A comprehensive ride-sharing platform with web admin panel and mobile app for customers and drivers across India.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Quick Start](#quick-start)
5. [Backend Setup](#backend-setup)
6. [Frontend Setup](#frontend-setup)
7. [Mobile App Setup](#mobile-app-setup)
8. [Database Configuration](#database-configuration)
9. [API Documentation](#api-documentation)
10. [Deployment](#deployment)
11. [Testing](#testing)
12. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

RideShare Hub is a full-stack ride-sharing application that connects customers with drivers across India. The platform includes:

- **Web Application**: Customer booking interface and comprehensive admin panel
- **Mobile App**: Flutter-based Android app for customers and drivers
- **Backend API**: Node.js/Express server with Firebase integration
- **Database**: Firebase Firestore (FREE tier available)

### Key Highlights
- ✅ **500+ Indian locations** (all major cities and tourist destinations)
- ✅ **24+ vehicle types** (cars, buses, trucks, auto-rickshaws, etc.)
- ✅ **FREE OTP authentication** via Firebase
- ✅ **Driver verification system** with document upload
- ✅ **Admin panel** with analytics and management tools
- ✅ **Production-ready** mobile app with APK build support

---

## 🌟 Features

### For Customers
- 📱 OTP-based authentication (no password needed)
- 🔍 Search rides by origin and destination
- 🚗 Filter by vehicle type (24+ options)
- 📅 Book rides instantly
- 📊 View booking history
- 💰 Transparent pricing

### For Drivers
- 🚙 Register and manage vehicles
- ✅ Document verification system
- 📋 View and manage bookings
- 💰 Earnings tracking
- 📱 Mobile app support

### For Admins
- 👥 User management
- ✅ Driver verification and approval
- 🚗 Vehicle management (all types)
- 📍 Location management (500+ cities)
- 📊 Analytics dashboard
- 🔒 Security audit logs

---

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Wouter** for routing
- **Shadcn/ui** components
- **TanStack Query** for data fetching
- **Recharts** for analytics

### Backend
- **Node.js 22** with Express 5
- **TypeScript** for type safety
- **Firebase Firestore** (NoSQL database)
- **Firebase Authentication** (OTP)
- **Express Session** for session management

### Mobile
- **Flutter 3.0+** for iOS & Android
- **Provider** for state management
- **HTTP** for API calls
- **Google Fonts** for typography
- **Flutter Map** for location services

### DevOps
- **Docker** support
- **GitHub Actions** ready
- **Render.com** / **Railway.app** deployment
- **Vercel** for frontend hosting

---

## 🚀 Quick Start

### Prerequisites
- Node.js 22 or higher
- npm or yarn
- Firebase account (FREE)
- Flutter SDK (for mobile app)

### 1. Clone Repository
```bash
git clone https://github.com/hyper1hu/ride-share-hub.git
cd ride-share-hub
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
FIREBASE_PROJECT_ID=your-project-id
SESSION_SECRET=your-secret-key-here
NODE_ENV=development
PORT=5000
```

### 4. Build and Run
```bash
# Build the application
npm run build

# Start production server
npm start

# Or for development
npm run dev
```

Access at: `http://localhost:5000`

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

---

## 🔧 Backend Setup

### Firebase Configuration

1. **Create Firebase Project**
   - Go to https://console.firebase.google.com
   - Click "Add Project"
   - Enter project name: `rideshare-hub`
   - Disable Google Analytics (optional)

2. **Enable Firestore Database**
   - Go to Firestore Database
   - Click "Create Database"
   - Start in **Production Mode**
   - Choose location closest to your users

3. **Get Service Account Key**
   - Go to Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Download JSON file
   - Copy entire JSON content to `.env` as single line

4. **Update Firestore Rules**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // For development
      // For production, implement proper security rules
    }
  }
}
```

### API Endpoints

#### Authentication
- `POST /api/auth/send-otp` - Send OTP to mobile
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

#### Vehicles
- `GET /api/cars` - List all vehicles
- `GET /api/cars/search?origin=X&destination=Y` - Search vehicles
- `POST /api/cars` - Add vehicle (driver only)
- `PATCH /api/cars/:id` - Update vehicle
- `DELETE /api/cars/:id` - Delete vehicle
- `GET /api/vehicle-types` - Get all vehicle types

#### Bookings
- `GET /api/bookings` - List bookings
- `POST /api/bookings` - Create booking
- `PATCH /api/bookings/:id` - Update booking status

#### Locations
- `GET /api/locations/all` - Get all locations (500+)
- `GET /api/locations/search?q=query` - Search locations
- `GET /api/locations/popular` - Get popular locations
- `GET /api/locations/state/:state` - Get locations by state

#### Admin
- `POST /api/auth/admin/login` - Admin login
- `GET /api/admin/drivers` - List drivers
- `PATCH /api/admin/drivers/:id/verify` - Verify driver
- `GET /api/admin/users` - List users
- `GET /api/stats` - Get system statistics

---

## 🎨 Frontend Setup

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Environment Variables
```env
VITE_API_URL=http://localhost:5000
```

### Key Components
- `client/src/pages/home.tsx` - Landing page
- `client/src/pages/customer.tsx` - Customer dashboard
- `client/src/pages/driver.tsx` - Driver dashboard
- `client/src/pages/admin.tsx` - Admin panel

---

## 📱 Mobile App Setup

### Prerequisites
```bash
flutter doctor
```

### Setup
```bash
cd flutter_rideshare
flutter pub get
```

### Configure API
Edit `lib/config/api_config.dart`:
```dart
static const String baseUrl = 'http://10.0.2.2:5000'; // Emulator
// OR
static const String baseUrl = 'http://192.168.1.100:5000'; // Physical device
// OR
static const String baseUrl = 'https://your-api.com'; // Production
```

### Run on Device
```bash
# Android Emulator
flutter run

# Physical Device
flutter run -d <device-id>
```

### Build APK
```bash
# Using build script
chmod +x build_apk.sh
./build_apk.sh

# Or manually
flutter build apk --release

# With custom API
flutter build apk --release --dart-define=API_BASE_URL=https://your-api.com

# Split by ABI (smaller size)
flutter build apk --release --split-per-abi
```

APK location: `build/app/outputs/flutter-apk/app-release.apk`

### Install APK
```bash
# Via ADB
adb install build/app/outputs/flutter-apk/app-release.apk

# Or transfer to device and install manually
```

---

## 💾 Database Configuration

### Firebase Firestore Collections

1. **customers** - Customer accounts
2. **drivers** - Driver profiles
3. **cars** - Vehicle listings
4. **bookings** - Ride bookings
5. **admins** - Admin accounts
6. **otps** - OTP records
7. **audit_logs** - Security logs

### Data Structure

**Customer:**
```json
{
  "id": "uuid",
  "mobile": "9876543210",
  "name": "John Doe",
  "age": 25,
  "createdAt": "timestamp"
}
```

**Driver:**
```json
{
  "id": "uuid",
  "mobile": "9876543210",
  "name": "Driver Name",
  "age": 35,
  "aadhaarNumber": "123456789012",
  "licenseNumber": "WB2019123456",
  "verificationStatus": "pending|approved|rejected",
  "createdAt": "timestamp"
}
```

**Vehicle:**
```json
{
  "id": "uuid",
  "driverId": "driver-uuid",
  "vehicleType": "sedan",
  "carModel": "Honda City",
  "carNumber": "WB01AB1234",
  "origin": "Kolkata",
  "destination": "Darjeeling",
  "fare": 2000,
  "seatsAvailable": 4,
  "status": "available"
}
```

---

## 🚀 Deployment

### Option 1: Render.com (Free Tier)

1. **Create Account**: https://render.com
2. **Create Web Service**:
   - Connect GitHub repository
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
3. **Add Environment Variables**:
   - `FIREBASE_SERVICE_ACCOUNT_KEY`
   - `FIREBASE_PROJECT_ID`
   - `SESSION_SECRET`
   - `NODE_ENV=production`
4. **Deploy**: Automatic on git push

### Option 2: Railway.app

1. **Create Account**: https://railway.app
2. **New Project from GitHub**
3. **Add Environment Variables**
4. **Deploy**: Automatic

### Option 3: Docker

```bash
# Build image
docker build -t rideshare-hub .

# Run container
docker run -p 5000:5000 --env-file .env rideshare-hub

# Or use Docker Compose
docker-compose up -d
```

### Option 4: Vercel (Frontend Only)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

---

## 🧪 Testing

### Backend Tests
```bash
npm test
```

### API Testing
```bash
# Test OTP send
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile":"9876543210","userType":"customer"}'

# Test vehicle search
curl http://localhost:5000/api/cars/search?origin=Kolkata&destination=Darjeeling

# Test location search
curl http://localhost:5000/api/locations/search?q=Mumbai
```

### Mobile App Testing
```bash
cd flutter_rideshare
flutter test
```

---

## 🐛 Troubleshooting

### Common Issues

**1. Firebase Connection Error**
- Verify `FIREBASE_SERVICE_ACCOUNT_KEY` is correct JSON
- Check Firebase project ID matches
- Ensure Firestore is enabled

**2. OTP Not Sending**
- Firebase Authentication is FREE for development
- Check Firebase console for errors
- Verify mobile number format (10 digits)

**3. Build Errors**
```bash
# Clean and rebuild
npm run build
# Or
flutter clean && flutter pub get
```

**4. Port Already in Use**
```bash
# Change port in .env
PORT=3000
```

**5. Mobile App Can't Connect to API**
- Emulator: Use `10.0.2.2` instead of `localhost`
- Physical device: Use computer's local IP
- Check firewall settings

---

## 📊 Vehicle Types Supported

The platform supports 24+ vehicle types:

**Cars:**
- Sedan, Hatchback, SUV, MUV, Luxury Sedan

**Commercial:**
- Van, Mini Van, Tempo

**Buses:**
- Bus, Mini Bus, Sleeper Bus, AC Bus, Non-AC Bus, School Bus

**Two-Wheelers:**
- Motorcycle, Scooter, Auto Rickshaw

**Trucks:**
- Mini Truck, Truck, Heavy Truck, Container Truck, Pickup Truck, Tata Ace

**Special:**
- Ambulance

---

## 📍 Locations Covered

**500+ locations across India including:**

- All major cities (Mumbai, Delhi, Bangalore, Kolkata, Chennai, etc.)
- State capitals
- Tourist destinations (Goa, Darjeeling, Shimla, Ooty, etc.)
- Airports and railway stations
- Tier 2 and Tier 3 cities

**States Covered:**
West Bengal, Maharashtra, Karnataka, Tamil Nadu, Kerala, Gujarat, Rajasthan, Delhi NCR, Uttar Pradesh, Madhya Pradesh, Punjab, Haryana, Himachal Pradesh, Uttarakhand, Goa, Bihar, Jharkhand, Odisha, Assam, Northeast States, Jammu & Kashmir, Ladakh, Telangana, Andhra Pradesh

---

## 🔐 Security Features

- ✅ Password hashing (Bcrypt, 12 rounds)
- ✅ Rate limiting (100 req/15min)
- ✅ OTP expiration (10 minutes)
- ✅ Account locking (5 failed attempts)
- ✅ Session management
- ✅ Input validation (Zod)
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ Audit logging
- ✅ Aadhaar number masking

---

## 📞 Support & Resources

### Documentation
- [README.md](./README.md) - Project overview
- [DEPLOY_NOW.md](./DEPLOY_NOW.md) - Quick deployment guide
- [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Firebase configuration
- [BUILD_INSTRUCTIONS.md](./flutter_rideshare/BUILD_INSTRUCTIONS.md) - Mobile app build guide

### Links
- **Repository**: https://github.com/hyper1hu/ride-share-hub
- **Firebase Console**: https://console.firebase.google.com
- **Flutter Docs**: https://flutter.dev/docs

### Default Credentials
- **Admin Username**: admin
- **Admin Password**: admin123
- ⚠️ **Change immediately in production!**

---

## 🎉 Success Checklist

- [ ] Backend server running
- [ ] Firebase configured
- [ ] Admin panel accessible
- [ ] Customer can book rides
- [ ] Driver can register
- [ ] Mobile app connects to API
- [ ] APK builds successfully
- [ ] All tests passing
- [ ] Production deployment complete

---

## 📝 Version History

**v2.0.0** (January 27, 2026)
- ✅ Added 500+ Indian locations
- ✅ Expanded to 24+ vehicle types
- ✅ Enhanced admin panel
- ✅ Production-ready mobile app
- ✅ Comprehensive API documentation
- ✅ Build scripts and deployment guides

**v1.0.0** (Previous)
- Initial release with basic features

---

## 🙏 Acknowledgments

Built with modern technologies:
- React, TypeScript, Node.js, Express
- Firebase, Flutter, Tailwind CSS
- Shadcn/ui, TanStack Query, Recharts

---

**Made with ❤️ for the ride-sharing community across India**

**Ready to deploy and serve millions of users! 🚀**
