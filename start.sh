#!/bin/bash

# Start FastAPI Backend
echo "Starting FastAPI Backend..."
cd backend && uvicorn main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Start Next.js Frontend
echo "Starting Next.js Frontend..."
cd frontend && npm run dev &
FRONTEND_PID=$!

echo "Services started (PIDs: $BACKEND_PID, $FRONTEND_PID)"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"

# Wait for termination
trap "kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT SIGTERM
wait
