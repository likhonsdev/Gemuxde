#!/bin/bash
# This script sets up the entire Gemuxde application.
set -e

echo "--- 🚀 Starting Gemuxde Setup 🚀 ---"

# --- Backend Setup ---
echo "🐍 Installing Python dependencies for the backend..."
if pip install -r gemuxde/backend/requirements.txt; then
    echo "✅ Backend dependencies installed successfully."
else
    echo "❌ Error installing backend dependencies."
    echo "ℹ️  Please ensure you have Python and pip installed."
    echo "ℹ️  On Termux, you might need to install build tools: pkg install python build-essential cmake"
    exit 1
fi

# --- Frontend Setup ---
echo "🌐 Installing Node.js dependencies for the frontend..."
if (cd gemuxde/frontend && npm install); then
    echo "✅ Frontend dependencies installed successfully."
else
    echo "❌ Error installing frontend dependencies."
    echo "ℹ️  Please ensure you have Node.js and npm installed."
    exit 1
fi

# --- Model Download ---
echo "🧠 Downloading the AI model..."
if ./gemuxde/backend/download_model.sh; then
    echo "✅ Model download script executed successfully."
else
    echo "❌ Error downloading the model."
    exit 1
fi

echo "--- 🎉 Setup Complete! 🎉 ---"
echo "You can now run the application using the run.sh script."
