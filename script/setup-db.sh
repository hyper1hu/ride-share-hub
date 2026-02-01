#!/bin/bash

# Chaloo Ride - Database Setup Script
# This script sets up the PostgreSQL database for the application

set -e

echo "🚀 Chaloo Ride - Database Setup"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ Created .env file. Please update it with your database credentials.${NC}"
    echo ""
    echo "Edit the .env file and update:"
    echo "  - DATABASE_URL with your PostgreSQL connection string"
    echo "  - SESSION_SECRET with a secure random string"
    echo ""
    echo "Then run this script again."
    exit 1
fi

# Load environment variables
source .env

echo "📋 Configuration:"
echo "  - NODE_ENV: ${NODE_ENV:-development}"
echo "  - PORT: ${PORT:-5000}"
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ DATABASE_URL is not set in .env file${NC}"
    exit 1
fi

# Extract database name from DATABASE_URL
DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')
echo "📊 Database: $DB_NAME"
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}⚠️  PostgreSQL client (psql) not found.${NC}"
    echo "Please install PostgreSQL or ensure it's in your PATH."
    echo ""
    echo "Installation instructions:"
    echo "  - Ubuntu/Debian: sudo apt-get install postgresql-client"
    echo "  - macOS: brew install postgresql"
    echo "  - Windows: Download from https://www.postgresql.org/download/"
    echo ""
    echo "Alternatively, you can use a cloud PostgreSQL service:"
    echo "  - Neon: https://neon.tech (Free tier available)"
    echo "  - Supabase: https://supabase.com (Free tier available)"
    echo "  - Railway: https://railway.app (Free tier available)"
    echo "  - ElephantSQL: https://www.elephantsql.com (Free tier available)"
    echo ""
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo -e "${GREEN}✅ Dependencies installed${NC}"
    echo ""
fi

# Run database migrations
echo "🔄 Running database migrations..."
npm run db:push

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database migrations completed successfully${NC}"
else
    echo -e "${RED}❌ Database migrations failed${NC}"
    echo "Please check your DATABASE_URL and ensure PostgreSQL is running."
    exit 1
fi

echo ""
echo "🌱 Seeding database with initial data..."
npm run db:seed

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database seeded successfully${NC}"
else
    echo -e "${YELLOW}⚠️  Database seeding failed or already seeded${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Database setup complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Start the development server: npm run dev"
echo "  2. Access the application at: http://localhost:${PORT:-5000}"
echo "  3. Default admin credentials:"
echo "     - Username: admin"
echo "     - Password: admin123"
echo ""
echo "For production deployment, see DEPLOYMENT_GUIDE.md"
