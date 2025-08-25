#!/bin/bash
# This script stops the Gemuxde application.
set -e

echo "--- 🛑 Stopping Gemuxde Application 🛑 ---"

PID_FILE="pids.txt"

if [ -f "$PID_FILE" ]; then
    echo "Found PID file. Attempting to stop processes..."
    # Kill all processes listed in the PID file
    xargs kill < "$PID_FILE"
    # Remove the PID file
    rm "$PID_FILE"
    echo "--- ✅ Application processes terminated. ---"
else
    echo "⚠️  PID file not found. No processes to stop."
    echo "If the application is still running, you may need to stop it manually."
    echo "Try: pkill -f uvicorn and pkill -f 'next dev'"
fi
