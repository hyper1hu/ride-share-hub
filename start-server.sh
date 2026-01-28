#!/bin/bash

# RideShare Hub - Production Server Startup Script
# This script starts the server on Blackbox infrastructure

echo "=========================================="
echo "RideShare Hub - Starting Production Server"
echo "=========================================="
echo ""

# Set environment variables
export NODE_ENV=production
export PORT=5000
export HOST=0.0.0.0

# Check if build exists
if [ ! -f "dist/index.cjs" ]; then
    echo "❌ Build not found. Running build first..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Build failed. Exiting."
        exit 1
    fi
fi

echo "✅ Build found"
echo ""
echo "Starting server..."
echo "  - Environment: $NODE_ENV"
echo "  - Port: $PORT"
echo "  - Host: $HOST"
echo ""

# Start the server
node dist/index.cjs

# If server exits, show error
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Server exited with error"
    exit 1
fi
