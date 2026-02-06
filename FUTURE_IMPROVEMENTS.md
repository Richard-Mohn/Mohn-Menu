# Golden Dragon - Future Improvements & Best Practices

## 🚀 Recommended Enhancements

### Phase 1: Robustness & Monitoring (Weeks 1-2)

#### 1. Add Error Boundaries
```typescript
// app/error.tsx
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error tracking service (Sentry, etc.)
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="text-center">
        <h2 className="text-2xl font-black mb-4">Oops! Something went wrong</h2>
        <p className="text-zinc-500 mb-8">{error.message}</p>
        <button
          onClick={() => reset()}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
```

#### 2. Add Web Vitals Monitoring
```typescript
// lib/analytics.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export function reportWebVitals(metric: any) {
  // Send to your analytics backend
  console.log(metric);
  
  // Example: send to external service
  // fetch('/api/analytics', { method: 'POST', body: JSON.stringify(metric) })
}

// Apply in app/layout.tsx
import { reportWebVitals } from '@/lib/analytics';

useEffect(() => {
  reportWebVitals();
}, []);
```

#### 3. Add Environment Variable Validation
```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
});
```

---

### Phase 2: Data Validation & Constants (Weeks 2-3)

#### 1. Create Shared Constants
```typescript
// lib/constants.ts
export const Collections = {
  MENU_ITEMS: 'menuItems',
  ORDERS: 'orders',
  USERS: 'users',
  LOYALTY_PROGRAMS: 'loyaltyPrograms',
  FEEDBACK: 'feedback',
  DRIVERS: 'drivers',
} as const;

export const OrderStatus = {
  PENDING_PAYMENT: 'Pending Payment',
  RECEIVED: 'Received',
  PREPARING: 'Preparing',
  COOKING: 'Cooking',
  QUALITY_CHECK: 'Quality Check',
  READY: 'Ready',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
} as const;

export const UserRoles = {
  CUSTOMER: 'customer',
  STAFF: 'staff',
  OWNER: 'owner',
  DRIVER: 'driver',
} as const;
```

#### 2. Add Zod Schemas for Firestore Data
```typescript
// lib/schemas.ts
import { z } from 'zod';

export const MenuItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Item name required'),
  description: z.string(),
  prices: z.record(z.number().positive('Price must be positive')),
  category: z.string(),
  image_url: z.string().url('Invalid image URL'),
  availability: z.boolean().default(true),
  isSpicy: z.boolean().optional(),
  combo_includes: z.string().optional(),
});

export const OrderSchema = z.object({
  customerInfo: z.object({
    uid: z.string().nullable(),
    name: z.string(),
    email: z.string().email(),
    address: z.string().nullable(),
  }),
  items: z.array(z.any()), // CartItem[]
  totalAmount: z.number().positive(),
  orderType: z.enum(['pickup', 'delivery']),
  currentStatus: z.string(),
  paymentStatus: z.enum(['pending', 'completed', 'failed']),
  createdAt: z.any(), // Timestamp
});

export type MenuItem = z.infer<typeof MenuItemSchema>;
export type Order = z.infer<typeof OrderSchema>;
```

#### 3. Use Schemas in Data Fetching
```typescript
// In menu/page.tsx
const items = querySnapshot.docs.map(doc => 
  MenuItemSchema.parse({
    id: doc.id,
    ...doc.data()
  })
);
```

---

### Phase 3: Performance Optimization (Weeks 3-4)

#### 1. Add Image Optimization Hints
```typescript
// Update next.config.ts
const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Currently needed for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
    deviceSizes: [320, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};
```

#### 2. Implement Lazy Loading for Components
```typescript
// app/menu/page.tsx
import dynamic from 'next/dynamic';

const MenuItemCard = dynamic(() => import('@/components/MenuItemCard'), {
  loading: () => <div className="h-48 bg-zinc-200 rounded-2xl animate-pulse" />,
});
```

#### 3. Add Caching Headers
```typescript
// In server components
export const revalidate = 3600; // Revalidate every hour
export const dynamic = 'auto'; // Use ISR when possible
```

---

### Phase 4: Testing & QA (Weeks 4-5)

#### 1. Add Unit Tests (Vitest)
```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

```typescript
// components/__tests__/MenuItemCard.test.tsx
import { render, screen } from '@testing-library/react';
import MenuItemCard from '../MenuItemCard';

