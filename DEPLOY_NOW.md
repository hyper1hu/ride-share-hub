# Deploy to Railway NOW - Quick Guide

## Your Database Info
```
DATABASE_URL: postgresql://postgres:yUUlgDtXKNRSVkNUILOQduTGnrCCSyOZ@yamanote.proxy.rlwy.net:21677/railway
```

## Option 1: Railway Dashboard (Easiest - 5 minutes)

### Step-by-Step:

1. **Go to Railway Dashboard**
   - Visit: https://railway.app/dashboard
   - Login with the account that has your database

2. **Find Your Project**
   - You should see your Postgres database project

3. **Add Backend Service**
   - Click "+ New" button
   - Select "GitHub Repo" (if you have GitHub) OR "Empty Service"

4. **If using GitHub:**
   - Connect your repository
   - Railway will auto-detect Node.js
   - It will auto-add DATABASE_URL from your existing Postgres

5. **If using Empty Service:**
   - After creating, go to Settings
   - Click "Connect Repo" to link GitHub
   - OR use CLI: `railway up` (from your backend directory)

6. **Get Your URL**
   - Go to Settings → Networking
   - Click "Generate Domain"
   - You'll get: `https://your-app.up.railway.app`
   - Copy this URL!

7. **Update Flutter App**
   - Edit: `C:\Users\hyper\Desktop\Ride-Share-Hub\flutter_rideshare\lib\main.dart`
   - Line 14, change to:
   ```dart
   ApiService.setBaseUrl('https://your-app.up.railway.app');
   ```

8. **Rebuild APK**
   ```bash
   cd C:\Users\hyper\Desktop\Ride-Share-Hub\flutter_rideshare
   flutter build apk --release
   ```

Done! 🎉

---

## Option 2: Railway CLI

### Commands:

```bash
# 1. Navigate to backend
cd C:\Users\hyper\Desktop\Ride-Share-Hub

# 2. Login to Railway
railway login
# This opens browser - login there

# 3. Link to your project
railway link
# Select your existing project (the one with Postgres)

# 4. Deploy!
railway up

# 5. Get your URL
railway domain
```

### After Deploy:

```bash
# View logs
railway logs

# Check status
railway status

# Open in browser
railway open
```

---

## Option 3: GitHub + Railway (Most Professional)

### Step 1: Push to GitHub

```bash
cd C:\Users\hyper\Desktop\Ride-Share-Hub

# Create .gitignore if missing
echo "node_modules
dist
.env
*.log" > .gitignore

# Commit all files
git add .
git commit -m "Backend ready for deployment"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOURUSERNAME/ride-share-hub.git
git push -u origin main
```

### Step 2: Connect in Railway

1. Go to https://railway.app/dashboard
2. Open your project (with Postgres)
3. Click "+ New" → "GitHub Repo"
4. Select your repository
5. Railway auto-deploys!

---

## Verify Deployment

### Test your API:

1. **In Browser:**
   ```
   https://your-app.up.railway.app/api/cars
   ```

2. **Should see JSON with vehicles**

3. **Check health:**
   ```
   https://your-app.up.railway.app/
   ```

---

## Update App Configuration

### Create config file for easy switching:

File: `flutter_rideshare/lib/config/app_config.dart`

```dart
class AppConfig {
  // Set to false for production
  static const bool isDevelopment = false;
  
  static String get apiUrl {
    return isDevelopment 
      ? 'http://10.0.2.2:5000'  // Local
      : 'https://your-app.up.railway.app';  // Production
  }
}
```

Update `lib/main.dart`:
```dart
import 'config/app_config.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  ApiService.setBaseUrl(AppConfig.apiUrl);  // Use config
  await NotificationService().initialize();
  runApp(const RideShareApp());
}
```

---

## Troubleshooting

### Backend won't start?

Check Railway logs:
```bash
railway logs
```

Common issues:
- Missing `dist/` folder → Run `npm run build` locally first
- Wrong start command → Should be `node dist/index.js`
- Database connection → Already configured!

### App can't connect?

- Make sure URL is HTTPS
- Rebuild APK after changing URL
- Test API in browser first

---

## What You Need:

✅ DATABASE_URL - Already have it!  
✅ Backend code - Ready!  
✅ Railway account - Already have it!  

**Just pick Option 1 (Dashboard) or Option 2 (CLI) above!**

---

## Expected Result:

**Before:**
- App only works when your computer is running the server

**After:**
- App works anywhere, anytime
- Backend runs 24/7 on Railway
- Database already on Railway
- Total cost: $5/month free credit (enough for testing)

---

## Quick Start (Choose One):

### Fastest: CLI
```bash
railway login
railway link
railway up
railway domain
# Copy the URL and update your app!
```

### Easiest: Dashboard
- Open https://railway.app/dashboard
- Click "+ New" 
- Follow steps above
- Get URL
- Update app!

**Estimated time: 5-10 minutes**
