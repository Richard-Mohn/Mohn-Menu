# Multi-Tenant Auth System - Verification Checklist

Use this checklist to verify the implementation is working correctly.

## ✅ Pre-Flight Checks

### Firebase Configuration
- [ ] Firebase project created at console.firebase.google.com
- [ ] Web app created in Firebase
- [ ] `.env.local` file created in `restaurant-app` directory
- [ ] `.env.local` contains all 6 Firebase config variables
- [ ] Firebase Authentication enabled (Email/Password)
- [ ] Firestore Database created (Production mode)

### Dependencies Installed
- [ ] Ran `npm install` in `restaurant-app` directory
- [ ] No installation errors in console
- [ ] `node_modules` folder exists
- [ ] `package.json` and `package-lock.json` present

## ✅ File Structure Verification

Check that all files were created:

### Core Architecture Files
- [ ] `middleware.ts` exists (root level)
- [ ] `lib/types.ts` exists (~400 lines)
- [ ] `context/AuthContext.tsx` exists (~235 lines)

### Dashboard Pages
- [ ] `app/dashboard/page.tsx` exists (smart router)
- [ ] `app/owner/page.tsx` exists (owner dashboard)
- [ ] `app/driver/page.tsx` exists (driver dashboard)
- [ ] `app/customer/page.tsx` exists (customer dashboard)

### Auth Pages
- [ ] `app/login/page.tsx` updated with new design
- [ ] `app/logout/page.tsx` exists
- [ ] `app/register/page.tsx` exists (if created)

### Documentation
- [ ] `MULTI_TENANT_AUTH.md` exists
- [ ] `SETUP_GUIDE.md` exists
- [ ] `IMPLEMENTATION_SUMMARY.md` exists

## ✅ Firebase Setup

### Firestore Security Rules
In Firebase Console → Firestore Database → Rules:

- [ ] Pasted security rules from SETUP_GUIDE.md
- [ ] Rules published successfully
- [ ] No validation errors

### Firebase Authentication Settings
In Firebase Console → Authentication → Settings:

- [ ] Email/Password provider enabled
- [ ] Custom domain added to authorized domains
- [ ] `localhost:3000` added for local testing

### Firestore Indexes (if needed)
- [ ] No errors in Firestore about missing indexes
- [ ] If errors appear, create composite indexes as prompted

## ✅ Seed Demo Data

### Run Seeding Script
```bash
npm run seed
```

- [ ] Script runs without errors
- [ ] Output shows:
  - ✅ Created business: China Wok Restaurant
  - ✅ Created business: Fresh & Quick Convenience
  - ✅ Created user: owner@example.com
  - ✅ Created user: driver@example.com
  - ✅ Created user: customer@example.com
- [ ] Check Firebase Console → Firestore → Collections
  - [ ] `businesses/` collection has 2 documents
  - [ ] `users/` collection has 3 documents

## ✅ Run Development Server

### Start Server
```bash
npm run dev
```

- [ ] No TypeScript compilation errors
- [ ] Terminal shows "✓ compiled successfully"
- [ ] Dev server running on `http://localhost:3000`
- [ ] No errors in browser console

## ✅ Test Login Flow

### Visit Login Page
1. Navigate to `http://localhost:3000/login`
2. Page should load with:
   - [ ] Title "Welcome Back"
   - [ ] Email input field
   - [ ] Password input field
   - [ ] "Sign In" button
   - [ ] Link to "Sign Up"
   - [ ] Demo credentials section

### Test Owner Login
1. Enter email: `owner@example.com`
2. Enter password: `Demo123!@#`
3. Click "Sign In"

Expected behavior:
- [ ] "Signing In..." appears briefly
- [ ] Redirected to `/owner` (not `/dashboard` then `/owner`)
- [ ] Owner dashboard loads with:
  - [ ] Business name: "China Wok Restaurant"
  - [ ] Business type: "RESTAURANT"
  - [ ] Stats cards (Revenue, Orders, Customers, Drivers)
  - [ ] Management cards (Orders, Drivers, Menu, etc.)
  - [ ] Settings and Logout buttons

### Test Driver Login
1. Click "Logout" button
2. You should be redirected to login page
3. Enter email: `driver@example.com`
4. Enter password: `Demo123!@#`
5. Click "Sign In"

Expected behavior:
- [ ] Redirected to `/driver` page
- [ ] Driver dashboard loads with:
  - [ ] Title "Driver Dashboard"
  - [ ] Status indicator (currently "offline")
  - [ ] "Go Online" button
  - [ ] Stats cards (Deliveries, Earnings, Rating, Completed)
  - [ ] Active Deliveries section
  - [ ] Navigation cards (History, Earnings, Profile)

### Test Customer Login
1. Click "Logout" button
2. Enter email: `customer@example.com`
3. Enter password: `Demo123!@#`
4. Click "Sign In"

Expected behavior:
- [ ] Redirected to `/customer` page
- [ ] Customer dashboard loads with:
  - [ ] Title "My Orders"
  - [ ] Loyalty Points stat
  - [ ] Navigation cards (Browse Menu, History, Loyalty, Profile)
  - [ ] Recent Orders section

## ✅ Test Role-Based Access

