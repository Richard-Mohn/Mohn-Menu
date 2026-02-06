#!/bin/bash
# Local Firebase App Hosting deployment script
# Usage: ./deploy-local.sh

set -e

echo "🚀 MohnMenu - Local Deployment to Firebase App Hosting"
echo "=========================================="
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Check if we're in the right directory
if [ ! -f "apphosting.yaml" ]; then
    echo "❌ Error: apphosting.yaml not found"
    echo "   Please run this script from restaurant-app directory"
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local not found"
    echo "   Please copy .env.example to .env.local and fill in your credentials"
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Step 2: Build the app
echo "🔨 Building Next.js application..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi
echo "✅ Build successful"
echo ""

# Step 3: Login to Firebase
echo "🔑 Firebase login required..."
firebase login
echo "✅ Firebase authenticated"
echo ""

# Step 4: Deploy to Firebase
echo "🚀 Deploying to Firebase App Hosting..."
echo "   Project: chinese-system"
echo ""

firebase deploy --project chinese-system --force

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "🌐 Your app is live at:"
    echo "   https://chinese-system.web.app"
    echo ""
    echo "📊 View logs:"
    echo "   firebase functions:log --limit 50"
    echo ""
else
    echo ""
    echo "❌ Deployment failed"
    echo ""
    echo "🔗 Common issues:"
    echo "   1. Check Firebase project ID is correct: chinese-system"
    echo "   2. Verify .env.local has all required variables"
    echo "   3. Run: firebase projects:list"
    echo "   4. Run: firebase deploy --help"
    exit 1
fi
