#!/bin/bash

# RideShare Hub - Deployment and Testing Script
# This script builds, deploys, and tests the application

set -e  # Exit on error

echo "🚀 RideShare Hub - Deployment & Testing Script"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check Prerequisites
echo "📋 Step 1: Checking Prerequisites..."
echo "-----------------------------------"

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js not found. Please install Node.js 18+"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓${NC} npm: $NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm not found"
    exit 1
fi

# Check PostgreSQL client
if command -v psql &> /dev/null; then
    PSQL_VERSION=$(psql --version)
    echo -e "${GREEN}✓${NC} PostgreSQL client: $PSQL_VERSION"
else
    echo -e "${YELLOW}⚠${NC} PostgreSQL client not found (optional)"
fi

echo ""

# Step 2: Install Dependencies
echo "📦 Step 2: Installing Dependencies..."
echo "------------------------------------"
npm install --silent
echo -e "${GREEN}✓${NC} Dependencies installed"
echo ""

# Step 3: Build Application
echo "🔨 Step 3: Building Application..."
echo "---------------------------------"
npm run build
echo -e "${GREEN}✓${NC} Build completed successfully"
echo ""

# Step 4: Check Environment Variables
echo "🔧 Step 4: Checking Environment Configuration..."
echo "-----------------------------------------------"

if [ -f .env ]; then
    echo -e "${GREEN}✓${NC} .env file found"
    
    # Check if DATABASE_URL is set
    if grep -q "DATABASE_URL=" .env; then
        echo -e "${GREEN}✓${NC} DATABASE_URL configured"
    else
        echo -e "${RED}✗${NC} DATABASE_URL not found in .env"
        exit 1
    fi
    
    # Check if SESSION_SECRET is set
    if grep -q "SESSION_SECRET=" .env; then
        echo -e "${GREEN}✓${NC} SESSION_SECRET configured"
    else
        echo -e "${YELLOW}⚠${NC} SESSION_SECRET not found (using default)"
    fi
else
    echo -e "${RED}✗${NC} .env file not found"
    echo "Please create .env file with DATABASE_URL"
    exit 1
fi

echo ""

# Step 5: Database Setup (Optional - requires valid DATABASE_URL)
echo "🗄️  Step 5: Database Setup..."
echo "----------------------------"
echo -e "${YELLOW}⚠${NC} Skipping database setup (requires valid PostgreSQL connection)"
echo "   To setup database manually, run:"
echo "   - npm run db:push    (create tables)"
echo "   - npm run db:seed    (add sample data)"
echo ""

# Step 6: Deployment Options
echo "☁️  Step 6: Deployment Options"
echo "-----------------------------"
echo ""
echo "Your application is built and ready to deploy!"
echo ""
echo "Choose a deployment platform:"
echo ""
echo "1. 🟢 Render.com (Recommended - Free Tier)"
echo "   - Visit: https://render.com"
echo "   - Create Web Service"
echo "   - Connect GitHub or upload code"
echo "   - Set environment variables"
echo "   - Deploy!"
echo ""
echo "2. 🔵 Railway.app"
echo "   - Visit: https://railway.app"
echo "   - Create new project"
echo "   - Add PostgreSQL database"
echo "   - Deploy from GitHub"
echo ""
echo "3. 🟣 Vercel"
echo "   - Run: npm install -g vercel"
echo "   - Run: vercel"
echo "   - Follow prompts"
echo ""
echo "4. 🐳 Docker (Local/Cloud)"
echo "   - Run: docker-compose up -d"
echo "   - Access: http://localhost:5000"
echo ""

# Step 7: Testing (if server is running)
echo "🧪 Step 7: Testing Information"
echo "-----------------------------"
echo ""
echo "To test the application locally:"
echo "1. Ensure PostgreSQL is running"
echo "2. Run: npm run db:push && npm run db:seed"
echo "3. Run: npm run dev"
echo "4. Access: http://localhost:5000"
echo ""
echo "API Endpoints to test:"
echo "- GET  /api/health          - Health check"
echo "- GET  /api/cars            - List vehicles"
echo "- POST /api/auth/customer/register - Register customer"
echo "- POST /api/auth/driver/register   - Register driver"
echo "- POST /api/auth/admin/login       - Admin login"
echo ""

# Step 8: Build Artifacts
echo "📦 Step 8: Build Artifacts"
echo "-------------------------"
echo ""
if [ -d "dist" ]; then
    echo -e "${GREEN}✓${NC} Server build: dist/index.cjs"
    ls -lh dist/index.cjs 2>/dev/null || echo "  (file not found)"
fi

if [ -d "dist/public" ]; then
    echo -e "${GREEN}✓${NC} Client build: dist/public/"
    echo "  Files:"
    ls -lh dist/public/ 2>/dev/null | grep -E '\.(html|css|js)$' || echo "  (no files found)"
fi

echo ""

# Summary
echo "✅ Deployment Preparation Complete!"
echo "=================================="
echo ""
echo "Next Steps:"
echo "1. Choose a deployment platform (see options above)"
echo "2. Set up PostgreSQL database (Neon, Supabase, or Railway)"
echo "3. Configure environment variables on the platform"
echo "4. Deploy the application"
echo "5. Run database migrations: npm run db:push"
echo "6. Seed initial data: npm run db:seed"
echo "7. Test the deployed application"
echo ""
echo "For detailed deployment instructions, see:"
echo "- DEPLOYMENT_GUIDE.md"
echo "- README.md"
echo ""
echo "🎉 Good luck with your deployment!"
