# Deployment Guide - Firebase App Hosting

This guide explains how to deploy MohnMenu to Firebase App Hosting using GitHub.

## 📋 Prerequisites

- GitHub account with the MohnMenu repository
- Firebase project (create at [firebase.google.com](https://firebase.google.com))
- Firebase CLI installed (`npm install -g firebase-tools`)
- Node.js 18+ installed

## 🔑 Step 1: Set Up Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing `chinese-system` project
3. Enable required services:
   - **Authentication**: Email/Password, Google Sign-in
   - **Firestore Database**: Start in production mode
   - **Realtime Database**: Create database in US region
   - **Cloud Storage**: Create bucket
   - **Cloud Functions**: Enable

## 🔐 Step 2: Create Service Account

1. In Firebase Console, go to **Project Settings → Service Accounts**
2. Click **Generate New Private Key**
3. Save the JSON file securely
4. Copy the entire JSON content

## 🚀 Step 3: Configure GitHub Secrets

Add these secrets to your GitHub repository:

1. Go to **Settings → Secrets and variables → Actions**
2. Click **New repository secret**
3. Add these secrets:

| Secret Name | Value | Source |
|---|---|---|
| `FIREBASE_SERVICE_ACCOUNT` | Service account JSON (from Step 2) | Firebase Console |
| `FIREBASE_API_KEY` | `NEXT_PUBLIC_FIREBASE_API_KEY` | .env.local |
| `FIREBASE_AUTH_DOMAIN` | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | .env.local |
| `FIREBASE_DATABASE_URL` | `NEXT_PUBLIC_FIREBASE_DATABASE_URL` | .env.local |
| `FIREBASE_PROJECT_ID` | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | .env.local |
| `FIREBASE_STORAGE_BUCKET` | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | .env.local |
| `FIREBASE_MESSAGING_SENDER_ID` | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | .env.local |
| `FIREBASE_APP_ID` | `NEXT_PUBLIC_FIREBASE_APP_ID` | .env.local |
| `MAPBOX_TOKEN` | Your Mapbox public token | Mapbox Dashboard |
| `STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key | Stripe Dashboard |
| `STRIPE_SECRET_KEY` | Your Stripe secret key | Stripe Dashboard |
| `OWNER_SECRET_CODE` | Your secret code for owner access | Your choice |

## 📦 Step 4: Deploy from GitHub

### Option A: Automatic Deployment (Recommended)

1. Push code to `main` branch:
```bash
git add .
git commit -m "feat: production deployment"
git push origin main
```

2. GitHub Actions automatically:
   - Runs tests
   - Builds the app
   - Deploys to Firebase App Hosting
   - Comments on pull requests with preview URLs

### Option B: Manual Deployment via CLI

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Deploy:
```bash
firebase deploy --only functions,firestore,database,storage
```

## 🌍 Step 5: Configure Custom Domain

1. In Firebase Console, go to **Hosting**
2. Click **Connect custom domain**
3. Enter your domain (e.g., `mohnmenu.com`)
4. Follow DNS verification steps
5. Update domain records:

```
Type: CNAME
Name: www
Value: c.apphosting.googleapis.com
TTL: 3600
```

## 🔍 Step 6: Verify Deployment

1. After deployment, visit your app at:
   - Firebase default: `https://chinese-system.web.app`
   - Custom domain: `https://yourdomain.com`

2. Check live logs:
```bash
firebase functions:log
```

3. Monitor performance:
   - Firebase Console → Hosting → Analytics
   - Web Vitals, traffic, errors

## 📊 Monitoring & Debugging

### View Deployment Logs
```bash
firebase deploy --debug
```

### Check App Status
```bash
firebase hosting:sites:list
```

### View Cloud Function Logs
```bash
firebase functions:log --limit 100
```

## 🆘 Troubleshooting

### Build Fails
1. Check GitHub Actions logs
2. Verify environment variables are set
3. Run `npm run build` locally to test

### Deploy Fails
1. Check Firebase project is active
2. Verify service account has correct permissions
3. Ensure all required Firebase services are enabled

### App Not Loading
1. Check Firestore rules allow public read to marketing pages
2. Verify Firebase initialization in code
3. Check browser console for errors

## 🔄 Rolling Back

To deploy a previous version:

```bash
# View deployment history
firebase hosting:releases:list

# Redeploy specific version
firebase hosting:releases:deploy <VERSION>
```

## 📈 Performance Optimization

1. **Enable CDN Caching**:
   - Static assets cached at edge
   - TTL: 3600 seconds for JS/CSS

2. **Enable Compression**:
   - Gzip enabled by default
   - Reduces payload size 60-70%

3. **Monitor Core Web Vitals**:
   - Largest Contentful Paint (LCP)
   - First Input Delay (FID)
   - Cumulative Layout Shift (CLS)

## 🔒 Security Best Practices

1. **Firestore Rules**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public pages readable by anyone
    match /public/{document=**} {
      allow read;
      allow write: if false;
    }
    
    // User-specific data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Business data
    match /businesses/{businessId}/{document=**} {
      allow read, write: if request.auth.uid in resource.data.ownerIds;
    }
  }
}
```

2. **Realtime Database Rules**:
```json
{
  "rules": {
    "tracking": {
      "$businessId": {
        "$driverId": {
          ".read": "auth.uid != null",
          ".write": "auth.uid == $driverId || root.child('businesses').child($businessId).child('ownerIds').child(auth.uid).exists()"
        }
      }
    }
  }
}
```

3. **Environment Variables**:
   - Never commit `.env.local`
   - Use GitHub secrets for sensitive data
   - Rotate API keys quarterly

## 📞 Support

- **Firebase Docs**: https://firebase.google.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **GitHub Actions**: https://docs.github.com/en/actions
- **MohnMenu Support**: hello@mohnmenu.com

---

**Last Updated**: February 2026
**Status**: ✅ Production Ready