describe('MenuItemCard', () => {
  const mockItem = {
    id: '1',
    name: 'Test Item',
    description: 'Test Description',
    prices: { default: 10 },
    category: 'Test',
    image_url: 'https://example.com/image.jpg',
    availability: true,
  };

  it('renders item name', () => {
    render(<MenuItemCard item={mockItem} isCompact={false} />);
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  it('displays price correctly', () => {
    render(<MenuItemCard item={mockItem} isCompact={false} />);
    expect(screen.getByText('$10.00')).toBeInTheDocument();
  });
});
```

#### 2. Add E2E Tests (Playwright)
```bash
npm install --save-dev @playwright/test
```

```typescript
// e2e/checkout.spec.ts
import { test, expect } from '@playwright/test';

test('complete checkout flow', async ({ page }) => {
  await page.goto('/menu');
  
  // Add item to cart
  await page.click('text=Add to Bag');
  await page.click('button:has-text("Detailed")');
  
  // Go to cart
  await page.click('[aria-label="Cart"]');
  
  // Verify cart contents
  expect(await page.isVisible('text=Your Order')).toBeTruthy();
});
```

---

### Phase 5: Premium Features (Weeks 5+)

#### 1. Chef's Eye Live Cam Integration
```typescript
// components/ChefEyeViewer.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function ChefEyeViewer({ orderId }: { orderId: string }) {
  const { profile } = useAuth();
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // Check if customer paid for Chef's Eye
    // Generate time-limited YouTube stream URL
    // Stream only available for 30 minutes after order placed
  }, [orderId, profile]);

  if (!hasAccess) {
    return (
      <div className="bg-zinc-900 rounded-2xl p-8 text-center">
        <p className="text-white mb-4">Upgrade to Chef's Eye for $2.99</p>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl">
          Watch Your Meal Being Prepared
        </button>
      </div>
    );
  }

  return (
    <iframe
      src={streamUrl}
      className="w-full aspect-video rounded-2xl"
      allowFullScreen
    />
  );
}
```

#### 2. GPS Delivery Tracking
```typescript
// components/DeliveryMap.tsx (already exists - enhance with real-time updates)
useEffect(() => {
  // Listen to driver location updates
  const unsubscribe = onSnapshot(
    doc(db, 'deliveries', orderId),
    (snapshot) => {
      const delivery = snapshot.data();
      if (delivery?.driverLocation) {
        setDriverLocation({
          lat: delivery.driverLocation.latitude,
          lng: delivery.driverLocation.longitude,
        });
      }
    }
  );
  
  return unsubscribe;
}, [orderId]);
```

#### 3. Loyalty Program Dashboard
```typescript
// app/loyalty/page.tsx
export default function LoyaltyPage() {
  const { profile } = useAuth();
  
  return (
    <div>
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white">
        <h1 className="text-3xl font-black mb-2">Dragon Rewards</h1>
        <p className="text-2xl font-bold">{profile?.loyaltyPoints} Points</p>
      </div>
      
      {/* Tier progression */}
      {/* Rewards marketplace */}
      {/* Referral program */}
    </div>
  );
}
```

---

## 📊 Monitoring & Analytics Setup

### Recommended Tools
1. **Error Tracking:** Sentry or Rollbar
2. **Analytics:** Mixpanel or Segment
3. **Performance:** Web Vitals, Datadog
4. **Uptime:** Pingdom or Uptime Robot

### Key Metrics to Track
```typescript
// Events to track
- page_view
- menu_viewed
- item_clicked
- cart_item_added
- checkout_started
- payment_completed
- order_placed
- order_delivered
- feature_upgraded
```

---

## 🔒 Security Hardening

### 1. Add Rate Limiting to API Routes
```typescript
// lib/rateLimit.ts
import Ratelimit from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 h'),
});

export async function checkRateLimit(userId: string) {
  const { success } = await ratelimit.limit(userId);
  return success;
}
```

### 2. Validate All User Input
```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Sanitize headers
  // Validate origin
  // Check authentication
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
```

### 3. Implement CSRF Protection
```typescript
// lib/csrf.ts
import { randomBytes } from 'crypto';

export function generateCsrfToken() {
  return randomBytes(32).toString('hex');
}

export function validateCsrfToken(token: string, sessionToken: string) {
  return token === sessionToken;
}
```

---

## 📈 Growth Roadmap

### Quarter 1 (Now - March 2026)
- ✅ Refactor codebase (COMPLETED)
- Implement error monitoring
- Add analytics tracking
- Deploy premium features MVP

### Quarter 2 (April - June 2026)
- Launch Chef's Eye Live Cam
- Implement loyalty program
- Add GPS delivery tracking
- Mobile app development

### Quarter 3 (July - September 2026)
- AI-powered recommendations
- Advanced customization options
- Subscription plans
- Restaurant analytics dashboard

### Quarter 4 (October - December 2026)
- Multi-location support
- Franchise onboarding
- International expansion
- White-label SaaS platform

---

## 🎓 Code Style Guide

### Naming Conventions
```typescript
// Components: PascalCase
export const MenuItemCard = () => {};

// Functions: camelCase
const calculateTotal = (items: CartItem[]) => {};

// Constants: UPPER_SNAKE_CASE
const MAX_CART_ITEMS = 100;

// Types/Interfaces: PascalCase
interface MenuItem { }
type OrderStatus = 'pending' | 'completed';
```

### Import Organization
```typescript
// 1. External libraries
import { useState } from 'react';
import Link from 'next/link';

// 2. Internal utilities
import { db } from '@/lib/firebase';
import { OrderSchema } from '@/lib/schemas';

// 3. Components
import Header from '@/components/Header';

// 4. Styles
import './styles.css';
```

### Component Structure
```typescript
// 1. Imports
// 2. Types/Interfaces
// 3. Styled components (if any)
// 4. Main component
// 5. Sub-components (if any)
// 6. Export
```

---

## 🏆 Success Metrics

Track these to measure improvement:

### Performance
- Lighthouse score: Target 90+
- First Contentful Paint (FCP): <1.8s
- Largest Contentful Paint (LCP): <2.5s
- Core Web Vitals: All green

### Business
- Order completion rate: >95%
- Average order value: Track increase
- Customer retention: >80%
- Premium feature adoption: >20%

### Technical
- Build time: <30 seconds
- Error rate: <0.1%
- Uptime: 99.9%
- Security score: A+ (SSL Labs)

---

## 📞 Support & Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Stripe Docs](https://stripe.com/docs)

### Community
- GitHub Discussions
- Stack Overflow
- Discord Communities
- Local React/TypeScript Meetups

---

**Last Updated:** February 2, 2026  
**Status:** Ready for Implementation  
**Estimated Time for Phase 1-2:** 2-3 weeks
