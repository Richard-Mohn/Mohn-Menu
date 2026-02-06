# Multi-Tenant Authentication System - Implementation Guide

## Overview

The LOCL platform implements a sophisticated multi-tenant authentication system that supports:

- **Multiple User Roles**: Owner, Manager, Driver (In-house & Marketplace), Customer, Admin
- **Multiple Businesses Per User**: Users can own/manage multiple restaurants/stores
- **Business Context**: Every request knows which business it belongs to
- **Role-Based Access Control**: Permissions determined by role and active business
- **Feature Flags**: Features unlocked based on subscription tier

## Architecture

### 1. Middleware-Based Domain Routing

**File**: `middleware.ts`

The middleware intercepts all incoming requests and:

```
Request → Extract Domain → Lookup Business → Set Headers/Cookies → Route Request
```

**Key Features**:
- Detects custom domain (e.g., `chinawok.com` vs `locl-platform.com`)
- Stores business context in headers (`x-business-domain`) and cookies
- Skips internal routes (`/_next`, `/api`, `/static`, `/public`)
- Enables single codebase to serve infinite client domains

### 2. Authentication Context

**File**: `context/AuthContext.tsx`

The AuthContext provides:

```typescript
{
  user: FirebaseUser | null,
  loclUser: LOCLUser | null,
  currentBusiness: LOCLBusiness | null,
  userBusinesses: LOCLBusiness[],
  loading: boolean,
  error: string | null,
  
  // Methods
  loginWithEmail(email, password),
  signupWithEmail(email, password, displayName),
  logout(),
  switchBusiness(businessId),
  
  // Helpers
  isOwner(),
  isManager(),
  isDriver(),
  isCustomer(),
  isAdmin()
}
```

### 3. Type System

**File**: `lib/types.ts`

Comprehensive TypeScript types for:

- **BusinessType**: `'restaurant' | 'convenience_store' | 'home_bakery' | 'meal_prep' | 'crafter' | 'farm_csa'`
- **SubscriptionTier**: `'starter' | 'partner' | 'agency' | 'reseller'`
- **UserRole**: `'customer' | 'owner' | 'manager' | 'driver_inhouse' | 'driver_marketplace' | 'admin' | 'reseller'`
- **DriverStatus**: `'offline' | 'online' | 'on_delivery' | 'on_break'`
- **OrderStatus**: Full fulfillment pipeline
- Core entities: `LOCLUser`, `LOCLBusiness`, `LOCLLocation`, `LOCLDriver`, `LOCLOrder`, `LOCLCustomer`

## User Flows

### Signup Flow

1. User registers with email/password
2. Firebase Auth creates user account
3. Firestore creates `/users/{uid}` document with role
4. If Owner: Can immediately create a business
5. If Driver: Assigned to business by owner
6. If Customer: Automatically available system-wide

```typescript
// Example
const { signupWithEmail } = useAuth();
await signupWithEmail('owner@restaurant.com', 'password123', 'John Owner');
```

### Login Flow

1. User enters email/password
2. Firebase Auth validates credentials
3. AuthContext fetches user's `/users/{uid}` document
4. AuthContext fetches all associated businesses
5. Sets activeBusinessId to first/default business
6. User redirected to role-specific dashboard

```typescript
// Example
const { loginWithEmail } = useAuth();
await loginWithEmail('owner@restaurant.com', 'password123');
```

### Business Switching

Users with multiple businesses can switch context:

```typescript
const { switchBusiness } = useAuth();
await switchBusiness('business-2');
// Now currentBusiness is business-2
// All subsequent requests use this context
```

## Dashboard Routing

After login, users are automatically routed based on role:

| Role | Route | Page |
|------|-------|------|
| Owner/Manager | `/owner` | [app/owner/page.tsx](app/owner/page.tsx) |
| Driver (In-house) | `/driver` | [app/driver/page.tsx](app/driver/page.tsx) |
| Driver (Marketplace) | `/driver` | [app/driver/page.tsx](app/driver/page.tsx) |
| Customer | `/customer` | [app/customer/page.tsx](app/customer/page.tsx) |
| Admin | `/admin` | [app/admin/page.tsx](app/admin/page.tsx) - *Coming Soon* |

