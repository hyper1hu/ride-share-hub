# RideShare Hub - Deployment Guide

## 🚀 Blackbox Deploy Configuration

This repository is configured for deployment on **Blackbox Deploy** with **2 CPU and 512MB memory**.

### ✅ Configuration Files

- **`cloudbuild.yaml`** - Google Cloud Build configuration (minimal, no custom substitutions)
- **`Dockerfile`** - Multi-stage Docker build for production
- **`docker-compose.yml`** - Local development with Docker

### 📋 Cloud Build Configuration

The `cloudbuild.yaml` file uses **ONLY valid Google Cloud Build built-in substitutions**:

- `$PROJECT_ID` - Your GCP project ID
- `$COMMIT_SHA` - Git commit SHA
- `$BUILD_ID` - Cloud Build ID

**NO custom substitutions** like `$START_CMD`, `$PORT`, etc. are used.

### 🔧 Deployment Steps

#### Option 1: Blackbox Deploy (Recommended)

1. **Push to GitHub**
   ```bash
   git add -A
   git commit -m "Deploy to Blackbox"
   git push origin main
   ```

2. **Go to Blackbox Deploy Dashboard**
   - Visit: https://cloud.blackbox.ai/deployments
   - Click "Deploy" or "Redeploy"
   - Select repository: `hyper1hu/ride-share-hub`
   - Branch: `main`
   - Region: `us-central1`

3. **Wait for Deployment**
   - Build time: ~3-5 minutes
   - Cloud Build will execute all steps in `cloudbuild.yaml`
   - Docker image will be built and pushed to GCR
   - Application will be deployed to Cloud Run

4. **Access Your API**
   - You'll receive a deployment URL
   - Test: `https://YOUR_URL/health`
   - API: `https://YOUR_URL/api/health`

#### Option 2: Manual Docker Build

```bash
# Build the Docker image
docker build -t rideshare-hub .

# Run locally
docker run -p 5000:5000 \
  -e NODE_ENV=production \
  -e PORT=5000 \
  -e SESSION_SECRET=your-secret-here \
  rideshare-hub

# Test
curl http://localhost:5000/health
```

#### Option 3: Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 🔍 Troubleshooting

#### Error: "START_CMD is not a valid built-in substitution"

**Cause:** Cloud Build is trying to use a custom substitution variable that doesn't exist.

**Solution:** 
- The `cloudbuild.yaml` in this repository does NOT use any custom substitutions
- Make sure you're deploying from the latest commit
- Clear any cached configurations in Blackbox Deploy
- Click "Sync" to pull latest changes from GitHub

#### Build Fails

1. **Check build logs** in GCP Console
2. **Verify dependencies** are installed: `npm ci`
3. **Test build locally**: `npm run build`
4. **Check Dockerfile** syntax

#### Deployment Fails

1. **Verify Cloud Run permissions** in GCP
2. **Check environment variables** are set
3. **Verify port** is set to 5000
4. **Check memory/CPU** limits (512Mi, 2 CPU)

### 📊 Resource Configuration

- **Memory:** 512Mi
- **CPU:** 2 cores
- **Port:** 5000
- **Platform:** Cloud Run (managed)
- **Region:** us-central1
- **Authentication:** Public (unauthenticated)

### 🔐 Environment Variables

Required environment variables for production:

```bash
NODE_ENV=production
PORT=5000
SESSION_SECRET=your-secure-secret-here
```

Optional (for Firebase):
```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY=your-private-key
```

### ✅ Verification

After deployment, test these endpoints:

```bash
# Health check
curl https://YOUR_URL/health

# API health
curl https://YOUR_URL/api/health

# Locations
curl https://YOUR_URL/api/locations/popular

# Vehicle types
curl https://YOUR_URL/api/vehicle-types
```

### 📱 Mobile App Integration

Update your Flutter app configuration:

```dart
// lib/config/api_config.dart
class ApiConfig {
  static const String baseUrl = 'https://YOUR_DEPLOYMENT_URL';
}
```

Then rebuild your APK:
```bash
flutter build apk --release
```

### 🎯 Next Steps

1. ✅ Deploy to Blackbox
2. ✅ Test all API endpoints
3. ✅ Update Flutter app URL
4. ✅ Build and test mobile app
5. ✅ Monitor logs and performance

### 📚 Additional Resources

- [Google Cloud Build Documentation](https://cloud.google.com/build/docs)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Docker Documentation](https://docs.docker.com/)

---

**Repository:** https://github.com/hyper1hu/ride-share-hub

**Status:** ✅ Ready for deployment

**Last Updated:** January 28, 2026
