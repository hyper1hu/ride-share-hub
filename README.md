# RideShare Hub

A comprehensive ride-sharing platform with mobile application for drivers and customers, and web-based admin panel for management.

## Platform Components

### Mobile Application (Android APK)
Native mobile app built with Flutter for iOS and Android devices.

**Features:**
- Customer ride booking with OTP authentication
- Driver vehicle registration and management
- Real-time booking management
- Earnings tracking for drivers
- Cross-platform support (iOS & Android)

**Download:**
- Latest APK: `flutter_rideshare/RideShareHub-v2.0.0.apk`
- Build your own: See [flutter_rideshare/README.md](flutter_rideshare/README.md)

### Web Admin Panel
Comprehensive admin dashboard for platform management.

**Features:**
- User management (customers, drivers, admins)
- Driver verification and approval system
- Vehicle management and monitoring
- Booking oversight and analytics
- Security audit logs and controls
- Real-time analytics and reporting

**Access:** Deploy to any Node.js hosting platform or run locally

## Tech Stack

**Mobile App:**
- Flutter 3.x for cross-platform development
- Material Design UI components
- HTTP client for API integration

**Web Admin Panel:**
- React 18 with TypeScript
- Tailwind CSS + Shadcn/ui components
- Node.js 22 + Express 5 backend
- Firebase Firestore database
- Firebase Authentication for OTP

## Quick Start

### Mobile App Setup

```bash
cd flutter_rideshare
flutter pub get
flutter build apk --release
```

See detailed instructions: [flutter_rideshare/README.md](flutter_rideshare/README.md)

### Web Admin Panel Setup

```bash
npm install
npm run build
npm start
```

See detailed instructions: [SETUP.md](SETUP.md)

## Documentation

- [SETUP.md](SETUP.md) - Complete installation and configuration guide
- [flutter_rideshare/README.md](flutter_rideshare/README.md) - Mobile app documentation

## Repository Structure

```
ride-share-hub/
├── flutter_rideshare/       # Flutter mobile application
│   ├── lib/                 # Dart source code
│   ├── android/             # Android configuration
│   └── RideShareHub-v2.0.0.apk  # Pre-built APK
├── client/                  # React web admin panel
│   └── src/                 # Frontend source code
├── server/                  # Express backend API
│   ├── index.ts            # Server entry point
│   └── routes.ts           # API routes
└── shared/                  # Shared schemas and types
```

## Support

For issues and questions:
- Open an issue on GitHub
- Check documentation files
- Review setup guides

## License

MIT License

---

**Repository:** https://github.com/hyper1hu/ride-share-hub
