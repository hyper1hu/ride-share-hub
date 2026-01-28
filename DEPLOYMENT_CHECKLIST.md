# 🚀 RideShare Hub - Deployment Checklist

## ✅ Issue Fixed: Cloud Build Configuration Error

### **Previous Error:**
```
Error: Build failed: Cloud Build configuration error: 
{ "error": { "code": 400, "message": "generic::invalid_argument: 
invalid value for 'build.substitutions': key in the template 
\"START_CMD\" is not a valid built-in substitution", 
"status": "INVALID_ARGUMENT" } }
```

### **Root Cause:**
- Missing `cloudbuild.yaml` file in repository
- Blackbox Deploy was using a default configuration with invalid custom substitutions
- The `START_CMD` variable is not a valid Google Cloud Build built-in substitution

### **Solution Implemented:**
✅ Created proper `cloudbuild.yaml` with ONLY valid GCP substitutions
✅ Fixed Dockerfile CMD from `dist/index.js` → `dist/index.cjs`
✅ Added `.gcloudignore` to optimize build uploads
✅ Configured for 2 CPU and 512MB memory as requested

---

## 📋 Deployment Checklist

### **1. Pre-Deployment Verification**
- [x] `cloudbuild.yaml` created with valid substitutions
- [x] Dockerfile fixed to use correct output file
- [x] Build successful locally (`npm run build`)
- [x] All files committed to GitHub

### **2. Valid Google Cloud Build Substitutions Used**
The `cloudbuild.yaml` now uses ONLY these valid built-in substitutions:
- ✅ `$PROJECT_ID` - Your GCP project ID
- ✅ `$COMMIT_SHA` - Git commit SHA
- ✅ `$BUILD_ID` - Cloud Build ID
- ✅ `$REPO_NAME` - Repository name
- ✅ `$BRANCH_NAME` - Git branch name

**NO custom substitutions** like `$START_CMD`, `$PORT`, etc.

### **3. Deployment Configuration**
```yaml
# Cloud Run Configuration (in cloudbuild.yaml)
- Memory: 512Mi (512MB as requested)
- CPU: 2 (as requested)
- Port: 5000
- Region: us-central1
- Platform: managed
- Allow unauthenticated: yes
```

### **4. Files Created/Modified**

| File | Status | Purpose |
|------|--------|---------|
| `cloudbuild.yaml` | ✅ Created | Cloud Build configuration |
| `Dockerfile` | ✅ Fixed | Docker container configuration |
| `.gcloudignore` | ✅ Created | Optimize build uploads |
| `DEPLOYMENT_CHECKLIST.md` | ✅ Created | This file |

---

## 🚀 How to Deploy Now

### **Option 1: Blackbox Deploy (Recommended)**

1. **Go to Blackbox Deploy Dashboard**
   - URL: https://cloud.blackbox.ai/deployments

2. **Click "Redeploy"** on your failed build
   - Blackbox will detect the new `cloudbuild.yaml`
   - Build should succeed this time

3. **Monitor the Build**
   - Watch the build logs
   - Should complete in 3-5 minutes

4. **Test the Deployment**
   ```bash
   # Replace YOUR_URL with the deployed URL
   curl https://YOUR_URL/health
   curl https://YOUR_URL/api/health
   ```

### **Option 2: Manual Google Cloud Build**

If Blackbox Deploy still has issues, deploy manually:

```bash
# 1. Install Google Cloud SDK
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# 2. Initialize and login
gcloud init
gcloud auth login

# 3. Set your project
gcloud config set project YOUR_PROJECT_ID

# 4. Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# 5. Submit the build
gcloud builds submit --config cloudbuild.yaml .

# 6. Get the deployed URL
gcloud run services describe rideshare-hub --region us-central1 --format 'value(status.url)'
```

### **Option 3: Alternative Platforms (If Blackbox Deploy Fails)**

#### **A. Render.com (Easiest, 3 minutes)**
1. Go to https://render.com
2. Sign up with GitHub
3. New Web Service → Select `hyper1hu/ride-share-hub`
4. Settings:
   - Build: `npm install && npm run build`
   - Start: `node dist/index.cjs`
   - Env: `SESSION_SECRET=rideshare-secret-2026`
5. Click "Create Web Service"

#### **B. Railway.app (Fastest, 2 minutes)**
1. Go to https://railway.app
2. Sign up with GitHub
3. New Project → Deploy from GitHub
4. Select `hyper1hu/ride-share-hub`
5. Add env: `SESSION_SECRET=rideshare-secret-2026`
6. Deploy automatically

#### **C. Fly.io (Global Edge)**
```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Launch app
fly launch --name rideshare-hub

# Deploy
fly deploy
```

---

## 🧪 Post-Deployment Testing

