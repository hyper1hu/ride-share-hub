# 🚀 Complete Deployment Guide - RideShare Hub

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Database Setup](#database-setup)
3. [Deployment Options](#deployment-options)
4. [Docker Deployment](#docker-deployment)
5. [Environment Configuration](#environment-configuration)
6. [Production Checklist](#production-checklist)
7. [Monitoring & Maintenance](#monitoring--maintenance)

---

## 🎯 Quick Start

### Prerequisites

- Node.js 22+ installed
- PostgreSQL database (local or cloud)
- Git installed
- npm or yarn package manager

### Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/hyper1hu/ride-share-hub.git
cd ride-share-hub

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# 4. Set up database
chmod +x scripts/setup-db.sh
./scripts/setup-db.sh

# 5. Start development server
npm run dev
```

Access the application at: http://localhost:5000

---

## 🗄️ Database Setup

### Option 1: Local PostgreSQL

**Install PostgreSQL:**

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# macOS
brew install postgresql@16
brew services start postgresql@16

# Windows
# Download from: https://www.postgresql.org/download/windows/
```

**Create Database:**

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE rideshare;

# Create user (optional)
CREATE USER rideshare_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE rideshare TO rideshare_user;

# Exit
\q
```

**Update .env:**

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/rideshare
```

### Option 2: Cloud PostgreSQL (Recommended for Production)

#### Neon (Free Tier - Recommended)

1. Go to https://neon.tech
2. Sign up with GitHub
3. Create a new project
4. Copy the connection string
5. Update `.env` with the connection string

**Advantages:**
- ✅ Free tier with 0.5GB storage
- ✅ Serverless (auto-scaling)
- ✅ Instant setup
- ✅ Built-in connection pooling

#### Supabase (Free Tier)

1. Go to https://supabase.com
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (URI format)
5. Update `.env`

**Advantages:**
- ✅ Free tier with 500MB storage
- ✅ Built-in authentication
- ✅ Real-time subscriptions
- ✅ Auto-generated APIs

#### Railway (Free $5 Credit)

1. Go to https://railway.app
2. Create new project
3. Add PostgreSQL service
4. Copy the DATABASE_URL
5. Update `.env`

**Advantages:**
- ✅ $5 free credit monthly
- ✅ Easy deployment
- ✅ Automatic backups
- ✅ Great for full-stack apps

#### ElephantSQL (Free Tier)

1. Go to https://www.elephantsql.com
2. Create a new instance (Tiny Turtle - Free)
3. Copy the URL
4. Update `.env`

**Advantages:**
- ✅ Free tier with 20MB storage
- ✅ Good for testing
- ✅ Simple setup

### Run Database Migrations

```bash
# Push schema to database
npm run db:push

# Seed initial data (admin user, sample vehicles, locations)
npm run db:seed
```

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

---

## 🌐 Deployment Options

### Option 1: Railway (Easiest - Recommended)

**Step 1: Install Railway CLI**

```bash
npm install -g @railway/cli
```

**Step 2: Login**

```bash
railway login
```

**Step 3: Initialize Project**

```bash
railway init
```

**Step 4: Add PostgreSQL**

```bash
railway add postgresql
```

**Step 5: Set Environment Variables**

```bash
railway variables set SESSION_SECRET=$(openssl rand -base64 32)
```

**Step 6: Deploy**

```bash
railway up
```

**Step 7: Get URL**

```bash
railway open
```

**Cost:** $5 free credit/month, then pay-as-you-go

---

### Option 2: Render.com (Free Tier Available)

**Step 1: Push to GitHub**

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

**Step 2: Create Web Service**

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** rideshare-hub
   - **Environment:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** Free

**Step 3: Add PostgreSQL Database**

1. Click "New +" → "PostgreSQL"
2. Name: rideshare-db
3. Copy the Internal Database URL

**Step 4: Add Environment Variables**

In your web service settings:
- `DATABASE_URL` = (paste internal database URL)
- `SESSION_SECRET` = (generate random string)
- `NODE_ENV` = production

**Step 5: Deploy**

Click "Create Web Service" and wait 5-10 minutes.

**Cost:** Free tier available (spins down after 15 min inactivity)

---

### Option 3: Heroku

**Step 1: Install Heroku CLI**

```bash
# macOS
brew tap heroku/brew && brew install heroku

# Ubuntu/Debian
curl https://cli-assets.heroku.com/install.sh | sh

# Windows
# Download from: https://devcenter.heroku.com/articles/heroku-cli
```

**Step 2: Login**

```bash
heroku login
```

**Step 3: Create App**

```bash
heroku create rideshare-hub
```

**Step 4: Add PostgreSQL**

```bash
heroku addons:create heroku-postgresql:mini
```

**Step 5: Set Environment Variables**

```bash
heroku config:set SESSION_SECRET=$(openssl rand -base64 32)
heroku config:set NODE_ENV=production
```

**Step 6: Deploy**

```bash
git push heroku main
```

**Step 7: Run Migrations**

```bash
heroku run npm run db:push
heroku run npm run db:seed
```

**Step 8: Open App**

```bash
heroku open
```

**Cost:** $5-7/month for basic dyno

---

### Option 4: DigitalOcean App Platform

**Step 1: Push to GitHub**

```bash
git push origin main
```

**Step 2: Create App**

1. Go to https://cloud.digitalocean.com/apps
2. Click "Create App"
3. Connect GitHub repository
4. Configure:
   - **Build Command:** `npm install && npm run build`
   - **Run Command:** `npm start`
   - **HTTP Port:** 5000

**Step 3: Add Database**

1. Add PostgreSQL database component
2. Copy connection string

**Step 4: Add Environment Variables**

- `DATABASE_URL` = (database connection string)
- `SESSION_SECRET` = (random string)
- `NODE_ENV` = production

**Step 5: Deploy**

Click "Create Resources"

**Cost:** $5/month for basic app + $15/month for database

---

### Option 5: AWS (Advanced)

#### EC2 Deployment

**Step 1: Launch EC2 Instance**

1. Go to AWS Console → EC2
2. Launch instance (Ubuntu 22.04 LTS)
3. Instance type: t2.micro (free tier)
4. Configure security group:
   - SSH (22) - Your IP
   - HTTP (80) - Anywhere
   - HTTPS (443) - Anywhere
   - Custom TCP (5000) - Anywhere

**Step 2: Connect to Instance**

```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

**Step 3: Install Dependencies**

```bash
# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# Install Git
sudo apt-get install -y git

# Install PM2 (process manager)
sudo npm install -g pm2
```

**Step 4: Set Up PostgreSQL**

```bash
sudo -u postgres psql
CREATE DATABASE rideshare;
CREATE USER rideshare_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE rideshare TO rideshare_user;
\q
```

**Step 5: Clone and Deploy**

```bash
# Clone repository
git clone https://github.com/hyper1hu/ride-share-hub.git
cd ride-share-hub

# Install dependencies
npm install

# Create .env file
nano .env
# Add your configuration

# Build application
npm run build

# Run migrations
npm run db:push
npm run db:seed

# Start with PM2
pm2 start npm --name rideshare-hub -- start
pm2 save
pm2 startup
```

**Step 6: Set Up Nginx (Optional)**

```bash
sudo apt-get install -y nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/rideshare
```

Add:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/rideshare /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**Cost:** Free tier for 12 months, then ~$5-10/month

---

## 🐳 Docker Deployment

### Local Docker Setup

**Step 1: Install Docker**

- **macOS/Windows:** Download Docker Desktop from https://www.docker.com/products/docker-desktop
- **Linux:** 
  ```bash
  curl -fsSL https://get.docker.com -o get-docker.sh
  sudo sh get-docker.sh
  ```

**Step 2: Build and Run**

```bash
# Build image
docker build -t rideshare-hub .

# Run container
docker run -d \
  -p 5000:5000 \
  -e DATABASE_URL="your_database_url" \
  -e SESSION_SECRET="your_secret" \
  --name rideshare-hub \
  rideshare-hub
```

### Docker Compose (Recommended)

**Step 1: Create .env file**

```bash
cp .env.example .env
# Edit .env with your configuration
```

**Step 2: Start Services**

```bash
# Start all services (app + database)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Step 3: Run Migrations**

```bash
# Run migrations
docker-compose exec app npm run db:push

# Seed database
docker-compose exec app npm run db:seed
```

**Access:**
- Application: http://localhost:5000
- pgAdmin: http://localhost:5050 (optional, use `--profile tools`)

**Start with pgAdmin:**

```bash
docker-compose --profile tools up -d
```

### Deploy to Cloud with Docker

#### AWS ECS/Fargate

```bash
# Build and tag image
docker build -t rideshare-hub .
docker tag rideshare-hub:latest your-ecr-repo/rideshare-hub:latest

# Push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-ecr-repo
docker push your-ecr-repo/rideshare-hub:latest

# Deploy to ECS (use AWS Console or CLI)
```

#### Google Cloud Run

```bash
# Build and push
gcloud builds submit --tag gcr.io/your-project/rideshare-hub

# Deploy
gcloud run deploy rideshare-hub \
  --image gcr.io/your-project/rideshare-hub \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## ⚙️ Environment Configuration

### Required Environment Variables

```env
# Database (REQUIRED)
DATABASE_URL=postgresql://user:password@host:port/database

# Session (REQUIRED)
SESSION_SECRET=your-secure-random-string-here

# Application
NODE_ENV=production
PORT=5000
```

### Optional Environment Variables

```env
# SMS Service (Twilio)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# SMS Service (AWS SNS)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_SNS_SENDER_ID=RideShareHub

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads

# CORS
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/app.log
```

### Generate Secure SESSION_SECRET

```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Using Python
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

## ✅ Production Checklist

### Before Deployment

- [ ] All tests passing (`npm run check`)
- [ ] Build successful (`npm run build`)
- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] SESSION_SECRET is secure and random
- [ ] CORS configured for production domains
- [ ] Rate limiting enabled
- [ ] File upload limits set
- [ ] Error logging configured

### Security

- [ ] Use HTTPS in production
- [ ] Set secure SESSION_SECRET
- [ ] Enable CORS only for trusted domains
- [ ] Implement rate limiting
- [ ] Sanitize user inputs
- [ ] Use prepared statements (already done with Drizzle)
- [ ] Keep dependencies updated
- [ ] Set up security headers
- [ ] Enable audit logging
- [ ] Implement OTP expiration

### Performance

- [ ] Enable gzip compression
- [ ] Set up CDN for static assets
- [ ] Implement caching
- [ ] Optimize database queries
- [ ] Set up connection pooling
- [ ] Monitor memory usage
- [ ] Set up auto-scaling (if needed)

### Monitoring

- [ ] Set up error tracking (Sentry, Rollbar)
- [ ] Configure logging (Winston, Pino)
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Monitor database performance
- [ ] Set up alerts for errors
- [ ] Track API response times
- [ ] Monitor resource usage

---

## 📊 Monitoring & Maintenance

### Logging

The application uses console logging by default. For production, consider:

**Winston:**

```bash
npm install winston
```

**Sentry (Error Tracking):**

```bash
npm install @sentry/node
```

### Uptime Monitoring

**Free Options:**
- UptimeRobot: https://uptimerobot.com (50 monitors free)
- Pingdom: https://www.pingdom.com (free tier)
- Better Uptime: https://betteruptime.com (free tier)

### Database Backups

**Automated Backups:**

```bash
# Create backup script
cat > scripts/backup-db.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backups/backup_$DATE.sql
# Keep only last 7 days
find backups/ -name "backup_*.sql" -mtime +7 -delete
EOF

chmod +x scripts/backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /path/to/scripts/backup-db.sh
```

### Performance Monitoring

**PM2 Monitoring (if using PM2):**

```bash
pm2 monit
pm2 logs rideshare-hub
pm2 status
```

### Health Checks

The application includes a health check endpoint:

```bash
curl http://localhost:5000/api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-01-27T15:00:00.000Z"
}
```

---

## 🔧 Troubleshooting

### Common Issues

**1. Database Connection Failed**

```bash
# Check DATABASE_URL format
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL

# Check if PostgreSQL is running
sudo systemctl status postgresql
```

**2. Build Fails**

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

**3. Port Already in Use**

```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3000 npm start
```

**4. OTP Not Sending**

- Check SMS service configuration
- Verify API credentials
- Check rate limiting
- Review audit logs

**5. Session Issues**

- Ensure SESSION_SECRET is set
- Check cookie settings
- Verify CORS configuration

---

## 📱 Mobile App Configuration

### Update API URL in Flutter App

**File:** `flutter_rideshare/lib/main.dart`

```dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Update this URL to your production API
  ApiService.setBaseUrl('https://your-api-url.com');
  
  await NotificationService().initialize();
  runApp(const RideShareApp());
}
```

### Build Production APK

```bash
cd flutter_rideshare
flutter build apk --release
```

APK location: `build/app/outputs/flutter-apk/app-release.apk`

---

## 💰 Cost Comparison

| Platform | Free Tier | Paid Tier | Database | Best For |
|----------|-----------|-----------|----------|----------|
| **Railway** | $5 credit/month | Pay-as-you-go | Included | Full-stack apps |
| **Render** | Yes (with limits) | $7/month | $7/month | Simple deployments |
| **Heroku** | No | $7/month | $5/month | Quick prototypes |
| **DigitalOcean** | $200 credit (60 days) | $5/month | $15/month | Scalable apps |
| **AWS EC2** | 12 months free | $5-10/month | Separate | Full control |
| **Vercel** | Yes | $20/month | Separate | Serverless |

---

## 🎯 Recommended Setup

### For Development/Testing
- **Database:** Neon (free tier)
- **Hosting:** Render (free tier)
- **Cost:** $0/month

### For Small Production
- **Database:** Railway PostgreSQL
- **Hosting:** Railway
- **Cost:** ~$5-10/month

### For Medium Production
- **Database:** Supabase or Railway
- **Hosting:** Render or DigitalOcean
- **Monitoring:** Sentry (free tier)
- **Cost:** ~$15-25/month

### For Large Production
- **Database:** AWS RDS or managed PostgreSQL
- **Hosting:** AWS ECS/Fargate or Kubernetes
- **CDN:** CloudFlare
- **Monitoring:** Datadog or New Relic
- **Cost:** $50-200+/month

---

## 📚 Additional Resources

- **Node.js Best Practices:** https://github.com/goldbergyoni/nodebestpractices
- **PostgreSQL Documentation:** https://www.postgresql.org/docs/
- **Docker Documentation:** https://docs.docker.com/
- **Railway Docs:** https://docs.railway.app/
- **Render Docs:** https://render.com/docs/
- **Heroku Docs:** https://devcenter.heroku.com/

---

## 🆘 Support

For issues or questions:

1. Check the logs first
2. Review this deployment guide
3. Check platform-specific documentation
4. Review GitHub issues
5. Contact support

---

## 🎉 Success!

Once deployed, your RideShare Hub application will be accessible at your production URL. Don't forget to:

1. Update the Flutter app with the production API URL
2. Rebuild and distribute the mobile app
3. Set up monitoring and alerts
4. Configure automated backups
5. Test all features in production

**Happy Deploying! 🚀**