## Firestore Schema

### Users Collection
```
/users/{uid}
  - uid: string (Firebase Auth UID)
  - email: string
  - role: UserRole
  - displayName: string
  - businessIds: string[] (all associated businesses)
  - activeBusinessId: string (current context)
  - allowedBusinessIds: string[] (explicit permissions)
  - createdAt: timestamp
  - updatedAt: timestamp
```

### Businesses Collection
```
/businesses/{businessId}
  - businessId: string (unique ID)
  - name: string
  - type: BusinessType
  - tier: SubscriptionTier
  - customDomain: string (e.g., "chinawok.com")
  - subscriptionStatus: SubscriptionStatus
  - brandColors: { primary, secondary }
  - features: { delivery, pickup, loyalty, marketing, ... }
  - monthlyRevenue: number
  - totalOrders: number
  - customerCount: number
  - maxInhouseDrivers: number
  - inHouseDriverIds: string[]
  - createdAt: timestamp
  - updatedAt: timestamp
```

### Locations Collection
```
/locations/{businessId}/locations/{locationId}
  - locationId: string
  - businessId: string
  - name: string
  - address: string
  - hours: { monday: { open, close }, ... }
  - timezone: string
  - driverIds: string[]
  - createdAt: timestamp
  - updatedAt: timestamp
```

### Drivers Collection
```
/drivers/{businessId}/drivers/{driverId}
  - driverId: string
  - businessId: string
  - userId: string (Firebase Auth UID)
  - driverType: 'inhouse' | 'marketplace'
  - vehicle: { make, model, color, plate }
  - status: DriverStatus
  - rating: number (1-5)
  - earnings: number
  - createdAt: timestamp
  - updatedAt: timestamp
```

### Customers Collection
```
/customers/{businessId}/customers/{customerId}
  - customerId: string
  - businessId: string
  - userId: string | null (if registered)
  - email: string
  - phone: string
  - loyaltyPoints: number
  - orders: string[] (order IDs)
  - savedAddresses: Address[]
  - subscriptions: string[]
  - createdAt: timestamp
  - updatedAt: timestamp
```

### Orders Collection
```
/orders/{orderId}
  - orderId: string
  - businessId: string
  - customerId: string
  - items: OrderItem[]
  - pricing: { subtotal, tax, delivery, discount, total }
  - deliveryType: 'delivery' | 'pickup' | 'shipping'
  - status: OrderStatus
  - driverAssignment: { driverId, driverType, assignedAt, pickedUpAt, deliveredAt }
  - timing: { createdAt, readyAt, eta }
  - location: { address, coordinates, instructions }
  - createdAt: timestamp
  - updatedAt: timestamp
```

## Role-Based Access Control

**PERMISSIONS** constant in `lib/types.ts`:

```typescript
PERMISSIONS: {
  owner: {
    canManageBusiness: true,
    canViewOrders: true,
    canManageDrivers: true,
    canManageMenu: true,
    canViewAnalytics: true,
    canManageMarketing: true,
    canManageLoyalty: true,
  },
  manager: {
    canManageBusiness: false,
    canViewOrders: true,
    canManageDrivers: true,
    canManageMenu: true,
    canViewAnalytics: true,
    canManageMarketing: false,
    canManageLoyalty: false,
  },
  driver_inhouse: {
    canManageBusiness: false,
    canViewOrders: false,
    canManageDrivers: false,
    canManageMenu: false,
    canViewAnalytics: false,
    canManageMarketing: false,
    canManageLoyalty: false,
  },
  customer: {
    canPlaceOrders: true,
    canViewOwnOrders: true,
    canViewLoyaltyPoints: true,
  },
}
```

## Demo Credentials

Pre-configured test users for development:

| Email | Password | Role | Business |
|-------|----------|------|----------|
| owner@example.com | Demo123!@# | Owner | China Wok Restaurant |
| driver@example.com | Demo123!@# | Driver (In-house) | China Wok Restaurant |
| customer@example.com | Demo123!@# | Customer | N/A |

