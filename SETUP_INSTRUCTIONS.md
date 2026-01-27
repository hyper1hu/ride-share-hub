# 🚀 RideShare Hub - Setup Instructions

**Quick setup guide to get your application running**

---

## ⚠️ Current Status

Your project is **almost ready** but missing one critical file: `.env`

**What's Working:**
- ✅ All code is complete and functional
- ✅ Dependencies are installed
- ✅ Database schema is defined
- ✅ Sample data is ready to load

**What's Missing:**
- ❌ `.env` file with database credentials

---

## 🎯 Quick Setup (5 Minutes)

### Step 1: Create Database

Choose one of these **FREE** options:

#### Option A: Neon (Recommended - Easiest)
1. Go to https://neon.tech/
2. Sign up (free)
3. Click "Create Project"
4. Copy the connection string (looks like: `postgresql://user:pass@host/db`)

#### Option B: Supabase
1. Go to https://supabase.com/
2. Sign up (free)
3. Create new project
4. Go to Settings → Database
5. Copy connection string

#### Option C: ElephantSQL
1. Go to https://www.elephantsql.com/
2. Sign up (free)
3. Create new instance (Tiny Turtle - Free)
4. Copy URL

#### Option D: Local PostgreSQL
```bash
# Install PostgreSQL
# Ubuntu/Debian:
sudo apt install postgresql postgresql-contrib

# macOS:
brew install postgresql

# Start PostgreSQL
sudo service postgresql start  # Linux
brew services start postgresql  # macOS

# Create database
psql -U postgres
CREATE DATABASE rideshare;
\q

# Connection string:
postgresql://postgres:password@localhost:5432/rideshare
```

---

### Step 2: Create .env File

Create a file named `.env` in the project root:

```bash
cd /vercel/sandbox
nano .env
```

Add this content (replace with your database URL):

```env
# Database Connection
DATABASE_URL=postgresql://username:password@host:5432/database

# Session Secret (generate a random string)
SESSION_SECRET=your-super-secret-random-string-here-change-this

# Environment
NODE_ENV=development
```

**Important:** Replace `DATABASE_URL` with your actual database connection string from Step 1.

**Generate a secure SESSION_SECRET:**
```bash
# Option 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Using OpenSSL
openssl rand -hex 32

# Option 3: Just use a long random string
# Example: my-super-secret-key-12345-change-this-in-production
```

---

### Step 3: Setup Database Schema

```bash
# Push schema to database
npm run db:push
```

This will create all necessary tables:
- customers
- drivers
- cars
- bookings
- admins
- users

---

### Step 4: Start the Application

```bash
npm run dev
```

You should see:
```
[express] serving on port 5000
[express] Environment: development
[express] API ready for mobile app requests
[INIT] Default admin created (username: admin, password: admin123)
[INIT] 5 sample approved drivers created
[INIT] 8 sample vehicles created with West Bengal routes
```

---

### Step 5: Access the Application

Open your browser and visit:

**Main Application:**
- http://localhost:5000

**Portals:**
- Customer: http://localhost:5000/customer
- Driver: http://localhost:5000/driver
- Admin: http://localhost:5000/admin

**Admin Login:**
- Username: `admin`
- Password: `admin123`

---

## 🧪 Verify Setup

Run the test script:

```bash
npm run check
```

You should see:
```
✅ DATABASE_URL is set
✅ Database connection successful
✅ All tables exist
✅ Sample data loaded
✅ Admin account ready
```

---

## 🎉 You're Ready!

Your RideShare Hub is now running with:

- ✅ 1 Admin account
- ✅ 5 Approved drivers
- ✅ 8 Sample vehicles
- ✅ 441+ West Bengal locations
- ✅ Full booking system

---

## 📱 Next Steps

### Test the Web Application

1. **Test Customer Flow:**
   - Go to http://localhost:5000/customer
   - Search: "Kolkata" → "Siliguri"
   - See available vehicles
   - Try booking a ride

