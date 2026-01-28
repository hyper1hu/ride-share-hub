#!/bin/bash

# RideShare Hub - Deployment Test Script
# Tests all major API endpoints to verify deployment

echo "=========================================="
echo "RideShare Hub - Deployment Test Suite"
echo "=========================================="
echo ""

BASE_URL="http://localhost:5000"
PASS_COUNT=0
FAIL_COUNT=0

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test function
test_endpoint() {
    local name=$1
    local url=$2
    local expected_code=${3:-200}
    
    echo -n "Testing $name... "
    
    response=$(curl -s -w "\n%{http_code}" "$url")
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -eq "$expected_code" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $http_code)"
        PASS_COUNT=$((PASS_COUNT + 1))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (HTTP $http_code, expected $expected_code)"
        FAIL_COUNT=$((FAIL_COUNT + 1))
        return 1
    fi
}

# Test JSON response
test_json_endpoint() {
    local name=$1
    local url=$2
    
    echo -n "Testing $name... "
    
    response=$(curl -s "$url")
    
    if echo "$response" | python3 -m json.tool > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASS${NC} (Valid JSON)"
        PASS_COUNT=$((PASS_COUNT + 1))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (Invalid JSON)"
        FAIL_COUNT=$((FAIL_COUNT + 1))
        return 1
    fi
}

echo "Starting tests..."
echo ""

# Basic health checks
echo "=== Health Checks ==="
test_endpoint "Basic Health" "$BASE_URL/health"
test_endpoint "API Health" "$BASE_URL/api/health"
test_endpoint "Root Info" "$BASE_URL/"
echo ""

# Location endpoints
echo "=== Location Endpoints ==="
test_json_endpoint "All Locations" "$BASE_URL/api/locations/all"
test_json_endpoint "Popular Locations" "$BASE_URL/api/locations/popular"
test_json_endpoint "Search Locations" "$BASE_URL/api/locations/search?q=Mumbai"
test_json_endpoint "Locations by State" "$BASE_URL/api/locations/state/Maharashtra"
echo ""

# Vehicle types
echo "=== Vehicle Endpoints ==="
test_json_endpoint "Vehicle Types" "$BASE_URL/api/vehicle-types"
echo ""

# Authentication endpoints (should return 401 or proper response)
echo "=== Authentication Endpoints ==="
test_endpoint "Auth Me (Unauthorized)" "$BASE_URL/api/auth/me" 401
echo ""

# 404 test
echo "=== Error Handling ==="
test_endpoint "404 Not Found" "$BASE_URL/api/nonexistent" 404
echo ""

# Summary
echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo -e "Total Tests: $((PASS_COUNT + FAIL_COUNT))"
echo -e "${GREEN}Passed: $PASS_COUNT${NC}"
echo -e "${RED}Failed: $FAIL_COUNT${NC}"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed! Deployment is successful!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed. Please check the server logs.${NC}"
    exit 1
fi
