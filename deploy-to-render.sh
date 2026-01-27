#!/bin/bash

# RideShare Hub - Quick Deploy to Render.com
# This script helps you prepare for deployment

echo "🚀 RideShare Hub - Deployment Preparation"
echo "=========================================="
echo ""

# Check if git is configured
echo "✓ Checking Git configuration..."
git config user.name >/dev/null 2>&1 || git config user.name "RideShare Developer"
git config user.email >/dev/null 2>&1 || git config user.email "dev@rideshare.com"

# Ensure we're on main branch
echo "✓ Switching to main branch..."
git checkout -b main 2>/dev/null || git checkout main

# Add all changes
echo "✓ Adding all changes..."
git add -A

# Commit changes
echo "✓ Committing changes..."
git commit -m "chore: prepare for deployment to Render.com" 2>/dev/null || echo "  (no changes to commit)"

# Push to GitHub
echo "✓ Pushing to GitHub..."
git push -u origin main 2>&1 | grep -v "Everything up-to-date" || echo "  Repository updated!"

echo ""
echo "=========================================="
echo "✅ PREPARATION COMPLETE!"
echo "=========================================="
echo ""
echo "📋 NEXT STEPS:"
echo ""
echo "1. Go to: https://render.com"
echo "2. Sign up with GitHub (free)"
echo "3. Click 'New +' → 'Web Service'"
echo "4. Select repository: hyper1hu/ride-share-hub"
echo "5. Configure:"
echo "   - Name: rideshare-hub-api"
echo "   - Environment: Node"
echo "   - Build Command: npm install && npm run build"
echo "   - Start Command: node dist/index.cjs"
echo "   - Plan: Free"
echo ""
echo "6. Add Environment Variables:"
echo "   NODE_ENV=production"
echo "   SESSION_SECRET=your-secret-key-change-this"
echo "   FIREBASE_PROJECT_ID=your-firebase-project-id"
echo "   FIREBASE_PRIVATE_KEY=your-firebase-private-key"
echo "   FIREBASE_CLIENT_EMAIL=your-firebase-client-email"
echo ""
echo "7. Click 'Create Web Service'"
echo "8. Wait 3-5 minutes for deployment"
echo ""
echo "🎉 Your API will be live at:"
echo "   https://rideshare-hub-api.onrender.com"
echo ""
echo "📱 Then update Flutter app API URL in:"
echo "   flutter_rideshare/lib/config/api_config.dart"
echo ""
echo "For detailed instructions, see: DEPLOY_NOW.md"
echo ""
