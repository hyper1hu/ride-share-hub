#!/bin/bash

# Firebase Setup Helper Script for RideShare Hub
# This script helps you set up Firebase connection

set -e

echo "🔥 Firebase Connection Setup for RideShare Hub"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if google-services.json exists
GOOGLE_SERVICES_PATH="android/app/google-services.json"

echo -e "${BLUE}Checking Firebase configuration...${NC}"
echo ""

if [ -f "$GOOGLE_SERVICES_PATH" ]; then
    echo -e "${GREEN}✓ google-services.json found!${NC}"
    echo ""
    
    # Verify it's a valid JSON file
    if jq empty "$GOOGLE_SERVICES_PATH" 2>/dev/null; then
        echo -e "${GREEN}✓ Configuration file is valid JSON${NC}"
        
        # Extract project info
        PROJECT_ID=$(jq -r '.project_info.project_id' "$GOOGLE_SERVICES_PATH" 2>/dev/null || echo "unknown")
        PROJECT_NUMBER=$(jq -r '.project_info.project_number' "$GOOGLE_SERVICES_PATH" 2>/dev/null || echo "unknown")
        
        echo -e "${BLUE}Firebase Project Details:${NC}"
        echo "  Project ID: $PROJECT_ID"
        echo "  Project Number: $PROJECT_NUMBER"
        echo ""
        
        echo -e "${GREEN}✓ Firebase is configured and ready!${NC}"
        echo ""
        echo -e "${YELLOW}Next steps:${NC}"
        echo "  1. Run: flutter clean"
        echo "  2. Run: flutter pub get"
        echo "  3. Run: flutter build apk --release"
        echo "  4. Test your app!"
        echo ""
        
    else
        echo -e "${RED}✗ Configuration file is not valid JSON${NC}"
        echo -e "${YELLOW}Please download a fresh google-services.json from Firebase Console${NC}"
        exit 1
    fi
    
else
    echo -e "${RED}✗ google-services.json NOT found${NC}"
    echo ""
    echo -e "${YELLOW}To connect to Firebase, you need to:${NC}"
    echo ""
    echo "1. Go to Firebase Console: https://console.firebase.google.com/"
    echo "2. Select your project"
    echo "3. Go to Project Settings (⚙️ icon)"
    echo "4. Scroll to 'Your apps' section"
    echo "5. Click on Android app or 'Add app' if not exists"
    echo "6. Use package name: com.rideshare.rideshare"
    echo "7. Download google-services.json"
    echo "8. Place it in: $GOOGLE_SERVICES_PATH"
    echo ""
    echo -e "${BLUE}Quick command to place the file:${NC}"
    echo "  cp ~/Downloads/google-services.json $GOOGLE_SERVICES_PATH"
    echo ""
    echo -e "${YELLOW}After placing the file, run this script again to verify.${NC}"
    echo ""
    exit 1
fi

# Check if Flutter is installed
if command -v flutter &> /dev/null; then
    echo -e "${BLUE}Checking Flutter installation...${NC}"
    flutter --version | head -n 1
    echo ""
    
    # Offer to run flutter commands
    read -p "Do you want to clean and rebuild the project now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}Cleaning project...${NC}"
        flutter clean
        
        echo -e "${BLUE}Getting dependencies...${NC}"
        flutter pub get
        
        echo -e "${BLUE}Building APK...${NC}"
        flutter build apk --release
        
        echo ""
        echo -e "${GREEN}✓ Build complete!${NC}"
        echo -e "${YELLOW}APK location: build/app/outputs/flutter-apk/app-release.apk${NC}"
        echo ""
    fi
else
    echo -e "${YELLOW}Flutter not found in PATH${NC}"
    echo "Please install Flutter or run the build commands manually:"
    echo "  flutter clean"
    echo "  flutter pub get"
    echo "  flutter build apk --release"
    echo ""
fi

echo -e "${GREEN}Setup complete! 🎉${NC}"