**Note**: These are created via `seedFirestore.ts` script

## Setting Up Demo Data

Run the seeding script:

```bash
npm run seed
```

This creates:
- 2 demo businesses (Restaurant + Convenience Store)
- 3 demo users (Owner, Driver, Customer)
- Firebase Auth accounts
- Firestore document structure

## Using AuthContext in Components

### Example: Owner Dashboard

```typescript
'use client';

import { useAuth } from '@/context/AuthContext';

export default function OwnerDashboard() {
  const { user, loclUser, currentBusiness, isOwner, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  
  if (!isOwner()) return <div>Access Denied</div>;

  return (
    <div>
      <h1>{currentBusiness?.name}</h1>
      <p>Owner: {user?.email}</p>
      {/* Dashboard content */}
    </div>
  );
}
```

### Example: Protected Route

```typescript
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { user, isOwner, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isOwner())) {
      router.push('/login');
    }
  }, [user, loading, isOwner, router]);

  return <div>Protected content for owners only</div>;
}
```

## Feature Flags by Subscription Tier

### Starter Tier
- Basic ordering
- Delivery & Pickup
- No loyalty program
- No marketing tools

### Partner Tier
- Everything in Starter
- Delivery with driver management
- Loyalty program
- Marketing email/SMS
- Analytics dashboard

### Agency Tier
- Everything in Partner
- Multi-location support
- Advanced driver network
- Custom integrations
- API access

### Reseller Tier
- Everything in Agency
- Create sub-accounts
- White-label dashboard
- Full branding control

## Security Considerations

### 1. **Authentication**
- Firebase Auth handles secure credential storage
- Session tokens automatically managed
- Browser local persistence enabled

### 2. **Authorization**
- Role checks on every protected page
- Permission constants define access control
- Business context validates data isolation

### 3. **Data Isolation**
- Firestore rules enforce businessId isolation
- Queries scoped to active business
- Cross-business data access prohibited

### 4. **Domain Security**
- Middleware validates custom domains
- Rogue domain requests rejected
- Business context verified on each request

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read their own profile
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId;
    }

    // Business data - scoped by businessId
    match /businesses/{businessId} {
      allow read: if request.auth.uid in resource.data.ownerIds;
      allow write: if request.auth.uid in resource.data.ownerIds;

      // Sub-collections scoped to business
      match /{document=**} {
        allow read: if get(/databases/$(database)/documents/businesses/$(businessId)).data.ownerIds.contains(request.auth.uid);
        allow write: if get(/databases/$(database)/documents/businesses/$(businessId)).data.ownerIds.contains(request.auth.uid);
      }
    }

    // Customers can only see their own data
    match /customers/{businessId}/customers/{customerId} {
      allow read: if request.auth.uid == resource.data.userId;
      allow write: if request.auth.uid == resource.data.userId;
    }
  }
}
```

## Next Steps

1. **Customer Registration Page** - Create `/register` with role selection
2. **Business Onboarding** - Wizard to create first business (owners)
3. **Driver Assignment** - Owner assigns drivers to businesses
4. **Menu Management** - Owners can upload/manage menu items
5. **Order System** - Customers can place orders, owners fulfill
6. **Real-Time Tracking** - GPS tracking for deliveries
7. **Payment Integration** - Stripe integration for payments

## Files Summary

| File | Purpose |
|------|---------|
| `middleware.ts` | Domain-based routing and request context |
| `lib/types.ts` | TypeScript type definitions (400+ lines) |
| `context/AuthContext.tsx` | Auth state management (235 lines) |
| `app/dashboard/page.tsx` | Role-based routing to dashboards |
| `app/owner/page.tsx` | Owner dashboard |
| `app/driver/page.tsx` | Driver dashboard |
| `app/customer/page.tsx` | Customer dashboard |
| `app/login/page.tsx` | Login page with role detection |
| `app/logout/page.tsx` | Logout handler |
| `scripts/seedFirestore.ts` | Demo data seeding |
