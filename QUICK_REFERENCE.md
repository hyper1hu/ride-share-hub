# 🚀 RideShare Hub - Quick Reference Guide

**Version 2.0.0** | **Production Ready**

---

## ⚡ Quick Commands

### Backend
```bash
# Install dependencies
npm install

# Development
npm run dev

# Build
npm run build

# Production
npm start

# Database
npm run db:push
npm run db:seed
```

### Mobile App
```bash
cd flutter_rideshare

# Install dependencies
flutter pub get

# Run on device
flutter run

# Build APK (automated)
./build_apk.sh

# Build APK (manual)
flutter build apk --release --dart-define=API_BASE_URL=https://your-api.com

# Install APK
adb install build/app/outputs/flutter-apk/app-release.apk
```

---

## 🔑 Default Credentials

**Admin Panel:**
- Username: `admin`
- Password: `admin123`
- ⚠️ **Change immediately in production!**

---

## 🌐 API Endpoints

### Base URL
```
Development: http://localhost:5000
Production: https://your-app.onrender.com
```

### Authentication
```
POST /api/auth/send-otp
POST /api/auth/verify-otp
POST /api/auth/logout
GET  /api/auth/me
```

### Vehicles
```
GET    /api/cars
GET    /api/cars/search?origin=X&destination=Y
POST   /api/cars
PATCH  /api/cars/:id
DELETE /api/cars/:id
GET    /api/vehicle-types
```

### Locations
```
GET /api/locations/all
GET /api/locations/search?q=query
GET /api/locations/popular
GET /api/locations/state/:state
```

### Bookings
```
GET   /api/bookings
POST  /api/bookings
PATCH /api/bookings/:id
```

### Admin
```
POST  /api/auth/admin/login
GET   /api/admin/drivers
PATCH /api/admin/drivers/:id/verify
GET   /api/stats
```

---

## 📱 Mobile App Configuration

### API URL Setup
Edit `flutter_rideshare/lib/config/api_config.dart`:

**For Android Emulator:**
```dart
static const String baseUrl = 'http://10.0.2.2:5000';
```

**For Physical Device:**
```dart
static const String baseUrl = 'http://192.168.1.100:5000'; // Your computer's IP
```

**For Production:**
```dart
static const String baseUrl = 'https://your-app.onrender.com';
```

---

## 🔥 Firebase Setup

### Quick Setup
1. Create project: https://console.firebase.google.com
2. Enable Firestore Database
3. Get service account key (Project Settings > Service Accounts)
4. Add to `.env`:
```env
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
FIREBASE_PROJECT_ID=your-project-id
```

---

## 🚀 Deployment

### Render.com (Free)
1. Connect GitHub repo
2. Build: `npm install && npm run build`
3. Start: `npm start`
4. Add environment variables
5. Deploy

### Railway.app
1. New project from GitHub
2. Add environment variables
3. Deploy automatically

### Docker
```bash
docker build -t rideshare-hub .
docker run -p 5000:5000 --env-file .env rideshare-hub
```

---

## 📊 Features Summary

### Locations
- **500+ Indian locations**
- All major cities
- Tourist destinations
- Airports & railway stations
- 25+ states covered

### Vehicles
- **24+ vehicle types**
- Cars: Sedan, Hatchback, SUV, MUV, Luxury
- Buses: AC, Non-AC, Sleeper, Mini, School
- Trucks: Mini, Heavy, Container, Pickup, Tata Ace
- Others: Auto, Motorcycle, Scooter, Ambulance

### Users
- **Customers**: Book rides, OTP login
- **Drivers**: Register, manage vehicles
- **Admins**: Verify drivers, manage system

---

## 🔧 Environment Variables

### Required
```env
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
FIREBASE_PROJECT_ID=your-project-id
SESSION_SECRET=your-secret-key-32-chars-minimum
NODE_ENV=production
PORT=5000
```

