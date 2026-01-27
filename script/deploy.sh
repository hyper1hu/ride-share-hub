#!/bin/bash

# RideShare Hub - Deployment Script
# This script handles deployment to various platforms

set -e

echo "🚀 RideShare Hub - Deployment Script"
echo "====================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to display menu
show_menu() {
    echo "Select deployment platform:"
    echo "  1) Railway"
    echo "  2) Render"
    echo "  3) Heroku"
    echo "  4) DigitalOcean App Platform"
    echo "  5) AWS (EC2/Elastic Beanstalk)"
    echo "  6) Local Production Build"
    echo "  7) Exit"
    echo ""
}

# Function to check prerequisites
check_prerequisites() {
    echo "🔍 Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js not found${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Node.js $(node --version)${NC}"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm not found${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ npm $(npm --version)${NC}"
    
    # Check Git
    if ! command -v git &> /dev/null; then
        echo -e "${YELLOW}⚠️  Git not found (optional for some deployments)${NC}"
    else
        echo -e "${GREEN}✅ Git $(git --version | cut -d' ' -f3)${NC}"
    fi
    
    echo ""
}

# Function to build the application
build_app() {
    echo "🔨 Building application..."
    npm run build
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Build successful${NC}"
    else
        echo -e "${RED}❌ Build failed${NC}"
        exit 1
    fi
    echo ""
}

# Function to run tests
run_tests() {
    echo "🧪 Running tests..."
    npm run check
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ All checks passed${NC}"
    else
        echo -e "${YELLOW}⚠️  Some checks failed${NC}"
    fi
    echo ""
}

# Railway deployment
deploy_railway() {
    echo -e "${BLUE}🚂 Deploying to Railway...${NC}"
    echo ""
    
    if ! command -v railway &> /dev/null; then
        echo -e "${YELLOW}⚠️  Railway CLI not found${NC}"
        echo "Install it with: npm install -g @railway/cli"
        echo "Or visit: https://docs.railway.app/develop/cli"
        echo ""
        echo "After installation, run:"
        echo "  1. railway login"
        echo "  2. railway init"
        echo "  3. railway up"
        return
    fi
    
    echo "Running: railway up"
    railway up
    
    echo ""
    echo -e "${GREEN}✅ Deployed to Railway${NC}"
    echo "Run 'railway open' to view your deployment"
}

# Render deployment
deploy_render() {
    echo -e "${BLUE}🎨 Deploying to Render...${NC}"
    echo ""
    
    echo "Render deployment steps:"
    echo "  1. Push your code to GitHub"
    echo "  2. Go to https://dashboard.render.com"
    echo "  3. Click 'New +' → 'Web Service'"
    echo "  4. Connect your GitHub repository"
    echo "  5. Configure:"
    echo "     - Build Command: npm install && npm run build"
    echo "     - Start Command: npm start"
    echo "     - Add environment variables from .env.example"
    echo "  6. Click 'Create Web Service'"
    echo ""
    echo "For database:"
    echo "  1. Click 'New +' → 'PostgreSQL'"
    echo "  2. Copy the Internal Database URL"
    echo "  3. Add it as DATABASE_URL in your web service environment variables"
}

# Heroku deployment
deploy_heroku() {
    echo -e "${BLUE}💜 Deploying to Heroku...${NC}"
    echo ""
    
    if ! command -v heroku &> /dev/null; then
        echo -e "${YELLOW}⚠️  Heroku CLI not found${NC}"
        echo "Install it from: https://devcenter.heroku.com/articles/heroku-cli"
        echo ""
        echo "After installation, run:"
        echo "  1. heroku login"
        echo "  2. heroku create rideshare-hub"
        echo "  3. heroku addons:create heroku-postgresql:mini"
        echo "  4. git push heroku main"
        return
    fi
    
    echo "Heroku deployment commands:"
    echo "  heroku create rideshare-hub"
    echo "  heroku addons:create heroku-postgresql:mini"
    echo "  heroku config:set SESSION_SECRET=\$(openssl rand -base64 32)"
    echo "  git push heroku main"
    echo "  heroku open"
}

# DigitalOcean deployment
deploy_digitalocean() {
    echo -e "${BLUE}🌊 Deploying to DigitalOcean App Platform...${NC}"
    echo ""
    
    echo "DigitalOcean App Platform deployment steps:"
    echo "  1. Push your code to GitHub"
    echo "  2. Go to https://cloud.digitalocean.com/apps"
    echo "  3. Click 'Create App'"
    echo "  4. Connect your GitHub repository"
    echo "  5. Configure:"
    echo "     - Build Command: npm install && npm run build"
    echo "     - Run Command: npm start"
    echo "     - HTTP Port: 5000"
    echo "  6. Add a PostgreSQL database"
    echo "  7. Add environment variables from .env.example"
    echo "  8. Click 'Create Resources'"
}

# AWS deployment
deploy_aws() {
    echo -e "${BLUE}☁️  Deploying to AWS...${NC}"
    echo ""
    
    echo "AWS deployment options:"
    echo ""
    echo "Option 1: EC2 Instance"
    echo "  1. Launch an EC2 instance (Ubuntu 22.04 recommended)"
    echo "  2. SSH into the instance"
    echo "  3. Install Node.js, PostgreSQL, and Git"
    echo "  4. Clone your repository"
    echo "  5. Run: ./scripts/setup-db.sh"
    echo "  6. Run: npm start"
    echo "  7. Configure security groups to allow HTTP/HTTPS"
    echo ""
    echo "Option 2: Elastic Beanstalk"
    echo "  1. Install EB CLI: pip install awsebcli"
    echo "  2. Run: eb init"
    echo "  3. Run: eb create rideshare-hub-env"
    echo "  4. Run: eb deploy"
    echo ""
    echo "Option 3: ECS/Fargate (Docker)"
    echo "  1. Build Docker image: docker build -t rideshare-hub ."
    echo "  2. Push to ECR"
    echo "  3. Create ECS task definition"
    echo "  4. Deploy to Fargate"
}

# Local production build
local_production() {
    echo -e "${BLUE}💻 Building for local production...${NC}"
    echo ""
    
    # Set production environment
    export NODE_ENV=production
    
    # Build
    build_app
    
    echo "To run in production mode:"
    echo "  NODE_ENV=production npm start"
    echo ""
    echo "Or use PM2 for process management:"
    echo "  npm install -g pm2"
    echo "  pm2 start npm --name rideshare-hub -- start"
    echo "  pm2 save"
    echo "  pm2 startup"
}

# Main script
main() {
    check_prerequisites
    
    # Run tests before deployment
    run_tests
    
    # Show menu
    show_menu
    read -p "Enter your choice [1-7]: " choice
    
    case $choice in
        1)
            deploy_railway
            ;;
        2)
            deploy_render
            ;;
        3)
            deploy_heroku
            ;;
        4)
            deploy_digitalocean
            ;;
        5)
            deploy_aws
            ;;
        6)
            local_production
            ;;
        7)
            echo "Exiting..."
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid choice${NC}"
            exit 1
            ;;
    esac
    
    echo ""
    echo -e "${GREEN}🎉 Deployment process complete!${NC}"
    echo ""
    echo "Important reminders:"
    echo "  - Set all environment variables from .env.example"
    echo "  - Run database migrations: npm run db:push"
    echo "  - Seed initial data: npm run db:seed"
    echo "  - Update SESSION_SECRET to a secure random string"
    echo "  - Configure SMS service for production OTP"
    echo ""
}

# Run main function
main
