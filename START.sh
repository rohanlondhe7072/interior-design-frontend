#!/bin/bash

# ============================================
# INTERIOR DESIGN PRO - AUTH SYSTEM STARTUP
# ============================================

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║     INTERIOR DESIGN PRO - AUTHENTICATION SETUP        ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ ERROR: npm is not installed"
    echo "Download Node.js from: https://nodejs.org/"
    exit 1
fi

echo "✅ npm found"
echo ""

# Step 1: Install dependencies
echo "📦 Step 1: Installing dependencies..."
echo ""
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo "✅ Dependencies installed"
echo ""

# Step 2: Start MongoDB
echo "🗄️  Step 2: Check MongoDB is running..."
echo "Make sure MongoDB is running with: mongod"
echo ""

# Step 3: Start server
echo "🚀 Step 3: Starting server..."
echo ""
echo "Server will start on http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start