### Access Control
- [ ] Owner can see `/owner` page
- [ ] Owner cannot access `/driver` (no access to other dashboards)
- [ ] Customer cannot access `/owner` page
- [ ] Unauth users redirected to `/login` from protected pages

### Smart Routing
1. Go to `http://localhost:3000/dashboard`
2. Should auto-redirect to role-specific dashboard:
   - [ ] Owner → `/owner`
   - [ ] Driver → `/driver`
   - [ ] Customer → `/customer`

## ✅ Test AuthContext Functionality

### Check Browser DevTools
1. Open DevTools (F12) → Application → Cookies
2. Look for `x-business-domain` cookie
3. Value should be relevant domain

### Check localStorage
1. Open DevTools → Application → Local Storage
2. Should have Firebase auth token stored

### Check Network Tab
1. Open DevTools → Network
2. Make a request to dashboard
3. Look for `x-business-domain` header in request

## ✅ Firestore Data Verification

### Check Created Collections
In Firebase Console → Firestore:

1. **businesses** collection:
   - [ ] 2 documents exist
   - [ ] `business-1` (China Wok Restaurant)
   - [ ] `business-2` (Fresh & Quick Convenience)
   - [ ] Each has: name, type, tier, customDomain, features

2. **users** collection:
   - [ ] 3 documents exist
   - [ ] Each has: uid, email, role, businessIds
   - [ ] Owner's businessIds: `["business-1"]`
   - [ ] Driver's businessIds: `["business-1"]`
   - [ ] Customer's businessIds: `[]`

## ✅ TypeScript Compilation

### Check for Errors
```bash
npx tsc --noEmit
```

- [ ] No TypeScript errors
- [ ] No "Cannot find module" errors
- [ ] All types resolve correctly

### Check IDE IntelliSense
In VSCode:
- [ ] AuthContext shows all methods in autocomplete
- [ ] Types imported from `lib/types.ts` work
- [ ] No red squiggly lines in component files

## ✅ Performance Check

### Bundle Size
1. Build production: `npm run build`
2. Check `.next` folder size
- [ ] Build completes successfully
- [ ] No warnings about large bundles

### Page Load Time
1. Open DevTools → Lighthouse
2. Run Lighthouse audit
- [ ] Performance score > 50
- [ ] No critical errors

## ✅ Security Checks

### Firestore Rules Enforcement
1. Try to access another business's data in browser console:
```javascript
// This should fail (security rule blocks it)
db.collection('orders')
  .where('businessId', '==', 'different-business')
  .get()
```

- [ ] Request returns empty (rule blocks cross-business access)
- [ ] No security warnings in console

### Authentication Token
1. Check that auth token is stored securely
2. Verify session persists on page refresh
- [ ] Log in as owner
- [ ] Refresh page
- [ ] Still logged in (cookie/localStorage restored session)

## ✅ Error Handling

### Test Invalid Credentials
1. Go to login page
2. Enter `owner@example.com` with wrong password
- [ ] Error message appears: "Login failed" or similar
- [ ] Not redirected to dashboard

### Test Invalid Email
1. Go to login page
2. Enter `nonexistent@example.com` with any password
- [ ] Error message appears
- [ ] Page doesn't crash

## ✅ Browser Compatibility

Test in multiple browsers:
- [ ] Chrome: Works correctly
- [ ] Firefox: Works correctly
- [ ] Safari: Works correctly
- [ ] Edge: Works correctly

## ✅ Mobile Responsiveness

Test on mobile (DevTools device emulation):
- [ ] Login page is responsive
- [ ] Dashboards work on mobile
- [ ] No horizontal scroll
- [ ] Touch interactions work

## 🐛 Troubleshooting Guide

### Issue: Login redirects infinitely
**Solution**: 
- Check AuthContext implementation in `context/AuthContext.tsx`
- Verify user document exists in Firestore `/users/{uid}`
- Clear browser cache and try again

### Issue: "Permission denied" on Firestore reads
**Solution**:
- Update Firestore security rules (see SETUP_GUIDE.md)
- Make sure user is added to business in `/users/{uid}.businessIds`
- Check Firebase Console for rule errors

### Issue: TypeScript errors about missing types
**Solution**:
- Verify `lib/types.ts` exists
- Run `npm install`
- Clear `.next` folder: `rm -rf .next`
- Restart dev server

### Issue: Middleware not detecting custom domain
**Solution**:
- Verify `middleware.ts` exists at root level
- Check `next.config.ts` has no conflicting middleware config
- Restart dev server after middleware changes

### Issue: Auth state not persisting on refresh
**Solution**:
- Check browser allows localStorage
- Verify `browserLocalPersistence` in AuthContext
- Check for console errors about storage

### Issue: "Module not found: can't resolve '@/context/AuthContext'"
**Solution**:
- Verify import path has `@/` prefix
- Check `tsconfig.json` has path alias for `@`
- Make sure component is using ES6 import syntax

## 📞 Support

If issues persist:
1. Check the error message in browser console
2. Look up error in [TROUBLESHOOTING.md](./MULTI_TENANT_AUTH.md#troubleshooting)
3. Check Firebase Console for configuration issues
4. Review Firestore Security Rules

---

**Checklist Status**: Use this to track your verification process
**Date Started**: ___________
**Date Completed**: ___________
**All Checks Passed**: [ ] Yes [ ] No
**Issues Found**: ___________