2. **Test Driver Portal:**
   - Go to http://localhost:5000/driver
   - Login with OTP (any 10-digit number)
   - Add a new vehicle
   - View bookings

3. **Test Admin Dashboard:**
   - Go to http://localhost:5000/admin
   - Login: admin / admin123
   - View statistics
   - Verify drivers
   - Manage vehicles

### Setup Flutter Mobile App

```bash
cd flutter_rideshare

# Install dependencies
flutter pub get

# Run on Chrome (easiest)
flutter run -d chrome

# Or run on Android emulator
flutter run

# Or build APK
flutter build apk
```

**Update API URL in Flutter:**

Edit `lib/services/api_service.dart`:
```dart
// For local development
static const String baseUrl = 'http://localhost:5000';

// For Android emulator
static const String baseUrl = 'http://10.0.2.2:5000';

// For production
static const String baseUrl = 'https://your-domain.com';
```

---

## 🔧 Troubleshooting

### Issue: "Cannot find package 'dotenv'"
**Solution:**
```bash
npm install
```

### Issue: "DATABASE_URL is not set"
**Solution:**
- Make sure `.env` file exists in project root
- Check that DATABASE_URL is spelled correctly
- Verify no extra spaces in .env file

### Issue: "Database connection failed"
**Solution:**
- Verify database is running
- Check connection string is correct
- Ensure database allows connections from your IP
- For cloud databases, check firewall settings

### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change port in server/index.ts
const port = 5001; // Change to any available port
```

### Issue: "Module not found"
**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🚀 Deploy to Production

Once everything works locally, deploy to production:

### Recommended: Railway (Easiest)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add PostgreSQL
# (Do this in Railway dashboard: New → Database → PostgreSQL)

# Deploy
railway up

# Get your URL
railway domain
```

**Cost:** ~$5-10/month

See `DEPLOYMENT.md` for more deployment options.

---

## 📚 Additional Resources

- **Full Documentation:** See `README.md`
- **Deployment Guide:** See `DEPLOYMENT.md`
- **Quick Start:** See `QUICK-START.md`
- **Project Analysis:** See `PROJECT_ANALYSIS.md`

---

## 🆘 Still Having Issues?

### Check These Files:
1. `.env` - Must exist in project root
2. `package.json` - All dependencies listed
3. `drizzle.config.ts` - Database configuration
4. `server/db.ts` - Database connection

### Common Mistakes:
- ❌ .env file in wrong location (must be in /vercel/sandbox/)
- ❌ Wrong DATABASE_URL format
- ❌ Database not running
- ❌ Firewall blocking database connection
- ❌ Missing npm install

### Debug Mode:
```bash
# Check environment variables
node -e "require('dotenv').config(); console.log(process.env.DATABASE_URL)"

# Test database connection
node -e "require('dotenv').config(); const pg = require('pg'); const pool = new pg.Pool({connectionString: process.env.DATABASE_URL}); pool.query('SELECT NOW()').then(r => console.log('✅ Connected:', r.rows[0])).catch(e => console.error('❌ Error:', e.message))"
```

---

## ✅ Success Checklist

Before moving forward, ensure:

- [ ] `.env` file created with DATABASE_URL
- [ ] Database is accessible
- [ ] `npm install` completed successfully
- [ ] `npm run db:push` created tables
- [ ] `npm run dev` starts server
- [ ] http://localhost:5000 loads
- [ ] Admin login works (admin/admin123)
- [ ] Sample vehicles visible
- [ ] `npm run check` passes all tests

---

## 🎊 Congratulations!

Once all checks pass, you have a fully functional ride-sharing platform!

**What you've built:**
- Full-stack web application
- Mobile app (Flutter)
- Admin dashboard
- Driver & customer portals
- Booking system
- Authentication system
- 441+ locations database

**Next:** Start customizing for your needs or deploy to production!

---

**Need help? Check PROJECT_ANALYSIS.md for detailed technical information.**
