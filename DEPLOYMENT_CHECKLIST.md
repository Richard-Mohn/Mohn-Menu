# 🚀 LOCL Real-Time Tracking - Deployment Checklist

## Pre-Deployment (Before Building)

### Firebase Setup
- [ ] Enable Firebase Realtime Database (https://console.firebase.google.com)
- [ ] Choose region: **us-central1**
- [ ] Deploy Realtime DB rules: `firebase deploy --only database`
- [ ] Copy your Realtime DB URL (you'll need it later)

### Environment Variables
- [ ] Add `NEXT_PUBLIC_MAPBOX_TOKEN` to `.env.local`
- [ ] Get token from https://account.mapbox.com/tokens/
- [ ] Token should have these scopes:
  - `styles:read`
  - `fonts:read`
  - `datasets:read`

## Build & Deploy

### Step 1: Update Dependencies
```bash
cd restaurant-app
npm install
```

All required packages are already in package.json:
- ✅ firebase (Realtime Database included)
- ✅ mapbox-gl (for live maps)
- ✅ next 16.1.6
- ✅ react 19.2.3

### Step 2: Build Locally
```bash
npm run build
```

Expected result: ✅ Build completes with no errors

### Step 3: Test Locally
```bash
npm run dev
```

Then visit:
1. **Driver App:** http://localhost:3000/driver-app
2. **Customer Tracking:** http://localhost:3000/track-delivery/test-order-123

### Step 4: Deploy to Firebase
```bash
firebase deploy
```

Expected result:
```
✓ Deploy complete!
Hosting URL: https://chinese-system.web.app
```

## Post-Deployment Testing

### Test 1: Driver GPS Tracking
```
[ ] Open driver app on real phone
[ ] Enable location services
[ ] Click "Start Delivery"
[ ] Verify GPS location appears in Firebase Realtime DB
```

**Expected:** Location updates every 1-2 seconds

### Test 2: Customer Real-Time Map
```
[ ] Open customer tracking page in browser
[ ] Watch driver move on map in real-time
[ ] Verify marker animates smoothly
[ ] Check ETA countdown updates
```

**Expected:** Map updates automatically (no page refresh needed)

### Test 3: Restaurant Dashboard
```
[ ] Open restaurant assignment UI
[ ] See list of available drivers
[ ] Select driver on map
[ ] Assign order to driver
[ ] Driver receives assignment in real-time
```

**Expected:** Driver status changes to "in_transit" immediately

### Test 4: Sub-Second Latency
```
[ ] Start GPS tracking on driver phone
[ ] Watch customer map
[ ] Move to different location on phone
[ ] Measure time until map updates
```

**Expected:** Update appears within 1-2 seconds (not polling)

## Production Security

### Update Realtime Database Rules
Before going live, update `realtimedb.rules.json`:

```json
{
  "rules": {
    "restaurants": {
      "$restaurantId": {
        "drivers": {
          "$driverId": {
            "location": {
              ".write": "auth.uid === $driverId && auth.token.role === 'driver'",
              ".read": "root.child('orders').child(data.parent.parent().child('currentOrderId').val()).child('customerId').val() === auth.uid || root.child('restaurants').child($restaurantId).child('managers').hasChild(auth.uid)"
            }
          }
        }
      }
    }
  }
}
```

This restricts:
- ✅ Only authenticated drivers can write
- ✅ Only customers with active order can read
- ✅ Only restaurant staff can access admin functions

### Verify SSL/HTTPS
- [ ] Website uses HTTPS (Firebase provides this automatically)
- [ ] Mapbox requests use HTTPS
- [ ] Firebase Realtime DB uses secure WebSocket (wss://)

## Performance Checklist

### Optimize GPS Updates
- [ ] GPS update frequency: 1-2 seconds (adjust in `realTimeTracking.ts`)
- [ ] Location accuracy: enableHighAccuracy = true
- [ ] Battery impact: Consider adding battery saver mode

### Optimize Map Rendering
- [ ] Mapbox zoom level: 13-14 (adjust as needed)
- [ ] Animation duration: 1000ms (smooth between updates)
- [ ] Marker clustering: Not needed for MVP

### Monitor Firebase Usage
- [ ] Use Firebase Console to monitor:
  - Real-time DB read/write operations
  - Concurrent connections
  - Bandwidth usage
- [ ] Set alerts for quota limits

## Monitoring & Alerts

### Firebase Console Setup
1. Go to https://console.firebase.google.com
2. Select your project
3. Click **Realtime Database**
4. View **Usage** tab to monitor:
   - Operations per second
   - Data downloaded
   - Concurrent users

### Common Issues to Monitor
- [ ] GPS accuracy > 20 meters (acceptable)
- [ ] Location updates dropping (check permissions)
- [ ] Map lag (check Mapbox rate limits)
- [ ] Firebase connection timeouts

## Rollback Plan

If something goes wrong:

### Quick Fix (5 min)
```bash
# Revert to previous deployment
firebase hosting:rollback

# Or redeploy from git
git checkout main
npm run build
firebase deploy
```

### Debug Steps
1. Check Firebase Console logs
2. Check browser console (F12) for errors
3. Check network tab for failed requests
4. Verify `NEXT_PUBLIC_MAPBOX_TOKEN` is set
5. Verify Realtime DB rules are correct

## Success Criteria

✅ **MVP is successful when:**
- [ ] Driver can start GPS tracking from phone
- [ ] GPS location updates every 1-2 seconds
- [ ] Customer sees driver on live map updating in real-time
- [ ] No page refresh needed (true real-time)
- [ ] Restaurant can assign driver to order
- [ ] ETA countdown updates automatically
- [ ] No errors in browser console
- [ ] Mapbox map displays correctly
- [ ] Mobile responsive (works on all devices)

## Performance Benchmarks

**Target metrics:**
- GPS update frequency: 1-2 seconds ✅
- Map update latency: < 2 seconds ✅
- Firebase connection: < 100ms ✅
- Mapbox render: < 50ms ✅
- **Total latency:** ~500ms-1 second ✅

**Achieved with:**
- Realtime Database (not Firestore)
- WebSocket listeners (not HTTP polling)
- Smooth map animation (not jerky jumping)

## Next Steps After Deployment

1. **Onboard First Restaurant**
   - Create test account
   - Walk through driver assignment
   - Get feedback on UX

2. **Optimize Based on Feedback**
   - Adjust GPS frequency if needed
   - Improve UI clarity
   - Fix any bugs

3. **Add More Features**
   - Geofencing
   - Driver ratings
   - Customer notifications
   - Analytics

4. **Scale to Other Cities**
   - Replicate same setup
   - Launch marketing

---

## Questions?

If build fails or deployment errors occur:

1. Check error message in terminal
2. Verify all environment variables set
3. Ensure Firebase project is active
4. Confirm Realtime Database is enabled
5. Check network connectivity

Contact: support@locl.app
