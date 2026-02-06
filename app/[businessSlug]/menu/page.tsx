/**
 * Tenant Menu Page — /{businessSlug}/menu
 * 
 * Public-facing, SEO-friendly menu display for a tenant.
 * Server-rendered for search engines, links to the full order page.
 * Shows all menu categories and items with prices.
 */

import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { MohnMenuBusiness } from '@/lib/types';
import { headers } from 'next/headers';
import { getServerBasePath, getServerOrderPath } from '@/lib/tenant-links';
import type { Metadata } from 'next';

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
        // Handle both schemas: `prices: {sm: 7.95}` or legacy `price: 7.95`
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

// ─── Price label helpers ────────────────────────────────────

const PRICE_LABELS: Record<string, string> = {
  sm: 'Sm', small: 'Sm', lg: 'Lg', large: 'Lg',
  pt: 'Pt', qt: 'Qt', order: '', half: 'Half', full: 'Full',
};

function formatPriceLabel(key: string): string {
  return PRICE_LABELS[key.toLowerCase()] || key.charAt(0).toUpperCase() + key.slice(1);
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

  const basePath = getServerBasePath(businessSlug, customDomainHeader);
  const orderPath = getServerOrderPath(businessSlug, customDomainHeader);
  const menuItems = await getMenuItems(business.businessId);

  // Group by category
  const categories: Record<string, RawMenuItem[]> = {};
  for (const item of menuItems) {
    if (!categories[item.category]) categories[item.category] = [];
    categories[item.category].push(item);
  }
  const categoryNames = Object.keys(categories);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="pt-20 pb-12 px-4 bg-zinc-50 border-b border-zinc-200">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-black mb-4">
            Our Menu
          </h1>
          <p className="text-lg text-zinc-500 max-w-xl mx-auto mb-8">
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

      {/* Category Quick Nav */}
      {categoryNames.length > 3 && (
        <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-zinc-200">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
              {categoryNames.map(cat => (
                <a
                  key={cat}
                  href={`#${cat.toLowerCase().replace(/\s+/g, '-')}`}
                  className="whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-bold bg-zinc-100 text-zinc-600 hover:bg-black hover:text-white transition-all"
                >
                  {cat}
                </a>
              ))}
            </div>
          </div>
        </nav>
      )}

      {/* Menu Sections */}
      <div className="container mx-auto max-w-6xl px-4 py-12">
        {categoryNames.map(category => (
          <section
            key={category}
            id={category.toLowerCase().replace(/\s+/g, '-')}
            className="mb-16 scroll-mt-20"
          >
            <h2 className="text-3xl font-black tracking-tight text-black mb-2">{category}</h2>
            <div className="h-1 w-16 bg-black rounded-full mb-8" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories[category].map(item => {
                const priceEntries = Object.entries(item.prices);
                const singlePrice = priceEntries.length === 1;

                return (
                  <div
                    key={item.id}
                    className="flex gap-4 bg-white border border-zinc-100 rounded-2xl p-4 hover:border-zinc-300 transition-colors"
                  >
                    {/* Image */}
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-20 h-20 rounded-xl object-cover shrink-0"
                        loading="lazy"
                      />
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-black text-sm leading-tight">
                          {item.name}
                          {item.isSpicy && <span className="text-red-500 ml-1">🌶</span>}
                          {item.popular && <span className="text-amber-500 ml-1">⭐</span>}
                        </h3>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{item.description}</p>
                      
                      {/* Prices */}
                      <div className="mt-2 flex flex-wrap gap-2">
                        {singlePrice ? (
                          <span className="text-sm font-black text-black">
                            ${priceEntries[0][1].toFixed(2)}
                          </span>
                        ) : (
                          priceEntries.map(([key, val]) => (
                            <span key={key} className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full font-bold">
                              {formatPriceLabel(key)} ${val.toFixed(2)}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Order CTA */}
      {business.settings?.orderingEnabled && (
        <section className="py-16 px-4 bg-black text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">
              Ready to Order?
            </h2>
            <p className="text-zinc-400 text-lg mb-8">
              Skip the wait. Order online and get it delivered or pick it up fresh.
            </p>
            <a
              href={orderPath}
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-full font-bold text-lg hover:bg-zinc-200 transition-all"
            >
              Start Your Order
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
