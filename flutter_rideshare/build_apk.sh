#!/bin/bash

# RideShare Flutter App - APK Build Script
# This script builds production-ready APK for Android

set -e  # Exit on error

echo "=================================="
echo "RideShare Flutter APK Builder"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Flutter is installed
if ! command -v flutter &> /dev/null; then
    echo -e "${RED}Error: Flutter is not installed or not in PATH${NC}"
    echo "Please install Flutter from https://flutter.dev/docs/get-started/install"
    exit 1
fi

echo -e "${GREEN}✓ Flutter found${NC}"
flutter --version
echo ""

# Clean previous builds
echo -e "${YELLOW}Cleaning previous builds...${NC}"
flutter clean
echo -e "${GREEN}✓ Clean complete${NC}"
echo ""

# Get dependencies
echo -e "${YELLOW}Getting dependencies...${NC}"
flutter pub get
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Check for API URL configuration
API_URL="${API_BASE_URL:-http://10.0.2.2:5000}"
echo -e "${YELLOW}API Base URL: ${API_URL}${NC}"
echo ""

# Build options
echo "Select build type:"
echo "1) Development (debug signing, local API)"
echo "2) Production (release signing, production API)"
echo "3) Custom API URL"
read -p "Enter choice [1-3]: " choice

case $choice in
    1)
        echo -e "${YELLOW}Building Development APK...${NC}"
        flutter build apk --debug --flavor development
        APK_PATH="build/app/outputs/flutter-apk/app-development-debug.apk"
        ;;
    2)
        read -p "Enter production API URL (e.g., https://your-app.onrender.com): " PROD_URL
        echo -e "${YELLOW}Building Production APK with API: ${PROD_URL}${NC}"
        flutter build apk --release --flavor production --dart-define=API_BASE_URL="${PROD_URL}"
        APK_PATH="build/app/outputs/flutter-apk/app-production-release.apk"
        ;;
    3)
        read -p "Enter custom API URL: " CUSTOM_URL
        echo -e "${YELLOW}Building APK with custom API: ${CUSTOM_URL}${NC}"
        flutter build apk --release --dart-define=API_BASE_URL="${CUSTOM_URL}"
        APK_PATH="build/app/outputs/flutter-apk/app-release.apk"
        ;;
    *)
        echo -e "${RED}Invalid choice. Building default release APK...${NC}"
        flutter build apk --release
        APK_PATH="build/app/outputs/flutter-apk/app-release.apk"
        ;;
esac

echo ""

# Check if build was successful
if [ -f "$APK_PATH" ]; then
    echo -e "${GREEN}=================================="
    echo "✓ APK Build Successful!"
    echo "==================================${NC}"
    echo ""
    echo "APK Location: $APK_PATH"
    
    # Get APK size
    APK_SIZE=$(du -h "$APK_PATH" | cut -f1)
    echo "APK Size: $APK_SIZE"
    echo ""
    
    # Copy to easy access location
    cp "$APK_PATH" "./rideshare-app.apk"
    echo -e "${GREEN}✓ APK copied to: ./rideshare-app.apk${NC}"
    echo ""
    
    echo "Installation Instructions:"
    echo "1. Transfer rideshare-app.apk to your Android device"
    echo "2. Enable 'Install from Unknown Sources' in device settings"
    echo "3. Open the APK file and install"
    echo ""
    echo "Or install directly via ADB:"
    echo "  adb install rideshare-app.apk"
    echo ""
else
    echo -e "${RED}=================================="
    echo "✗ APK Build Failed!"
    echo "==================================${NC}"
    echo "Please check the error messages above."
    exit 1
fi

echo -e "${GREEN}Build process complete!${NC}"
