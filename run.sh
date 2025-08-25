#!/bin/bash
# This script runs the Gemuxde application.
set -e

echo "--- 🚀 Starting Gemuxde Application 🚀 ---"

# Navigate to the backend and start the server
echo "🐍 Starting FastAPI backend on http://localhost:8000"
(cd gemuxde/backend && uvicorn main:app --host 0.0.0.0 --port 8000) > backend.log 2>&1 &
BACKEND_PID=$!

# Navigate to the frontend and start the server
echo "🌐 Starting Next.js frontend on http://localhost:3000"
(cd gemuxde/frontend && npm run dev) > frontend.log 2>&1 &
FRONTEND_PID=$!

# Save PIDs for the kill script
echo $BACKEND_PID > pids.txt
echo $FRONTEND_PID >> pids.txt

echo "--- ✅ Application Started! ---"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "View logs with: tail -f backend.log"
echo "View logs with: tail -f frontend.log"
echo "To stop the application, run: bash kill.sh"
