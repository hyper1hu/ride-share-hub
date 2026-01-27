#!/bin/bash

# RideShare Hub - API Testing Script
# Tests all major API endpoints

# Configuration
API_URL="${1:-http://localhost:5000}"
VERBOSE="${2:-false}"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "🧪 RideShare Hub - API Testing Suite"
echo "===================================="
echo "API URL: $API_URL"
echo ""

# Test counter
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    local data=$4
    local expected_status=$5
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo -n "Testing: $description... "
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$API_URL$endpoint" 2>/dev/null)
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            "$API_URL$endpoint" 2>/dev/null)
    fi
    
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$VERBOSE" = "true" ]; then
        echo ""
        echo "  Response: $body"
        echo "  Status: $status_code"
    fi
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✓ PASS${NC} (Status: $status_code)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}✗ FAIL${NC} (Expected: $expected_status, Got: $status_code)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        if [ "$VERBOSE" != "true" ]; then
            echo "  Response: $body"
        fi
    fi
}

# Wait for server to be ready
echo "⏳ Waiting for server to be ready..."
for i in {1..30}; do
    if curl -s "$API_URL/api/health" > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} Server is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}✗${NC} Server is not responding. Please start the server first."
        echo "Run: npm run dev"
        exit 1
    fi
    sleep 1
done

echo ""
echo "🔍 Running API Tests..."
echo "----------------------"
echo ""

# Test 1: Health Check
echo "📋 Health & Status Endpoints"
test_endpoint "GET" "/api/health" "Health check" "" "200"
test_endpoint "GET" "/" "Root endpoint" "" "200"
echo ""

# Test 2: Vehicle Endpoints
echo "🚗 Vehicle Endpoints"
test_endpoint "GET" "/api/cars" "List all vehicles" "" "200"
test_endpoint "GET" "/api/cars/search?origin=Kolkata&destination=Siliguri" "Search vehicles by route" "" "200"
echo ""

# Test 3: Authentication Endpoints (without actual registration)
echo "🔐 Authentication Endpoints"
echo "Note: These tests check endpoint availability, not full auth flow"

# Test customer registration endpoint (will fail without valid data, but should return 400 not 404)
test_endpoint "POST" "/api/auth/customer/register" "Customer registration endpoint" '{}' "400"

# Test driver registration endpoint
test_endpoint "POST" "/api/auth/driver/register" "Driver registration endpoint" '{}' "400"

# Test admin login endpoint
test_endpoint "POST" "/api/auth/admin/login" "Admin login endpoint" '{}' "400"

# Test OTP endpoints
test_endpoint "POST" "/api/auth/otp/send" "Send OTP endpoint" '{}' "400"
test_endpoint "POST" "/api/auth/otp/verify" "Verify OTP endpoint" '{}' "400"

echo ""

# Test 4: Location Endpoints (if available)
echo "📍 Location Endpoints"
test_endpoint "GET" "/api/locations" "List locations" "" "200"
echo ""

# Test 5: Stats Endpoint (may require auth)
echo "📊 Statistics Endpoints"
test_endpoint "GET" "/api/stats" "Platform statistics" "" "200"
echo ""

# Summary
echo ""
echo "📊 Test Summary"
echo "==============="
echo -e "Total Tests:  $TOTAL_TESTS"
echo -e "${GREEN}Passed:       $PASSED_TESTS${NC}"
echo -e "${RED}Failed:       $FAILED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some tests failed. Check the output above.${NC}"
    exit 1
fi
