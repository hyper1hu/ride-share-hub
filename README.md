# 🚗 RideShare Hub

A comprehensive ride-sharing platform built with modern web technologies, featuring customer booking, driver management, and admin controls.

## 🌟 Features

### For Customers
- 🔍 Search rides by origin and destination
- 📱 OTP-based authentication
- 🚗 View available vehicles with pricing
- 📅 Book rides instantly
- 📊 Track booking history

### For Drivers
- 🚙 Register and manage vehicles
- ✅ Driver verification system
- 📋 View and manage bookings
- 💰 Earnings tracking
- 📱 Mobile app support (Flutter)

### For Admins
- 👥 User management
- ✅ Driver verification and approval
- 🚗 Vehicle management
- 📊 Analytics and reporting
- 🔒 Security controls

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Wouter** for routing
- **Shadcn/ui** components
- **Lucide React** icons

### Backend
- **Node.js 22** with Express 5
- **TypeScript** for type safety
- **PostgreSQL** database
- **Drizzle ORM** for database operations
- **Express Session** for authentication

### Mobile
- **Flutter** for iOS & Android
- Cross-platform support
- Native performance

## 📦 Installation

### Prerequisites
- Node.js 22 or higher
- PostgreSQL 14 or higher
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/hyper1hu/ride-share-hub.git
cd ride-share-hub
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env` and add your database URL:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/rideshare
SESSION_SECRET=your-secret-key-here
```

4. **Initialize database**
```bash
npm run db:push
npm run db:seed
```

5. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 🚀 Deployment

### Option 1: Render.com (Free Tier)

1. Create account on [Render.com](https://render.com)
2. Create PostgreSQL database
3. Create Web Service from GitHub repository
4. Add environment variables:
   - `DATABASE_URL` (from Render PostgreSQL)
   - `SESSION_SECRET` (generate random string)
5. Deploy automatically

### Option 2: Railway.app

1. Create account on [Railway.app](https://railway.app)
2. Create new project from GitHub
3. Add PostgreSQL plugin
4. Configure environment variables
5. Deploy with one click

### Option 3: Docker

```bash
# Build and run with Docker Compose
docker-compose up -d

# Initialize database
docker-compose exec app npm run db:push
docker-compose exec app npm run db:seed
```

Access at `http://localhost:5000`

## 📱 Mobile App Setup

### Flutter App

1. **Navigate to Flutter directory**
```bash
cd flutter_rideshare
```

2. **Install dependencies**
```bash
flutter pub get
```

3. **Configure API endpoint**
Edit `lib/config/api_config.dart`:
```dart
static const String baseUrl = 'https://your-api-url.com';
```

4. **Run on device**
```bash
# iOS
flutter run -d ios

# Android
flutter run -d android
```

5. **Build APK**
```bash
flutter build apk --release
```

## 🗂️ Project Structure

```
ride-share-hub/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and auth
│   │   └── hooks/         # Custom React hooks
│   └── index.html
├── server/                # Express backend
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── db.ts             # Database connection
│   └── storage.ts        # Data access layer
├── shared/               # Shared code
│   └── schema.ts         # Database schema & types
├── flutter_rideshare/    # Flutter mobile app
│   ├── lib/
│   │   ├── screens/      # App screens
│   │   ├── models/       # Data models
│   │   └── services/     # API services
│   └── pubspec.yaml
├── script/               # Deployment scripts
│   ├── deploy.sh         # Deployment script
│   └── setup-db.sh       # Database setup
└── docker-compose.yml    # Docker configuration
```

## 🔧 Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Database
```bash
npm run db:push      # Push schema to database
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Drizzle Studio
```

### Testing
```bash
npm test             # Run tests
npm run lint         # Lint code
```

## 🔐 Security Features

- ✅ **Password Hashing** - Bcrypt for secure password storage
- ✅ **Rate Limiting** - 100 requests per 15 minutes
- ✅ **Input Validation** - Zod schema validation
- ✅ **SQL Injection Prevention** - Parameterized queries
- ✅ **Session Management** - Secure session handling
- ✅ **Aadhaar Masking** - PII protection
- ✅ **Account Locking** - After failed login attempts

## 📊 Database Schema

### Tables
- **users** - User accounts (customers, drivers, admins)
- **drivers** - Driver profiles and verification
- **vehicles** - Vehicle information
- **bookings** - Ride bookings
- **locations** - 400+ West Bengal locations
- **vehicle_types** - 8 vehicle categories
- **audit_logs** - Security audit trail
- **rate_limits** - API rate limiting
- **failed_logins** - Login attempt tracking

## 🌍 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Vehicles
- `GET /api/cars` - List all vehicles
- `GET /api/cars/search` - Search vehicles
- `POST /api/cars` - Add vehicle (driver only)
- `PATCH /api/cars/:id` - Update vehicle
- `DELETE /api/cars/:id` - Delete vehicle

### Bookings
- `GET /api/bookings` - List bookings
- `POST /api/bookings` - Create booking
- `PATCH /api/bookings/:id` - Update booking status

### Admin
- `GET /api/admin/drivers` - List drivers
- `PATCH /api/admin/drivers/:id/verify` - Verify driver
- `GET /api/admin/users` - List users
- `GET /api/admin/audit-logs` - View audit logs

### Locations
- `GET /api/locations` - List all locations
- `GET /api/locations/search` - Search locations

## 🎨 UI Components

Built with **Shadcn/ui** components:
- Button, Input, Card, Dialog
- Select, Tabs, Badge, Avatar
- Table, Alert, Toast
- Custom components for booking, vehicle management

## 📝 Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Session
SESSION_SECRET=your-secret-key-minimum-32-characters

# Optional
NODE_ENV=production
PORT=5000
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🐛 Bug Reports

Found a bug? Please open an issue on GitHub with:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Screenshots (if applicable)

## 📞 Support

For support and questions:
- Open an issue on GitHub
- Check existing documentation
- Review deployment guides

## 🎯 Roadmap

- [ ] Real-time ride tracking
- [ ] Payment gateway integration
- [ ] Push notifications
- [ ] Driver ratings and reviews
- [ ] Multi-language support
- [ ] Advanced analytics dashboard

## 🙏 Acknowledgments

- Built with modern web technologies
- UI components from Shadcn/ui
- Icons from Lucide React
- Database ORM by Drizzle

---

**Made with ❤️ for the ride-sharing community**

**Repository:** https://github.com/hyper1hu/ride-share-hub
