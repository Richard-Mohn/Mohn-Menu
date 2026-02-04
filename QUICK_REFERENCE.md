# Multi-Tenant Auth System - Quick Reference

## 🔥 Most Common Tasks

### 1. Add a New User Role

**File**: `lib/types.ts`

1. Add to `UserRole` type:
```typescript
type UserRole = 'owner' | 'manager' | 'driver_inhouse' | 'driver_marketplace' | 'admin' | 'reseller' | 'support'; // ← NEW
```

2. Add to `PERMISSIONS` constant:
```typescript
PERMISSIONS: {
  support: {
    canViewOrders: true,
    canViewTickets: true,
    // ... other permissions
  }
}
```

3. Create dashboard page:
```typescript
// app/support/page.tsx
'use client';
import { useAuth } from '@/context/AuthContext';

export default function SupportDashboard() {
  const { isAdmin, currentBusiness, loading } = useAuth();
  
  if (!isAdmin()) return <div>Access Denied</div>;
  // ... dashboard content
}
```

### 2. Add a New Business Type

**File**: `lib/types.ts`

```typescript
type BusinessType = 'restaurant' | 'convenience_store' | 'home_bakery' | 'meal_prep' | 'crafter' | 'farm_csa' | 'pharmacy'; // ← NEW
```

Then in Firestore, create a new business document with `type: 'pharmacy'`

### 3. Add a Permission Check in Component

**File**: Any component file

```typescript
import { useAuth } from '@/context/AuthContext';

export default function MyComponent() {
  const { loclUser } = useAuth();
  const canDelete = loclUser?.role === 'owner';
  
  return (
    <>
      {canDelete && (
        <button onClick={() => deleteItem()}>Delete</button>
      )}
    </>
  );
}
```

### 4. Add a New Feature Flag

**File**: `lib/types.ts`

1. Add to Business interface:
```typescript
interface LOCLBusiness {
  // ...
  features: {
    delivery: boolean;
    pickup: boolean;
    loyalty: boolean;
    marketing: boolean;
    whitelabel: boolean; // ← NEW
  }
}
```

2. Use in component:
```typescript
const { currentBusiness } = useAuth();
const { whitelabel } = currentBusiness?.features || {};

if (whitelabel) {
  // Show white-label dashboard
}
```

### 5. Protect a Page (Require Specific Role)

**File**: New page file

```typescript
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminOnlyPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin())) {
      router.push('/login');
    }
  }, [user, loading, isAdmin, router]);

  if (loading) return <div>Loading...</div>;

  return <div>Admin-only content</div>;
}
```

### 6. Access Current Business in Component

**File**: Any component

```typescript
import { useAuth } from '@/context/AuthContext';

export default function Dashboard() {
  const { currentBusiness, user, loclUser } = useAuth();
  
  return (
    <>
      <h1>{currentBusiness?.name}</h1>
      <p>Type: {currentBusiness?.type}</p>
      <p>Tier: {currentBusiness?.tier}</p>
      <p>Owner: {user?.email}</p>
    </>
  );
}
```

### 7. Get User's All Businesses

**File**: Any component

```typescript
import { useAuth } from '@/context/AuthContext';

export default function BusinessSelector() {
  const { userBusinesses, switchBusiness, currentBusiness } = useAuth();
  
  return (
    <select onChange={(e) => switchBusiness(e.target.value)}>
      {userBusinesses.map(business => (
        <option key={business.businessId} value={business.businessId}>
          {business.name}
        </option>
      ))}
    </select>
  );
}
```

### 8. Create a Protected API Route

**File**: `app/api/orders/route.ts`

```typescript
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  
  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    const db = getFirestore();
    
    // Get user's active business from context
    const businessId = request.headers.get('x-business-id');
    
    // Query orders for this business only
    const orders = await db
      .collection('orders')
      .where('businessId', '==', businessId)
      .get();
    
    return Response.json(orders.docs.map(doc => doc.data()));
  } catch (error) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
```

### 9. Test Multiple User Accounts

In browser DevTools Console:
```javascript
// Logout current user
firebase.auth().signOut();

// Then log in with different account
```

Or create multiple browser profiles/windows for side-by-side testing.

### 10. Debug AuthContext State