### **1. Health Check**
```bash
curl https://YOUR_URL/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-28T...",
  "service": "RideShare API",
  "version": "1.0.0"
}
```

### **2. API Health Check**
```bash
curl https://YOUR_URL/api/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-28T...",
  "database": "connected",
  "uptime": 123
}
```

### **3. Test Locations Endpoint**
```bash
curl https://YOUR_URL/api/locations/popular
```

**Expected:** JSON array with popular locations

### **4. Test Vehicle Types**
```bash
curl https://YOUR_URL/api/vehicle-types
```

**Expected:** JSON array with 22 vehicle types

---

## 📱 Update Flutter App

Once deployed, update your Flutter app:

**File:** `flutter_rideshare/lib/config/api_config.dart`

```dart
class ApiConfig {
  // Replace with your deployed URL
  static const String baseUrl = 'https://YOUR_DEPLOYED_URL';
  
  // API endpoints
  static const String authEndpoint = '$baseUrl/api/auth';
  static const String locationsEndpoint = '$baseUrl/api/locations';
  static const String vehiclesEndpoint = '$baseUrl/api/vehicle-types';
  static const String bookingsEndpoint = '$baseUrl/api/bookings';
}
```

**Build APK:**
```bash
cd flutter_rideshare
flutter build apk --release
```

**APK Location:** `build/app/outputs/flutter-apk/app-release.apk`

---

## 🔍 Troubleshooting

### **If Build Still Fails:**

1. **Check Cloud Build Logs**
   - Go to GCP Console → Cloud Build → History
   - Click on the failed build
   - Review detailed logs

2. **Verify Substitutions**
   - Ensure `cloudbuild.yaml` uses ONLY valid built-ins
   - No custom variables like `$START_CMD`, `$PORT`, etc.

3. **Check Dockerfile**
   - Verify CMD uses `dist/index.cjs` (not `dist/index.js`)
   - Ensure all COPY paths are correct

4. **Verify Build Output**
   ```bash
   npm run build
   ls -la dist/
   # Should show: index.cjs
   ```

### **Common Issues:**

| Issue | Solution |
|-------|----------|
| "START_CMD not valid" | Use the new `cloudbuild.yaml` (no custom substitutions) |
| "index.js not found" | Dockerfile now uses `dist/index.cjs` |
| "Build timeout" | Increase timeout in `cloudbuild.yaml` (currently 1200s) |
| "Memory limit" | Configured for 512MB as requested |
| "CPU limit" | Configured for 2 CPU as requested |

---

## ✅ Verification Checklist

Before considering deployment complete:

- [ ] Build succeeds without errors
- [ ] Health endpoint returns 200 OK
- [ ] API health endpoint returns healthy status
- [ ] Locations endpoint returns data
- [ ] Vehicle types endpoint returns 22 types
- [ ] CORS headers present for Flutter app
- [ ] Server responds within 500ms
- [ ] Memory usage under 512MB
- [ ] CPU usage reasonable (< 50% idle)

---

## 📊 Expected Deployment Metrics

### **Build Time:**
- Install dependencies: ~30-60 seconds
- Build application: ~5-10 seconds
- Build Docker image: ~60-90 seconds
- Push to registry: ~30-60 seconds
- Deploy to Cloud Run: ~30-60 seconds
- **Total: 3-5 minutes**

### **Runtime Metrics:**
- Memory: ~100-200MB (well under 512MB limit)
- CPU: ~5-10% idle, ~30-50% under load
- Response time: <100ms for most endpoints
- Cold start: ~2-3 seconds

---

## 🎯 Success Criteria

Your deployment is successful when:

1. ✅ Build completes without errors
2. ✅ Cloud Run service is running
3. ✅ Health checks pass
4. ✅ API endpoints respond correctly
5. ✅ Flutter app can connect
6. ✅ Users can register and login
7. ✅ Bookings work end-to-end

---

## 📚 Additional Resources

- **Repository:** https://github.com/hyper1hu/ride-share-hub
- **Google Cloud Build Docs:** https://cloud.google.com/build/docs
- **Cloud Run Docs:** https://cloud.google.com/run/docs
- **Valid Substitutions:** https://cloud.google.com/build/docs/configuring-builds/substitute-variable-values

---

## 🆘 Need Help?

If deployment still fails after following this checklist:

1. **Check the build logs** in Blackbox Deploy dashboard
2. **Verify all files** are committed to GitHub
3. **Try alternative platforms** (Render.com, Railway.app)
4. **Review error messages** carefully

---

**Last Updated:** January 28, 2026
**Status:** ✅ Ready for Deployment
**Configuration:** 2 CPU, 512MB Memory
**Platform:** Google Cloud Run via Blackbox Deploy
