# 🚀 Blackbox Deploy Guide - RideShare Hub

## ✅ Issue Fixed: Cloud Build Configuration Error

### **Problem**
```
Error: Build failed: Cloud Build configuration error: 
{ "error": { "code": 400, "message": "generic::invalid_argument: 
invalid value for 'build.substitutions': key in the template \"START_CMD\" 
is not a valid built-in substitution", "status": "INVALID_ARGUMENT" } }
```

### **Solution**
Created proper `cloudbuild.yaml` files that use only valid Google Cloud Build substitutions:
- ✅ `$PROJECT_ID` - Valid built-in substitution
- ✅ `$COMMIT_SHA` - Valid built-in substitution
- ✅ `$BUILD_ID` - Valid built-in substitution
- ❌ `$START_CMD` - Invalid custom substitution (removed)

---

## 📋 Deployment Options

### **Option 1: Use Simplified Cloud Build (Recommended)**

This is the easiest option for quick deployment.

**Step 1:** Rename the simplified config
```bash
cd /vercel/sandbox
mv cloudbuild.yaml cloudbuild-full.yaml
mv cloudbuild-simple.yaml cloudbuild.yaml
```

**Step 2:** Commit and push to GitHub
```bash
git add cloudbuild.yaml
git commit -m "fix: use simplified Cloud Build configuration"
git push origin main
```

**Step 3:** Deploy with Blackbox
```bash
# Use Blackbox Deploy command
blackbox deploy
```

**Step 4:** Set environment variables in Cloud Run (after first deployment)
```bash
gcloud run services update rideshare-hub \
  --region=us-central1 \
  --set-env-vars="DATABASE_URL=your-firebase-or-postgres-url"
```

---

### **Option 2: Use Full Cloud Build with Secrets**

This option is more secure and uses Google Cloud Secret Manager.

**Step 1:** Create secrets in Google Cloud
```bash
# Create SESSION_SECRET
echo -n "rideshare-secret-2026-$(openssl rand -hex 16)" | \
  gcloud secrets create rideshare-session-secret --data-file=-

# Create DATABASE_URL (if using external database)
echo -n "your-database-url-here" | \
  gcloud secrets create rideshare-database-url --data-file=-
```

**Step 2:** Grant Cloud Run access to secrets
```bash
PROJECT_ID=$(gcloud config get-value project)
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")

gcloud secrets add-iam-policy-binding rideshare-session-secret \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding rideshare-database-url \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

**Step 3:** Use the full cloudbuild.yaml
```bash
cd /vercel/sandbox
# The cloudbuild.yaml is already configured
git add cloudbuild.yaml
git commit -m "fix: use proper Cloud Build configuration with secrets"
git push origin main
```

**Step 4:** Deploy with Blackbox
```bash
blackbox deploy
```

---

### **Option 3: Deploy to Alternative Platforms**

If Cloud Build continues to have issues, use these alternatives:

#### **A. Render.com (Easiest, Free)**
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Select `hyper1hu/ride-share-hub`
5. Configure:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `node dist/index.js`
   - **Environment:** Add `SESSION_SECRET=rideshare-secret-2026`
6. Click "Create Web Service"
7. Wait 3-5 minutes
8. Done! Your API is live

#### **B. Railway.app (Fast, Free)**
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select `hyper1hu/ride-share-hub`
5. Railway auto-detects the `railway.json` config
6. Add environment variable: `SESSION_SECRET=rideshare-secret-2026`
7. Deploy automatically starts
8. Done! Get your URL from the dashboard

#### **C. Fly.io (Global Edge Network)**
```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Launch app
cd /vercel/sandbox
fly launch --name rideshare-hub --region ord

# Set secrets
fly secrets set SESSION_SECRET=rideshare-secret-2026

