/**
 * Tenant Menu Page — /{businessSlug}/menu
 * 
 * Public-facing, SEO-friendly menu display for a tenant.
 * Server-rendered for search engines, links to the full order page.
 * Uses interactive client-side category filtering (not scroll-to-section).
 */

import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { MohnMenuBusiness } from '@/lib/types';
import { headers } from 'next/headers';
import { getServerBasePath, getServerOrderPath } from '@/lib/tenant-links';
import type { Metadata } from 'next';
import MenuBrowser from '@/components/MenuBrowser';

// ─── Types ──────────────────────────────────────────────────

interface RawMenuItem {
  id: string;
  category: string;
  name: string;
  description: string;
  prices: Record<string, number>;
  image_url?: string;
  isSpicy?: boolean;
  popular?: boolean;
  orderCount?: number;
  reviewCount?: number;
  averageRating?: number;
  stock?: number | null;
}

// ─── Data Fetching ──────────────────────────────────────────

async function getBusinessBySlug(slug: string): Promise<(MohnMenuBusiness & { businessId: string }) | null> {
  try {
    const businessesRef = collection(db, 'businesses');
    const q = query(businessesRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return { ...snapshot.docs[0].data(), businessId: snapshot.docs[0].id } as MohnMenuBusiness & { businessId: string };
  } catch {
    return null;
  }
}

async function getMenuItems(businessId: string): Promise<RawMenuItem[]> {
  try {
    const itemsRef = collection(db, 'businesses', businessId, 'menuItems');
    const q = query(itemsRef, orderBy('category'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map(d => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = d.data() as any;
        let prices: Record<string, number> = data.prices;
        if (!prices || typeof prices !== 'object' || Object.keys(prices).length === 0) {
          prices = { order: Number(data.price) || 0 };
        }
        return {
          id: d.id,
          category: data.category || '',
          name: data.name || '',
          description: data.description || '',
          prices,
          image_url: data.image_url || data.image,
          isSpicy: data.isSpicy || data.spicy,
          popular: data.popular,
          orderCount: data.orderCount,
          reviewCount: data.reviewCount,
          averageRating: data.averageRating,
          stock: data.stock ?? null,
        } as RawMenuItem;
      });
    }
  } catch {
    // fall through
  }

  // Fallback: static menu.json (for demo / initial setup)
  try {
    const menuData = await import('@/data/menu.json');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = menuData.default as any[];
    return raw.map(item => ({
      id: String(item.id),
      category: String(item.category || ''),
      name: String(item.name || ''),
      description: String(item.description || ''),
      prices: Object.fromEntries(
        Object.entries(item.prices || {}).filter(([, v]) => v != null)
      ) as Record<string, number>,
      image_url: item.image_url,
      isSpicy: item.isSpicy,
      popular: item.popular,
    }));
  } catch {
    return [];
  }
}

// ─── SEO Metadata ───────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ businessSlug: string }>;
}): Promise<Metadata> {
  const { businessSlug } = await params;
  const business = await getBusinessBySlug(businessSlug);
  if (!business) return { title: 'Menu Not Found' };

  return {
    title: `Menu | ${business.name} — ${business.city}, ${business.state}`,
    description: `Browse the full menu from ${business.name}. ${business.description || `Fresh food in ${business.city}, ${business.state}. Order online for delivery or pickup.`}`,
    keywords: [`${business.name} menu`, `${business.city} food`, 'online ordering', 'delivery', 'takeout'],
  };
}

// ─── Page Component ─────────────────────────────────────────

export default async function TenantMenuPage({
  params,
}: {
  params: Promise<{ businessSlug: string }>;
}) {
  const { businessSlug } = await params;
  const business = await getBusinessBySlug(businessSlug);
  const headersList = await headers();
  const customDomainHeader = headersList.get('x-custom-domain');

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-6xl font-black mb-4">404</h1>
          <p className="text-zinc-500">Menu not found.</p>
        </div>
      </div>
    );
  }

  const orderPath = getServerOrderPath(businessSlug, customDomainHeader);
  const menuItems = await getMenuItems(business.businessId);
  const showStats = business.settings?.showMenuStats !== false;

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="pt-20 pb-8 px-4 bg-zinc-50 border-b border-zinc-200">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-black mb-4">
            Our Menu
          </h1>
          <p className="text-lg text-zinc-500 max-w-xl mx-auto mb-6">
            {business.description || `Explore our full menu. Order online for delivery or pickup.`}
          </p>
          {business.settings?.orderingEnabled && (
            <a
              href={orderPath}
              className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white rounded-full font-bold text-lg hover:bg-zinc-800 transition-all shadow-xl"
            >
              Order Online Now
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          )}
        </div>
      </section>

      {/* Interactive Menu Browser */}
      <MenuBrowser
        items={menuItems}
        orderPath={orderPath}
        orderingEnabled={business.settings?.orderingEnabled !== false}
        showStats={showStats}
      />
    </div>
  );
}
