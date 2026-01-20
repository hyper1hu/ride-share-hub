# Deployment Guide - Ride Share Hub

## Current Status

✅ **Database**: Already deployed on Railway (Cloud)  
❌ **Backend API**: Running locally on your computer  
❌ **Domain**: Not configured yet

## Quick Deploy (Free Options)

### Option 1: Render.com (RECOMMENDED - Free Forever)

**Steps:**

1. **Sign Up**
   - Go to https://render.com
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "New +" → "Web Service"
   - Connect GitHub repository (or upload manually)
   - Configure:
     ```
     Name: ride-share-hub-api
     Environment: Node
     Build Command: npm install && npm run build
     Start Command: node dist/index.js
     Instance Type: Free
     ```

3. **Add Environment Variable**
   - Click "Environment"
   - Add: `DATABASE_URL` = (copy from your local `.env` file)
   - Save

4. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes
   - You'll get URL: `https://ride-share-hub-api.onrender.com`

5. **Update Flutter App**
   - Change line 14 in `lib/main.dart`:
   ```dart
   // OLD (local)
   ApiService.setBaseUrl('http://10.0.2.2:5000');
   
   // NEW (production)
   ApiService.setBaseUrl('https://ride-share-hub-api.onrender.com');
   ```

6. **Rebuild APK**
   ```bash
   flutter build apk --release
   ```

**Done! Your app now works anywhere with internet.**

---

### Option 2: Railway.app (Same as Your Database)

1. **Go to Railway Dashboard**
   - https://railway.app
   - Same account where your DB is

2. **New Service**
   - In your existing project, click "+ New"
   - Select "GitHub Repo" or "Empty Service"

3. **Configure**
   - Railway auto-detects Node.js
   - Environment variable: `DATABASE_URL` (already there from DB)

4. **Generate Domain**
   - Settings → Generate Domain
   - You get: `https://ride-share-hub-api.up.railway.app`

5. **Update App URL** (same as above)

---

### Option 3: Vercel (Best for Node.js)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd C:\Users\hyper\Desktop\Ride-Share-Hub
   vercel
   ```

3. **Follow Prompts**
   - Link to Vercel account
   - Set up project
   - Add DATABASE_URL

4. **Get URL**
   - `https://ride-share-hub-api.vercel.app`

---

## Add Custom Domain (Optional)

### Buy Domain (~$10/year)

**Recommended Registrars:**
- Namecheap.com
- GoDaddy.com
- Cloudflare Domains

**Example Domains:**
- `ridesharehub.com`
- `rideshare-wb.com`
- `westbengalrides.com`

### Connect Domain to Render/Railway

1. **In Render.com:**
   - Settings → Custom Domain
   - Enter: `api.ridesharehub.com`
   - Follow DNS instructions

2. **In Your Domain Registrar:**
   - DNS Settings
   - Add CNAME record:
     ```
     Name: api
     Value: ride-share-hub-api.onrender.com
     ```

3. **Wait 1-24 hours** for DNS propagation

4. **Update App URL:**
   ```dart
   ApiService.setBaseUrl('https://api.ridesharehub.com');
   ```

---

## Environment Configuration

### For Different Environments

Create `lib/config/app_config.dart`:

