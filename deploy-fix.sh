#!/bin/bash

# RideShare Hub - Deployment Fix Script
# This script fixes the Cloud Build configuration error and prepares for deployment

set -e

echo "🔧 RideShare Hub - Deployment Fix Script"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the project root.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Found package.json${NC}"
echo ""

# Step 1: Show the issue
echo "📋 Issue Fixed:"
echo "   Cloud Build error: 'START_CMD is not a valid built-in substitution'"
echo ""

# Step 2: Check which cloudbuild.yaml to use
echo "🔍 Checking Cloud Build configuration..."
if [ -f "cloudbuild.yaml" ]; then
    echo -e "${GREEN}✅ Found cloudbuild.yaml${NC}"
else
    echo -e "${YELLOW}⚠️  cloudbuild.yaml not found${NC}"
fi

if [ -f "cloudbuild-simple.yaml" ]; then
    echo -e "${GREEN}✅ Found cloudbuild-simple.yaml${NC}"
else
    echo -e "${YELLOW}⚠️  cloudbuild-simple.yaml not found${NC}"
fi
echo ""

# Step 3: Ask user which deployment method they want
echo "🚀 Choose your deployment method:"
echo ""
echo "1. Simplified Cloud Build (Recommended for quick deployment)"
echo "2. Full Cloud Build with Secrets (More secure, requires setup)"
echo "3. Render.com (Easiest, free, no GCP needed)"
echo "4. Railway.app (Fast, free, auto-deploy)"
echo "5. Skip and commit current files"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo ""
        echo -e "${GREEN}📦 Using Simplified Cloud Build${NC}"
        if [ -f "cloudbuild-simple.yaml" ]; then
            cp cloudbuild.yaml cloudbuild-full.yaml 2>/dev/null || true
            cp cloudbuild-simple.yaml cloudbuild.yaml
            echo -e "${GREEN}✅ Configured cloudbuild.yaml for simplified deployment${NC}"
        else
            echo -e "${RED}❌ cloudbuild-simple.yaml not found${NC}"
            exit 1
        fi
        ;;
    2)
        echo ""
        echo -e "${GREEN}🔐 Using Full Cloud Build with Secrets${NC}"
        echo ""
        echo "You'll need to set up secrets in Google Cloud:"
        echo ""
        echo "  gcloud secrets create rideshare-session-secret --data-file=-"
        echo "  gcloud secrets create rideshare-database-url --data-file=-"
        echo ""
        echo "See BLACKBOX_DEPLOY_GUIDE.md for complete instructions"
        ;;
    3)
        echo ""
        echo -e "${GREEN}🌐 Deploying to Render.com${NC}"
        echo ""
        echo "Steps:"
        echo "1. Go to https://render.com"
        echo "2. Sign up with GitHub"
        echo "3. Click 'New +' → 'Web Service'"
        echo "4. Select your repository"
        echo "5. Configure:"
        echo "   - Build: npm install && npm run build"
        echo "   - Start: node dist/index.cjs"
        echo "   - Add env: SESSION_SECRET=rideshare-secret-2026"
        echo ""
        echo "See BLACKBOX_DEPLOY_GUIDE.md for complete instructions"
        exit 0
        ;;
    4)
        echo ""
        echo -e "${GREEN}🚂 Deploying to Railway.app${NC}"
        echo ""
        echo "Steps:"
        echo "1. Go to https://railway.app"
        echo "2. Sign up with GitHub"
        echo "3. Click 'New Project' → 'Deploy from GitHub repo'"
        echo "4. Select your repository"
        echo "5. Add env: SESSION_SECRET=rideshare-secret-2026"
        echo ""
        echo "Railway will auto-detect railway.json and deploy!"
        echo ""
        echo "See BLACKBOX_DEPLOY_GUIDE.md for complete instructions"
        exit 0
        ;;
    5)
        echo ""
        echo -e "${YELLOW}⏭️  Skipping configuration${NC}"
        ;;
    *)
        echo -e "${RED}❌ Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo "📝 Checking git status..."
git status --short

echo ""
echo "💾 Ready to commit changes?"
read -p "Commit and push to GitHub? (y/n): " commit_choice

if [ "$commit_choice" = "y" ] || [ "$commit_choice" = "Y" ]; then
    echo ""
    echo "📤 Committing changes..."
    git add cloudbuild.yaml cloudbuild-simple.yaml cloudbuild-full.yaml BLACKBOX_DEPLOY_GUIDE.md Dockerfile deploy-fix.sh 2>/dev/null || true
    git commit -m "fix: resolve Cloud Build configuration error

- Fixed invalid START_CMD substitution error
- Created proper cloudbuild.yaml with valid GCP substitutions
- Added simplified and full deployment options
- Updated Dockerfile CMD to use correct output file
- Added comprehensive deployment guide" || echo "No changes to commit"
    
    echo ""
    echo "🚀 Pushing to GitHub..."
    git push origin main || git push origin HEAD:main
    
    echo ""
    echo -e "${GREEN}✅ Changes pushed to GitHub!${NC}"
    echo ""
    echo "🎉 Next steps:"
    echo "   1. Run: blackbox deploy"
    echo "   2. Or follow the guide in BLACKBOX_DEPLOY_GUIDE.md"
else
    echo ""
    echo -e "${YELLOW}⏭️  Skipped commit. You can commit manually later.${NC}"
fi

echo ""
echo -e "${GREEN}✅ Deployment fix complete!${NC}"
echo ""
echo "📚 For detailed instructions, see: BLACKBOX_DEPLOY_GUIDE.md"
echo ""
