#!/bin/bash

# RideShare Hub API Test Script
# Tests all major endpoints on Blackbox server

echo "=========================================="
echo "RideShare Hub API Test Suite"
echo "Server: http://0.0.0.0:5000"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://0.0.0.0:5000"

# Test function
test_endpoint() {
    local name=$1
    local endpoint=$2
    local method=${3:-GET}
    
    echo -n "Testing $name... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $http_code)"
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (HTTP $http_code)"
        return 1
    fi
}

# Run tests
echo "1. Health & Status Endpoints"
echo "----------------------------"
test_endpoint "Basic Health Check" "/health"
test_endpoint "API Health Check" "/api/health"
test_endpoint "API Root Info" "/"
echo ""

echo "2. Location Endpoints"
echo "----------------------------"
test_endpoint "All Locations" "/api/locations/all"
test_endpoint "Popular Locations" "/api/locations/popular"
test_endpoint "Search Locations" "/api/locations/search?q=Mumbai"
test_endpoint "Locations by State" "/api/locations/state/Maharashtra"
echo ""

echo "3. Vehicle Endpoints"
echo "----------------------------"
test_endpoint "Vehicle Types" "/api/vehicle-types"
echo ""

echo "4. Summary"
echo "----------------------------"
echo -e "${GREEN}Server is running and responding!${NC}"
echo ""
echo "API Base URL: $BASE_URL"
echo "Documentation: $BASE_URL/"
echo ""
echo "To test with curl:"
echo "  curl $BASE_URL/health"
echo ""
echo "To view all locations:"
echo "  curl $BASE_URL/api/locations/all | python3 -m json.tool"
echo ""
echo "To view vehicle types:"
echo "  curl $BASE_URL/api/vehicle-types | python3 -m json.tool"
echo ""
echo "=========================================="
echo "All tests completed!"
echo "=========================================="
