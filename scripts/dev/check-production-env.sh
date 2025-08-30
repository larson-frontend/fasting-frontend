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

# Cleanup
rm -f /tmp/fast_status.json