**File**: Component

```typescript
import { useAuth } from '@/context/AuthContext';

export default function DebugComponent() {
  const auth = useAuth();
  
  useEffect(() => {
    console.log('Auth State:', {
      user: auth.user?.email,
      role: auth.loclUser?.role,
      business: auth.currentBusiness?.name,
      allBusinesses: auth.userBusinesses.map(b => b.name),
    });
  }, [auth.user, auth.loclUser, auth.currentBusiness]);
  
  return <div>Check console for auth state</div>;
}
```

## 📚 Import Snippets

### Import AuthContext
```typescript
import { useAuth } from '@/context/AuthContext';
```

### Import Types
```typescript
import type { 
  LOCLUser, 
  LOCLBusiness, 
  UserRole, 
  BusinessType,
  LOCLOrder,
  LOCLDriver 
} from '@/lib/types';
```

### Import Firebase
```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
```

## 🗄️ Firestore Query Snippets

### Get All Businesses for User
```typescript
const db = getFirestore();
const user = auth.currentUser;

const userDoc = await getDoc(doc(db, 'users', user.uid));
const userBusinessIds = userDoc.data()?.businessIds;

const businesses = await Promise.all(
  userBusinessIds.map(id => getDoc(doc(db, 'businesses', id)))
);
```

### Get All Orders for Business
```typescript
const orders = await getDocs(
  query(
    collection(db, 'orders'),
    where('businessId', '==', businessId)
  )
);
```

### Get Drivers for Business
```typescript
const drivers = await getDocs(
  query(
    collection(db, 'drivers', businessId, 'drivers'),
    where('status', '==', 'online')
  )
);
```

### Update Business Settings
```typescript
await updateDoc(doc(db, 'businesses', businessId), {
  'features.delivery': true,
  'features.loyalty': false,
  updatedAt: serverTimestamp()
});
```

## 🎨 Component Template

Use this template when creating new role-specific pages:

```typescript
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function PageName() {
  // 1. Get auth context
  const { user, loclUser, currentBusiness, loading, isOwner } = useAuth();
  const router = useRouter();

  // 2. Protect route
  useEffect(() => {
    if (!loading && (!user || !isOwner())) {
      router.push('/login');
    }
  }, [user, loading, isOwner, router]);

  // 3. Show loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  // 4. Render page
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white">
            {currentBusiness?.name}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Your content here */}
      </div>
    </div>
  );
}
```

## 🚀 Environment Variables

Copy to `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_value_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Get values from: Firebase Console → Project Settings → Web App Config

## 📝 Common Commands

```bash
# Install dependencies
npm install

# Seed demo data
npm run seed

# Start dev server
npm run dev

# Build for production
npm run build

# Type check
npx tsc --noEmit

# View deployed site
npm run deploy  # if configured
```

## 🐛 Debug Logs

To add debugging to AuthContext:

```typescript
// In context/AuthContext.tsx
console.log('Auth state changed:', { user, loclUser, currentBusiness });
```

To view in browser:
1. Open DevTools (F12)
2. Console tab
3. Look for auth debug messages

## ⚡ Performance Tips

1. **Avoid fetching on every render**
   ```typescript
   // GOOD - fetch once on mount
   useEffect(() => {
     fetchData();
   }, []);
   
   // BAD - fetches every render
   fetchData();
   ```

2. **Use useMemo for expensive operations**
   ```typescript
   const filteredOrders = useMemo(() => {
     return orders.filter(o => o.businessId === businessId);
   }, [orders, businessId]);
   ```

3. **Cache business data**
   - Business rarely changes
   - Use SWR or React Query for caching
   - Revalidate on update

4. **Lazy load dashboards**
   ```typescript
   const OwnerDashboard = dynamic(() => import('./owner'), { 
     loading: () => <Spinner /> 
   });
   ```

## 🔗 Related Documentation

- [MULTI_TENANT_AUTH.md](./MULTI_TENANT_AUTH.md) - Full implementation details
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Getting started
- [VERIFICATION_CHECKLIST.md](./VERIFICATION_CHECKLIST.md) - Test everything works
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Architecture overview

---

**Last Updated**: [Current Date]
**Version**: 1.0
