#!/bin/bash

# Start Strapi Backend
echo "Starting Strapi Backend..."
cd backend && npm run dev &
BACKEND_PID=$!

# Start Next.js Frontend
echo "Starting Next.js Frontend..."
cd frontend && npm run dev &
FRONTEND_PID=$!

echo "Services started (PIDs: $BACKEND_PID, $FRONTEND_PID)"
echo "Backend: http://localhost:1337"
echo "Frontend: http://localhost:3000"

# Wait for termination
trap "kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT SIGTERM
wait