# Deploy
fly deploy
```

---

## 🔧 Configuration Files Created

### **1. cloudbuild.yaml** (Full version with secrets)
- Uses Google Cloud Secret Manager
- More secure for production
- Requires secret setup

### **2. cloudbuild-simple.yaml** (Simplified version)
- Uses environment variables
- Easier to set up
- Good for testing

### **3. Dockerfile** (Already exists)
- Multi-stage build
- Optimized for production
- Uses Node 22 Alpine

### **4. railway.json** (Already exists)
- Railway.app configuration
- Auto-detected by Railway

### **5. Procfile** (Check if exists)
- Heroku/Render configuration
- Simple start command

---

## 🧪 Testing Your Deployment

After deployment, test these endpoints:

```bash
# Replace YOUR_URL with your deployed URL

# Health check
curl https://YOUR_URL/health

# API health
curl https://YOUR_URL/api/health

# Locations
curl https://YOUR_URL/api/locations/popular

# Vehicle types
curl https://YOUR_URL/api/vehicle-types
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-28T...",
  "service": "RideShare API",
  "version": "1.0.0"
}
```

---

## 📱 Update Flutter App

After successful deployment, update your Flutter app:

**File:** `flutter_rideshare/lib/config/api_config.dart`

```dart
class ApiConfig {
  // Replace with your deployed URL
  static const String baseUrl = 'https://rideshare-hub-xxxxx.run.app';
  
  // Or for Render
  // static const String baseUrl = 'https://rideshare-hub-api.onrender.com';
  
  // Or for Railway
  // static const String baseUrl = 'https://rideshare-hub.up.railway.app';
}
```

Then rebuild your APK:
```bash
cd flutter_rideshare
flutter build apk --release
```

---

## 🐛 Troubleshooting

### **Issue: "START_CMD is not a valid built-in substitution"**
**Solution:** Use the simplified `cloudbuild-simple.yaml` or the fixed `cloudbuild.yaml`

### **Issue: "Permission denied to access secrets"**
**Solution:** Grant IAM permissions (see Option 2, Step 2)

### **Issue: "Build timeout"**
**Solution:** Increase timeout in cloudbuild.yaml (already set to 1200s)

### **Issue: "Out of memory during build"**
**Solution:** Increase machine type in cloudbuild.yaml (already set to E2_HIGHCPU_8)

### **Issue: "Cloud Run deployment failed"**
**Solution:** Check Cloud Run logs:
```bash
gcloud run services logs read rideshare-hub --region=us-central1
```

---

## ✅ Deployment Checklist

- [x] Fixed Cloud Build configuration error
- [x] Created `cloudbuild.yaml` (full version)
- [x] Created `cloudbuild-simple.yaml` (simplified)
- [x] Dockerfile is production-ready
- [ ] Choose deployment option (1, 2, or 3)
- [ ] Commit and push changes to GitHub
- [ ] Deploy using chosen method
- [ ] Test all API endpoints
- [ ] Update Flutter app with new URL
- [ ] Rebuild Flutter APK
- [ ] Test mobile app with live API

---

## 🎉 Success Criteria

Your deployment is successful when:

1. ✅ Build completes without errors
2. ✅ Cloud Run service is running
3. ✅ Health endpoint returns 200 OK
4. ✅ API endpoints return valid JSON
5. ✅ Flutter app connects successfully
6. ✅ Users can register and login
7. ✅ Bookings work end-to-end

---

## 📚 Additional Resources

- **Google Cloud Build Docs:** https://cloud.google.com/build/docs
- **Cloud Run Docs:** https://cloud.google.com/run/docs
- **Render Docs:** https://render.com/docs
- **Railway Docs:** https://docs.railway.app
- **Fly.io Docs:** https://fly.io/docs

---

## 🆘 Need Help?

If you continue to face issues:

1. **Check build logs:**
   ```bash
   gcloud builds list --limit=5
   gcloud builds log BUILD_ID
   ```

2. **Check Cloud Run logs:**
   ```bash
   gcloud run services logs read rideshare-hub --region=us-central1 --limit=50
   ```

3. **Use alternative platform:** Render.com or Railway.app (both are easier and free)

---

**🚀 Your RideShare Hub is ready to deploy! Choose your preferred option and follow the steps above.**

**Recommended:** Start with **Option 1 (Simplified Cloud Build)** or **Option 3A (Render.com)** for the fastest deployment.
