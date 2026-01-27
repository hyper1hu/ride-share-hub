# 🚀 Quick Start Guide - RideShare Hub

Get your RideShare Hub application up and running in minutes!

---

## 📋 Prerequisites

Before you begin, ensure you have:

- ✅ **Node.js 22+** installed ([Download](https://nodejs.org/))
- ✅ **PostgreSQL** database (local or cloud)
- ✅ **Git** installed
- ✅ **npm** or **yarn** package manager

---

## ⚡ Quick Setup (5 Minutes)

### Step 1: Clone the Repository

```bash
git clone https://github.com/hyper1hu/ride-share-hub.git
cd ride-share-hub
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your database credentials
nano .env  # or use your preferred editor
```

**Minimum required configuration in `.env`:**

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/rideshare
SESSION_SECRET=your-secure-random-string-here
NODE_ENV=development
PORT=5000
```

**Generate a secure SESSION_SECRET:**

```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Step 4: Set Up Database

**Option A: Automated Setup (Recommended)**

```bash
chmod +x scripts/setup-db.sh
./scripts/setup-db.sh
```

**Option B: Manual Setup**

```bash
# Push database schema
npm run db:push

# Seed initial data
npm run db:seed
```

### Step 5: Start Development Server

```bash
npm run dev
```

🎉 **Success!** Your application is now running at:
- **API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

---

## 🔑 Default Credentials

After seeding, you can log in with:

### Admin Account
- **Username:** `admin`
- **Password:** `admin123`
- **Access:** Full admin dashboard

### Sample Driver Accounts
- **Username:** `driver1` to `driver5`
- **Password:** `driver123`
- **Status:** All pre-approved

---

## 🗄️ Database Options

### Option 1: Local PostgreSQL

**Install PostgreSQL:**

```bash
# Ubuntu/Debian
sudo apt-get install postgresql

# macOS
brew install postgresql@16

# Windows
# Download from: https://www.postgresql.org/download/
```

**Create Database:**

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE rideshare;

# Exit
\q
```

### Option 2: Cloud PostgreSQL (Free Tiers)

#### Neon (Recommended)
1. Go to https://neon.tech
2. Sign up (free)
3. Create project
4. Copy connection string
5. Update `.env`

**Advantages:** Free 0.5GB, serverless, instant setup

#### Supabase
1. Go to https://supabase.com
2. Create project
3. Get connection string from Settings → Database
4. Update `.env`

**Advantages:** Free 500MB, built-in auth, real-time features

#### Railway
1. Go to https://railway.app
2. Create PostgreSQL service
3. Copy DATABASE_URL
4. Update `.env`

**Advantages:** $5 free credit/month, easy deployment

---

## 🧪 Testing the Setup

### 1. Check API Health

```bash
curl http://localhost:5000/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-27T15:00:00.000Z",
  "service": "RideShare API",
  "version": "2.0.0"
}
```

### 2. Test API Endpoints

```bash
# Get all vehicles
curl http://localhost:5000/api/cars

# Get locations
curl http://localhost:5000/api/locations

# Get API info
curl http://localhost:5000/
```

### 3. Admin Login

```bash
curl -X POST http://localhost:5000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## 📱 Mobile App Setup

### Update API URL in Flutter App

**File:** `flutter_rideshare/lib/main.dart`

```dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // For local development
  ApiService.setBaseUrl('http://10.0.2.2:5000');
  
  // For production (update after deployment)
  // ApiService.setBaseUrl('https://your-api-url.com');
  
  await NotificationService().initialize();
  runApp(const RideShareApp());
}
```

### Build and Run

```bash
cd flutter_rideshare

# Run on emulator
flutter run

# Build APK for Android
flutter build apk --release
```

---

## 🚀 Production Deployment

### Quick Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize and deploy
railway init
railway add postgresql
railway up
```

### Quick Deploy to Render

1. Push code to GitHub
2. Go to https://dashboard.render.com
3. Create Web Service
4. Connect repository
5. Add PostgreSQL database
6. Deploy!

**See [DEPLOYMENT_COMPLETE.md](./DEPLOYMENT_COMPLETE.md) for detailed deployment guides.**

---

## 🐳 Docker Setup (Optional)

### Using Docker Compose

```bash
# Start all services (app + database)
docker-compose up -d

# View logs
docker-compose logs -f

# Run migrations
docker-compose exec app npm run db:push
docker-compose exec app npm run db:seed

# Stop services
docker-compose down
```

**Access:**
- Application: http://localhost:5000
- pgAdmin: http://localhost:5050 (with `--profile tools`)

---

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run TypeScript checks
npm run check

# Database commands
npm run db:push      # Push schema to database
npm run db:seed      # Seed initial data
npm run db:studio    # Open Drizzle Studio (database GUI)
npm run db:generate  # Generate migrations

# Complete setup (install + migrate + seed)
npm run setup
```

---

## 📊 Database Management

### Drizzle Studio (Database GUI)

```bash
npm run db:studio
```

Opens a web interface at http://localhost:4983 to:
- View all tables
- Edit data
- Run queries
- Manage schema

### Manual Database Access

```bash
# Connect to database
psql $DATABASE_URL

# List tables
\dt

# View users
SELECT * FROM users;

# Exit
\q
```

---

## 🔧 Troubleshooting

### Issue: Database Connection Failed

**Solution:**
```bash
# Check DATABASE_URL format
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL

# Verify PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list  # macOS
```

### Issue: Port 5000 Already in Use

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3000 npm run dev
```

### Issue: Build Fails

**Solution:**
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Issue: OTP Not Sending

**Note:** In development, OTPs are logged to console (not sent via SMS).

Check server logs for the OTP code:
```
[OTP] Code for 9876543210: 123456
```

For production, configure SMS service in `.env`:
```env
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
```

---

## 📚 Project Structure

```
ride-share-hub/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   └── lib/           # Utilities
│   └── dist/              # Built frontend
├── server/                # Express backend
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── db.ts             # Database connection
│   ├── storage.ts        # Data access layer
│   └── seed.ts           # Database seeder
├── shared/               # Shared code
│   └── schema.ts         # Database schema
├── scripts/              # Utility scripts
│   ├── setup-db.sh       # Database setup
│   └── deploy.sh         # Deployment helper
├── .env.example          # Environment template
├── package.json          # Dependencies
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker Compose setup
└── README.md             # Project documentation
```

---

## 🎯 Next Steps

1. ✅ **Explore the Admin Dashboard**
   - Login with admin credentials
   - Approve/reject drivers
   - View statistics

2. ✅ **Test the Mobile App**
   - Run Flutter app
   - Register as customer
   - Book a ride

3. ✅ **Customize the Application**
   - Add more vehicle types
   - Customize locations
   - Modify pricing logic

4. ✅ **Deploy to Production**
   - Choose hosting platform
   - Configure environment
   - Deploy and test

5. ✅ **Set Up Monitoring**
   - Configure error tracking
   - Set up uptime monitoring
   - Enable logging

---

## 📖 Documentation

- **[DEPLOYMENT_COMPLETE.md](./DEPLOYMENT_COMPLETE.md)** - Complete deployment guide
- **[SECURITY_ENHANCEMENTS.md](./SECURITY_ENHANCEMENTS.md)** - Security features
- **[IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)** - Implementation details
- **[PROJECT_ANALYSIS.md](./PROJECT_ANALYSIS.md)** - Project overview

---

## 🆘 Need Help?

1. Check the logs: `npm run dev` (watch console output)
2. Review documentation files
3. Check GitHub issues
4. Verify environment variables
5. Test database connection

---

## 🎉 You're All Set!

Your RideShare Hub is ready to use. Start building your ride-sharing platform!

**Happy Coding! 🚀**
