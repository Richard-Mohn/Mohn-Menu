# 🔧 Firebase App Hosting Deployment - Troubleshooting Guide

## ❌ "Can't Create Rollout" Error

This error typically occurs when:
1. **Missing Firebase Token** - GitHub Actions doesn't have `FIREBASE_TOKEN` secret
2. **Wrong Project ID** - Configuration points to wrong project
3. **Backend Not Created** - Firebase App Hosting backend doesn't exist
4. **Insufficient Permissions** - Service account lacks required permissions
5. **Secrets Not Configured** - Firebase secrets aren't set in Firebase Console

---

## ✅ Fix Checklist

### 1. **Generate Firebase Token** (REQUIRED)
```bash
firebase login:ci
# Generates a token - save this safely in GitHub Secrets as FIREBASE_TOKEN
```

**Add to GitHub:**
- Go to **Settings → Secrets and variables → Actions**
- Click **New repository secret**
- Name: `FIREBASE_TOKEN`
- Value: The token from above

---

### 2. **Verify Firebase Project**
```bash
firebase projects:list
# Should show: chinese-system (your project ID)
```

If not listed, you may need to set the default project:
```bash
firebase use chinese-system
```

---

### 3. **Create Firebase App Hosting Backend**

Run this **once** to initialize App Hosting:
```bash
firebase apphosting:backends:create
# Follow the prompts - select "chinese-system" project
```

Or create it via Firebase Console:
1. Go to **Firebase Console → App Hosting**
2. Click **Create Backend**
3. Name: `restaurant-app` (should match codeDir in apphosting.yaml)
4. Select **Automatic deployment from GitHub**

---

### 4. **Set Firebase Secrets**

Add these secrets to your Firebase project (NOT GitHub):
```bash
firebase secrets:set NEXT_PUBLIC_FIREBASE_API_KEY
firebase secrets:set NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
firebase secrets:set NEXT_PUBLIC_FIREBASE_DATABASE_URL
# ... etc for all secrets listed in apphosting.yaml
```

Or via Firebase Console:
1. Go to **Project Settings → Secrets**
2. Click **Create secret**
3. Add each variable

---

### 5. **Add GitHub Secrets**

These go in **GitHub Settings → Secrets and variables → Actions:**

```
FIREBASE_TOKEN              ← From step 1
FIREBASE_API_KEY            ← From .env.local
FIREBASE_AUTH_DOMAIN        ← From .env.local  
FIREBASE_DATABASE_URL       ← From .env.local
FIREBASE_PROJECT_ID         ← "chinese-system"
FIREBASE_STORAGE_BUCKET     ← From .env.local
FIREBASE_MESSAGING_SENDER_ID ← From .env.local
FIREBASE_APP_ID             ← From .env.local
MAPBOX_TOKEN                ← Your Mapbox token
STRIPE_PUBLISHABLE_KEY      ← Your Stripe key
STRIPE_SECRET_KEY           ← Your Stripe key
OWNER_SECRET_CODE           ← Your code
```

---

## 🚀 Test Local Deployment First

Before GitHub Actions, test locally:

### **On Windows (PowerShell):**
```powershell
cd restaurant-app
.\deploy-local.ps1
```

### **On Mac/Linux (Bash):**
```bash
cd restaurant-app
chmod +x deploy-local.sh
./deploy-local.sh
```

This will:
1. Install dependencies
2. Build the app
3. Authenticate with Firebase
4. Deploy to your project
5. Show deployment logs

---

## 🔍 Verify Deployment

### **Check deployment status:**
```bash
firebase apphosting:backends:list
# Should show: restaurant-app (Status: DEPLOYED)
```

### **View logs:**
```bash
firebase apphosting:backends:log restaurant-app --limit 50
```

### **Check rollouts:**
```bash
firebase apphosting:backends:rollouts:list restaurant-app
# Should show recent successful rollouts
```

### **Visit your app:**
```
https://chinese-system.web.app
```

---

## 🆘 Common Error Messages

### **"Cannot authenticate with Google Cloud"**
- Fix: Run `firebase login:ci` and update `FIREBASE_TOKEN` secret

### **"Backend not found"**
- Fix: Run `firebase apphosting:backends:create`

### **"Insufficient permissions"**
- Fix: Regenerate token with `firebase login:ci` (old token may be expired)

### **"Build failed"**
- Check: GitHub Actions logs → Build step
- Run: `npm run build` locally to debug

### **"Secrets not found"**
- Fix: Set secrets in Firebase Console under Project Settings → Secrets

### **"Project ID mismatch"**
- Fix: Verify `chinese-system` is correct project ID
- Check: Run `firebase projects:list`

---

## 📝 Configuration Files

Your configuration files have been updated:

1. **`apphosting.yaml`** - Simplified for compatibility
2. **`.github/workflows/deploy.yml`** - Uses Firebase CLI commands
3. **`deploy-local.sh`** - Local deployment script (Mac/Linux)
4. **`deploy-local.ps1`** - Local deployment script (Windows)

---

## ✅ Quick Start (Complete Flow)

1. **Generate Firebase Token:**
   ```bash
   firebase login:ci
   ```

2. **Add token to GitHub:**
   - Settings → Secrets → `FIREBASE_TOKEN`

3. **Create App Hosting backend (if needed):**
   ```bash
   firebase apphosting:backends:create
   ```

4. **Test locally:**
   ```bash
   cd restaurant-app
   ./deploy-local.ps1  # Windows
   # or
   ./deploy-local.sh   # Mac/Linux
   ```

5. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "fix: update deployment configuration"
   git push origin main
   ```

6. **Watch deployment:**
   - GitHub → Actions tab → Deploy to Firebase workflow
   - Should complete in 5-10 minutes

---

## 📞 Support

**Firebase Documentation:**
- https://firebase.google.com/docs/app-hosting

**Firebase CLI Reference:**
- `firebase apphosting --help`
- `firebase apphosting:backends --help`
- `firebase apphosting:backends:rollouts --help`

**Your Project Settings:**
- https://console.firebase.google.com/project/chinese-system

---

**Last Updated:** February 6, 2026  
**Status:** ✅ Ready for Deployment
