# Setup Guide

Complete installation and configuration guide for RideShare Hub web admin panel.

## Prerequisites

- Node.js 22 or higher
- npm or yarn package manager
- Firebase account (free tier)

## Installation Steps

### 1. Clone Repository

```bash
git clone https://github.com/hyper1hu/ride-share-hub.git
cd ride-share-hub
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Configuration

#### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name and click "Continue"
4. Disable Google Analytics (optional) and click "Create project"

#### Enable Firestore Database

1. In Firebase Console, click "Firestore Database"
2. Click "Create database"
3. Select "Start in production mode"
4. Choose a location and click "Enable"

#### Get Service Account Key

1. Go to Project Settings > Service Accounts
2. Click "Generate new private key"
3. Click "Generate key" and save the JSON file

#### Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` file:

```env
# Firebase Configuration
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project-id",...}
FIREBASE_PROJECT_ID=your-project-id

# Session Configuration
SESSION_SECRET=your-random-secret-key-minimum-32-characters

# Optional
NODE_ENV=production
PORT=5000
```

**Important:** Replace `FIREBASE_SERVICE_ACCOUNT_KEY` with the entire content of your service account JSON file (on a single line).

### 4. Build Application

```bash
npm run build
```

### 5. Start Server

**Production:**
```bash
npm start
```

**Development:**
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Default Admin Access

- **Username:** `admin`
- **Password:** `admin123`

**Important:** Change the default password immediately after first login.

## Deployment

### Option 1: Render.com (Recommended)

1. Create account at [Render.com](https://render.com)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. Add environment variables:
   - `FIREBASE_SERVICE_ACCOUNT_KEY`
   - `FIREBASE_PROJECT_ID`
   - `SESSION_SECRET`
   - `NODE_ENV=production`
6. Click "Create Web Service"

### Option 2: Railway.app

1. Create account at [Railway.app](https://railway.app)
2. Click "New Project" > "Deploy from GitHub repo"
3. Select your repository
4. Add environment variables in "Variables" tab
5. Deploy automatically

### Option 3: Docker

```bash
docker-compose up -d
```

Access at `http://localhost:5000`

## Available Scripts

### Development
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build locally
```

### Testing
```bash
npm test             # Run test suite
npm run lint         # Lint code with ESLint
```

## Firebase Security Rules

After setup, configure Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null;
    }
    match /bookings/{bookingId} {
      allow read, write: if request.auth != null;
    }
    match /vehicles/{vehicleId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to phone
- `POST /api/auth/verify-otp` - Verify OTP and login
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### Admin
- `GET /api/admin/users` - List all users
- `GET /api/admin/drivers` - List all drivers
- `PATCH /api/admin/drivers/:id/verify` - Verify driver
- `GET /api/admin/audit-logs` - View audit logs

### Vehicles
- `GET /api/cars` - List all vehicles
- `POST /api/cars` - Add new vehicle
- `PATCH /api/cars/:id` - Update vehicle
- `DELETE /api/cars/:id` - Delete vehicle

### Bookings
- `GET /api/bookings` - List bookings
- `POST /api/bookings` - Create booking
- `PATCH /api/bookings/:id` - Update booking status

### Locations
- `GET /api/locations` - List all locations
- `GET /api/locations/search` - Search locations

## Troubleshooting

### Firebase Connection Issues

**Error:** "Firebase credentials not configured"

**Solution:**
1. Verify `.env` file exists and contains valid credentials
2. Ensure `FIREBASE_SERVICE_ACCOUNT_KEY` is properly formatted JSON
3. Check `FIREBASE_PROJECT_ID` matches your Firebase project

### Port Already in Use

**Error:** "Port 5000 is already in use"

**Solution:**
1. Change port in `.env`: `PORT=3000`
2. Or kill process: `lsof -ti:5000 | xargs kill`

### Build Failures

**Error:** "Module not found" or build errors

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Database Connection Errors

**Error:** "Cannot connect to Firestore"

**Solution:**
1. Check internet connection
2. Verify Firebase credentials are correct
3. Ensure Firestore is enabled in Firebase Console
4. Check Firebase project ID matches configuration

## Security Best Practices

1. **Change Default Credentials:** Update admin password immediately
2. **Use Strong Session Secret:** Generate random 32+ character string
3. **Enable HTTPS:** Use SSL certificates in production
4. **Firestore Rules:** Configure appropriate security rules
5. **Environment Variables:** Never commit `.env` file to repository
6. **Rate Limiting:** Built-in rate limiting (100 req/15min) is enabled
7. **Regular Updates:** Keep dependencies updated with `npm update`

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Yes | Firebase service account JSON |
| `FIREBASE_PROJECT_ID` | Yes | Firebase project ID |
| `SESSION_SECRET` | Yes | Secret for session encryption (32+ chars) |
| `NODE_ENV` | No | Environment: development/production |
| `PORT` | No | Server port (default: 5000) |

## Support

For issues:
1. Check [Troubleshooting](#troubleshooting) section
2. Review Firebase Console for errors
3. Check application logs
4. Open GitHub issue with error details

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Express.js Documentation](https://expressjs.com)
- [React Documentation](https://react.dev)
- [Flutter Setup](flutter_rideshare/README.md)
