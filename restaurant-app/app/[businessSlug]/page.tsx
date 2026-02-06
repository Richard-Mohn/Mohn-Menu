/**
 * Tenant Homepage — /{businessSlug}
 * 
 * Full SEO-optimized homepage for a tenant's auto-generated website.
 * Server-rendered on demand from Firestore data.
 * Changes in the Website Builder are instantly live.
 */

import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { MohnMenuBusiness } from '@/lib/types';
import { SERVICE_INFO } from '@/lib/types';
import { headers } from 'next/headers';
import { getServerBasePath, getServerOrderPath } from '@/lib/tenant-links';
import TenantHeroActions from '@/components/TenantHeroActions';

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

export default async function TenantHomePage({
  params,
}: {
  params: Promise<{ businessSlug: string }>;
}) {
  const { businessSlug } = await params;
  const business = await getBusinessBySlug(businessSlug);
  const headersList = await headers();
  const customDomainHeader = headersList.get('x-custom-domain');
  
  if (!business || !business.website?.enabled) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-black mb-4">404</h1>
          <p className="text-zinc-500">This business website is not available.</p>
        </div>
      </div>
    );
  }

  const basePath = getServerBasePath(businessSlug, customDomainHeader);
  const orderPath = getServerOrderPath(businessSlug, customDomainHeader);
  const website = business.website;
  const content = website.content || {};

  return (
    <div className="bg-white">
      {/* ─── Hero Section ──────────────────────────────────────── */}
      <section className="relative pt-20 pb-32 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl relative z-10 text-center">
          <p className="text-sm font-black uppercase tracking-widest text-indigo-600 mb-6">
            {content.tagline || `Welcome to ${business.name}`}
          </p>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-black mb-8 leading-[0.9]">
            {content.heroTitle || business.name}
          </h1>
          
          <p className="text-xl md:text-2xl text-zinc-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            {content.heroSubtitle || business.description || `Serving the best food in ${business.city}, ${business.state}`}
          </p>

          <TenantHeroActions
            business={business}
            orderPath={orderPath}
            menuPath={`${basePath}/menu`}
          />
        </div>

        {/* Decorative background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none opacity-20">
          <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-100 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-100 rounded-full blur-[150px]" />
        </div>
      </section>

      {/* ─── Services Section ──────────────────────────────────── */}
      {website.selectedServices && website.selectedServices.length > 0 && (
        <section className="py-24 px-4 bg-zinc-50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-black mb-4">
                Our Services
              </h2>
              <p className="text-lg text-zinc-500 max-w-xl mx-auto">
                Everything you need, all in one place.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {website.selectedServices.map((serviceKey) => {
                const info = SERVICE_INFO[serviceKey];
                if (!info) return null;
                const customDesc = content.serviceDescriptions?.[serviceKey];
                
                return (
                  <a
                    key={serviceKey}
                    href={`${basePath}/services/${serviceKey}`}
                    className="group bg-white p-8 rounded-3xl border border-zinc-200 hover:border-black transition-all duration-500"
                  >
                    <h3 className="text-xl font-bold text-black mb-3 group-hover:text-indigo-600 transition-colors">
                      {info.label}
                    </h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">
                      {customDesc || info.description}
                    </p>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── How It Works ──────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-black mb-4">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-black text-indigo-600">
                1
              </div>
              <h3 className="text-xl font-bold mb-3">Browse & Order</h3>
              <p className="text-zinc-500">Browse our menu and place your order online in seconds.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-black text-indigo-600">
                2
              </div>
              <h3 className="text-xl font-bold mb-3">We Prepare It</h3>
              <p className="text-zinc-500">Your order is freshly prepared with care and quality ingredients.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-black text-indigo-600">
                3
              </div>
              <h3 className="text-xl font-bold mb-3">Enjoy!</h3>
              <p className="text-zinc-500">Pick up or get it delivered straight to your door with real-time tracking.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── About Preview ──────────────────────────────────────── */}
      {(content.aboutContent || content.aboutMission) && (
        <section className="py-24 px-4 bg-zinc-900 text-white">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
                  {content.aboutTitle || `About ${business.name}`}
                </h2>
                <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                  {content.aboutContent || business.description}
                </p>
                <a 
                  href={`${basePath}/about`}
                  className="inline-flex items-center gap-2 text-white font-bold border-b-2 border-white pb-1 hover:gap-4 transition-all"
                >
                  Learn more about us
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
              <div>
                {content.aboutMission && (
                  <div className="bg-zinc-800 p-8 rounded-3xl">
                    <h3 className="text-sm font-black uppercase tracking-widest text-indigo-400 mb-3">Our Mission</h3>
                    <p className="text-zinc-300 leading-relaxed">{content.aboutMission}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── Service Areas ──────────────────────────────────────── */}
      {website.selectedCities && website.selectedCities.length > 0 && (
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-black mb-4">
                Areas We Serve
              </h2>
              <p className="text-lg text-zinc-500">
                Proudly serving these communities.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {website.selectedCities.map((city) => {
                const state = website.selectedStates?.[0] || business.state;
                const locationSlug = `${city.toLowerCase().replace(/\s+/g, '-')}-${state.toLowerCase()}`;
                return (
                  <a
                    key={city}
                    href={`${basePath}/${locationSlug}`}
                    className="px-6 py-3 bg-zinc-100 rounded-full text-sm font-bold text-zinc-700 hover:bg-black hover:text-white transition-all"
                  >
                    {city}, {state}
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA Section ──────────────────────────────────────── */}
      <section className="py-24 px-4 bg-black text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
            Ready to Order?
          </h2>
          <p className="text-xl text-zinc-400 mb-10 max-w-xl mx-auto">
            Fresh food, fast service, and real-time tracking. What are you waiting for?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {business.settings?.orderingEnabled && (
              <a 
                href={orderPath}
                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-full font-bold text-lg hover:bg-zinc-200 transition-all"
              >
                Order Online
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            )}
            <a 
              href={`${basePath}/menu`}
              className="inline-flex items-center gap-3 px-10 py-5 border-2 border-zinc-700 text-white rounded-full font-bold text-lg hover:border-white transition-all"
            >
              View Full Menu
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