### Optional
```env
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 📁 Project Structure

```
ride-share-hub/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Customer, Driver, Admin
│   │   ├── components/    # UI components
│   │   └── lib/           # Utilities
│   └── index.html
├── server/                # Express backend
│   ├── index.ts          # Server entry
│   ├── routes.ts         # API routes
│   ├── firebase-storage.ts
│   └── data/
│       └── indian-locations.ts  # 500+ locations
├── shared/               # Shared types
│   └── schema.ts         # 24+ vehicle types
├── flutter_rideshare/    # Mobile app
│   ├── lib/
│   │   ├── config/       # API config
│   │   ├── screens/      # App screens
│   │   └── services/     # API services
│   ├── android/          # Android config
│   └── build_apk.sh      # Build script
└── dist/                 # Production build
```

---

## 🧪 Testing

### Backend
```bash
# Test API
curl http://localhost:5000/api/stats

# Test location search
curl http://localhost:5000/api/locations/search?q=Mumbai

# Test vehicle types
curl http://localhost:5000/api/vehicle-types
```

### Mobile App
```bash
# Run tests
flutter test

# Run on device
flutter run

# Check for issues
flutter doctor
```

---

## 🐛 Common Issues

### Backend won't start
```bash
npm install
npm run build
npm start
```

### Firebase error
- Check service account key is valid JSON
- Verify project ID matches
- Ensure Firestore is enabled

### Mobile app can't connect
- Use `10.0.2.2` for emulator
- Use local IP for physical device
- Check firewall settings

### Build fails
```bash
# Backend
npm clean-install
npm run build

# Mobile
flutter clean
flutter pub get
flutter build apk
```

---

## 📞 Support

### Documentation
- [COMPLETE_SETUP_GUIDE.md](./COMPLETE_SETUP_GUIDE.md) - Full setup
- [BUILD_INSTRUCTIONS.md](./flutter_rideshare/BUILD_INSTRUCTIONS.md) - Mobile app
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Deployment
- [PROJECT_ENHANCEMENTS_SUMMARY.md](./PROJECT_ENHANCEMENTS_SUMMARY.md) - Changes

### Resources
- Firebase: https://console.firebase.google.com
- Flutter: https://flutter.dev/docs
- Render: https://render.com/docs

---

## ✅ Pre-Launch Checklist

- [ ] Backend deployed and running
- [ ] Firebase configured
- [ ] Admin password changed
- [ ] Mobile APK built
- [ ] All features tested
- [ ] Documentation reviewed
- [ ] Environment variables secured
- [ ] Monitoring setup

---

## 🎯 Key Numbers

- **Locations:** 500+
- **Vehicle Types:** 24+
- **States Covered:** 25+
- **API Endpoints:** 20+
- **Build Time:** ~5 seconds
- **Bundle Size:** 1.47 MB
- **Min Android:** 5.0 (API 21)

---

## 💡 Pro Tips

1. **Development:** Use `npm run dev` for hot reload
2. **Mobile Testing:** Use Android emulator for quick testing
3. **Production:** Always use HTTPS
4. **Security:** Change default admin password
5. **Performance:** Enable caching and compression
6. **Monitoring:** Set up error tracking
7. **Backup:** Regular Firebase backups
8. **Updates:** Keep dependencies updated

---

## 🚀 Launch Steps

1. **Deploy Backend**
   ```bash
   # Push to GitHub
   git push origin main
   
   # Deploy on Render/Railway
   # Add environment variables
   # Wait for deployment
   ```

2. **Build Mobile App**
   ```bash
   cd flutter_rideshare
   ./build_apk.sh
   # Select production build
   # Enter production API URL
   ```

3. **Test Everything**
   - Admin login
   - Customer booking
   - Driver registration
   - Mobile app features

4. **Go Live!**
   - Announce launch
   - Monitor logs
   - Gather feedback
   - Iterate

---

## 📈 Success Metrics

Track these after launch:
- User registrations
- Bookings created
- Drivers verified
- API response times
- Error rates
- User feedback

---

**🎉 You're Ready to Launch! 🎉**

**For detailed information, see:**
- [COMPLETE_SETUP_GUIDE.md](./COMPLETE_SETUP_GUIDE.md)
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

**Repository:** https://github.com/hyper1hu/ride-share-hub

---

**Version 2.0.0 - Production Ready! 🚀**
