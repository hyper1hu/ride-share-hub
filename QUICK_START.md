# ⚡ Quick Start Guide

Get RideShare Hub running locally in 5 minutes.

## 🚀 Fast Setup

### 1. Clone & Install (2 minutes)

```bash
# Clone repository
git clone https://github.com/hyper1hu/ride-share-hub.git
cd ride-share-hub

# Install dependencies
npm install
```

### 2. Configure Database (1 minute)

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/rideshare
SESSION_SECRET=your-secret-key-at-least-32-characters-long
```

### 3. Initialize Database (1 minute)

```bash
# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

### 4. Start Development Server (1 minute)

```bash
npm run dev
```

Open http://localhost:5000

## 🎯 Test Accounts

### Customer Account
- Mobile: `9876543210`
- OTP: `123456` (demo mode)

### Driver Account
- Mobile: `9876543211`
- OTP: `123456` (demo mode)

### Admin Account
- Username: `admin`
- Password: `admin123`
- URL: http://localhost:5000/admin

## 📱 Mobile App Setup

```bash
cd flutter_rideshare
flutter pub get
flutter run
```

## 🔧 Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Database
npm run db:push          # Update database schema
npm run db:seed          # Add sample data
npm run db:studio        # Open database GUI

# Testing
npm test                 # Run tests
npm run lint             # Check code quality
```

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### Database connection error
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify database exists

### Build errors
```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install
npm run build
```

## 📚 Next Steps

- Read [README.md](README.md) for full documentation
- Check [DEPLOY_NOW.md](DEPLOY_NOW.md) for deployment
- Explore API endpoints in server/routes.ts
- Customize UI components in client/src/components

## 🎉 You're Ready!

Start building your ride-sharing platform! 🚗

For detailed documentation, see [README.md](README.md)
