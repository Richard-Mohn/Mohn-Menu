# Local Firebase App Hosting deployment script for Windows
# Usage: .\deploy-local.ps1

Write-Host "🚀 MohnMenu - Local Deployment to Firebase App Hosting" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Firebase CLI is installed
try {
    firebase --version | Out-Null
}
catch {
    Write-Host "❌ Firebase CLI not found. Installing..." -ForegroundColor Red
    npm install -g firebase-tools
}

# Check if we're in the right directory
if (-not (Test-Path "apphosting.yaml")) {
    Write-Host "❌ Error: apphosting.yaml not found" -ForegroundColor Red
    Write-Host "   Please run this script from restaurant-app directory"
    exit 1
}

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "❌ Error: .env.local not found" -ForegroundColor Red
    Write-Host "   Please copy .env.example to .env.local and fill in your credentials"
    exit 1
}

Write-Host "✅ Prerequisites check passed" -ForegroundColor Green
Write-Host ""

# Step 1: Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm install failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Step 2: Build the app
Write-Host "🔨 Building Next.js application..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build successful" -ForegroundColor Green
Write-Host ""

# Step 3: Login to Firebase
Write-Host "🔑 Firebase login required..." -ForegroundColor Cyan
firebase login
Write-Host "✅ Firebase authenticated" -ForegroundColor Green
Write-Host ""

# Step 4: Deploy to Firebase
Write-Host "🚀 Deploying to Firebase App Hosting..." -ForegroundColor Cyan
Write-Host "   Project: chinese-system"
Write-Host ""

firebase deploy --project chinese-system --force

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Your app is live at:" -ForegroundColor Green
    Write-Host "   https://chinese-system.web.app"
    Write-Host ""
    Write-Host "📊 View logs:" -ForegroundColor Green
    Write-Host "   firebase functions:log --limit 50"
    Write-Host ""
}
else {
    Write-Host ""
    Write-Host "❌ Deployment failed" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔗 Common issues:" -ForegroundColor Yellow
    Write-Host "   1. Check Firebase project ID is correct: chinese-system"
    Write-Host "   2. Verify .env.local has all required variables"
    Write-Host "   3. Run: firebase projects:list"
    Write-Host "   4. Run: firebase deploy --help"
    exit 1
}