```dart
class AppConfig {
  // Change this to false for production
  static const bool isDevelopment = false;
  
  static String get apiUrl {
    if (isDevelopment) {
      // Local development
      return 'http://10.0.2.2:5000';
    } else {
      // Production
      return 'https://ride-share-hub-api.onrender.com';
    }
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

## Backend Deployment Checklist

### Before Deploying:

- [ ] Backend builds successfully (`npm run build`)
- [ ] All environment variables identified
- [ ] DATABASE_URL is correct
- [ ] CORS configured for production
- [ ] Port configuration (`process.env.PORT || 5000`)

### Files Needed for Deployment:

**Already Created:**
- ✅ `Procfile` - Tells Render/Railway how to start app
- ✅ `package.json` - Dependencies and scripts
- ✅ `.env` - Environment variables (don't commit this!)

**Check These:**

1. **package.json should have:**
   ```json
   {
     "scripts": {
       "build": "tsc",
       "start": "node dist/index.js",
       "dev": "ts-node-dev src/index.ts"
     },
     "engines": {
       "node": ">=18.0.0"
     }
   }
   ```

2. **src/index.ts should use PORT:**
   ```typescript
   const PORT = process.env.PORT || 5000;
   app.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
   });
   ```

3. **CORS configured:**
   ```typescript
   import cors from 'cors';
   app.use(cors({
     origin: '*', // or specific domains
     credentials: true
   }));
   ```

---

## Testing Deployment

### Test Backend API:

1. **Health Check:**
   ```
   https://your-api-url.com/
   ```

2. **Get Vehicles:**
   ```
   https://your-api-url.com/api/cars
   ```

3. **In Browser Console:**
   ```javascript
   fetch('https://your-api-url.com/api/cars')
     .then(r => r.json())
     .then(console.log)
   ```

### Test Flutter App:

1. Build APK with production URL
2. Install on real device (not emulator)
3. Test with mobile data (not WiFi)
4. Check all features work

---

## Monitoring & Maintenance

### Free Tier Limitations:

**Render.com Free:**
- Spins down after 15 min inactivity
- First request after sleep: 30-60 seconds
- 750 hours/month free
- Good for testing/demo

**Railway Free:**
- $5 free credit/month
- Pay only for usage
- No sleep time
- Better for production

**Solutions:**
1. Upgrade to paid plan ($7-20/month)
2. Use cron job to ping server every 14 minutes
3. Accept 30s delay on first request

### Monitoring:

**Set up in Render/Railway:**
- View logs
- Monitor performance
- Set up alerts
- Check error rates

---

## Cost Breakdown

### Completely Free Option:
- **Database**: Railway (free tier) ✅ Already using
- **Backend**: Render.com (free tier)
- **Frontend**: APK distributed directly
- **Total**: $0/month

### Professional Option:
- **Domain**: $10-15/year (~$1/month)
- **Backend**: Render.com Starter ($7/month)
- **Database**: Railway (free or $5/month)
- **Total**: $8-13/month

### Enterprise Option:
- **Domain**: $15/year
- **Backend**: Railway Pro ($20/month)
- **CDN**: Cloudflare (free)
- **Monitoring**: Better Stack (free tier)
- **Total**: $20-25/month

---

## Quick Start Commands

### Deploy to Render (Manual):

```bash
# 1. Build your backend
cd C:\Users\hyper\Desktop\Ride-Share-Hub
npm install
npm run build

# 2. Push to GitHub
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/yourusername/ride-share-hub.git
git push -u origin main

# 3. Connect to Render.com via their dashboard
```

### Update App URL:

```bash
cd C:\Users\hyper\Desktop\Ride-Share-Hub\flutter_rideshare

# Edit lib/main.dart line 14
# Change to your production URL

flutter build apk --release
```

---

## Troubleshooting

### Backend won't start:
- Check logs in Render/Railway dashboard
- Verify DATABASE_URL is correct
- Check Node.js version matches
- Ensure `dist/` folder exists

### App can't connect:
- Verify URL is HTTPS (not HTTP)
- Check CORS is enabled
- Test API URL in browser first
- Rebuild APK after URL change

### Database connection fails:
- Check DATABASE_URL format
- Verify Railway DB is running
- Check firewall/security rules
- Test connection from backend logs

---

## Next Steps

1. **Choose hosting** (Render recommended for beginners)
2. **Deploy backend** (10 minutes)
3. **Get production URL**
4. **Update app URL**
5. **Rebuild APK**
6. **Test on real device**
7. **(Optional) Buy domain**
8. **Submit to Play Store**

---

## Support

**Render.com Docs**: https://render.com/docs  
**Railway Docs**: https://docs.railway.app  
**Vercel Docs**: https://vercel.com/docs

**Need help?** Check the logs first - they show 90% of issues!
