#!/bin/bash

echo "🔍 Production Testing Environment Status Check"
echo "=============================================="

# Check Backend
echo "📡 Backend Service (Port 8080):"
if curl -s http://localhost:8080/actuator/health > /dev/null; then
    echo "✅ Backend is running and healthy"
    echo "   Health: $(curl -s http://localhost:8080/actuator/health)"
else
    echo "❌ Backend is not responding"
fi

# Check Frontend Production Build
echo ""
echo "🌐 Frontend Production Build (Port 3000):"
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend production build is running"
else
    echo "❌ Frontend production build is not responding"
fi

# Check API Configuration
echo ""
echo "⚙️  Production Configuration:"
echo "   Backend API Base: http://localhost:8080/api"
echo "   Frontend URL: http://localhost:3000 (production build)"
echo "   Mock Data: DISABLED (VITE_USE_MOCK_DATA=false)"
echo "   Authentication: Temporarily disabled for testing"

# Test Critical API Endpoints
echo ""
echo "🔗 API Endpoint Tests:"

echo "   Testing /api/fast/status..."
response=$(curl -s -w "%{http_code}" http://localhost:8080/api/fast/status -o /tmp/fast_status.json)
if [ "$response" = "200" ]; then
    echo "✅ Fasting status endpoint working (200 OK)"
    echo "   Data: $(cat /tmp/fast_status.json)"
else
    echo "❌ Fasting status endpoint failed: $response"
fi

echo "   Testing /api/users/current..."
response=$(curl -s -w "%{http_code}" "http://localhost:8080/api/users/current?userId=1" -o /dev/null)
if [ "$response" = "200" ]; then
    echo "✅ Users endpoint working (200 OK)"
elif [ "$response" = "403" ]; then
    echo "⚠️  Users endpoint responding but requires auth (403 - expected behavior)"
else
    echo "❌ Users endpoint failed: $response"
fi

# Test Build Info
echo ""
echo "📦 Build Information:"
if [ -d "dist" ]; then
    echo "✅ Production build exists in dist/"
    echo "   Build size: $(du -sh dist/ | cut -f1)"
    echo "   Main assets:"
    ls -la dist/assets/ | grep -E "\.(js|css)$" | head -3
else
    echo "❌ No production build found"
fi

echo ""
echo "🎯 Production Environment Ready!"
echo "   Frontend: http://localhost:3000 (production build)"
echo "   Backend API: http://localhost:8080/api"
echo "   Test User Settings, fasting controls, and verify API calls"

# Cleanup
rm -f /tmp/fast_status.json
