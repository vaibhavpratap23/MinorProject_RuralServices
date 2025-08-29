#!/bin/bash

echo "========================================"
echo "    Rural Services - Startup Script"
echo "========================================"
echo

echo "Starting all services..."
echo

# Function to cleanup processes on exit
cleanup() {
    echo
    echo "Stopping all services..."
    kill $BACKEND_PID $FRONTEND_PID $ADMIN_PID 2>/dev/null
    echo "All services stopped."
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

echo "[1/4] Starting Backend (Spring Boot)..."
echo "    Port: 8081"
cd Rural_Services-main
./tools/apache-maven-3.9.9/bin/mvn spring-boot:run &
BACKEND_PID=$!

echo "[2/4] Waiting for backend to start..."
sleep 20

echo "[3/4] Starting Frontend (React)..."
echo "    Port: 5173"
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "[4/4] Starting Admin Panel..."
echo "    Port: 5174"
cd ../admin
npm run dev &
ADMIN_PID=$!

echo
echo "========================================"
echo "    All services started!"
echo "========================================"
echo
echo "Access URLs:"
echo "    Backend API:    http://localhost:8081"
echo "    H2 Console:     http://localhost:8081/h2-console"
echo "    Frontend:       http://localhost:5173"
echo "    Admin Panel:    http://localhost:5174"
echo
echo "Press Ctrl+C to stop all services"
echo

# Wait for user to stop
wait
