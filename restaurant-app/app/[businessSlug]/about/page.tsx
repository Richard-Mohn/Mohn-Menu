/**
 * Tenant About Page — /{businessSlug}/about
 * 
 * Server-rendered about page with custom content from WebsiteBuilder.
 */

import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { MohnMenuBusiness } from '@/lib/types';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { getServerBasePath } from '@/lib/tenant-links';

async function getBusinessBySlug(slug: string): Promise<MohnMenuBusiness | null> {
  try {
    const businessesRef = collection(db, 'businesses');
    const q = query(businessesRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return snapshot.docs[0].data() as MohnMenuBusiness;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ businessSlug: string }>;
}): Promise<Metadata> {
  const { businessSlug } = await params;
  const business = await getBusinessBySlug(businessSlug);
  if (!business) return { title: 'Not Found' };
  
  return {
    title: `About ${business.name} | ${business.city}, ${business.state}`,
    description: business.website?.content?.aboutContent || `Learn more about ${business.name} in ${business.city}, ${business.state}.`,
    robots: { index: true, follow: true },
  };
}

export default async function TenantAboutPage({
  params,
}: {
  params: Promise<{ businessSlug: string }>;
}) {
  const { businessSlug } = await params;
  const business = await getBusinessBySlug(businessSlug);
  const headersList = await headers();
  const basePath = getServerBasePath(businessSlug, headersList.get('x-custom-domain'));
  
  if (!business || !business.website?.enabled) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-4xl font-black">Page Not Found</h1>
      </div>
    );
  }

  const content = business.website.content || {};

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="pt-20 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <p className="text-sm font-black uppercase tracking-widest text-indigo-600 mb-4">About Us</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-black mb-8">
            {content.aboutTitle || `About ${business.name}`}
          </h1>
        </div>
      </section>

      {/* About Content */}
      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-zinc-600 leading-relaxed mb-12">
              {content.aboutContent || business.description || `${business.name} is a proud local business serving ${business.city}, ${business.state} and the surrounding communities.`}
            </p>
          </div>

          {/* Mission */}
          {content.aboutMission && (
            <div className="bg-zinc-50 rounded-3xl p-10 mb-12 border border-zinc-100">
              <h2 className="text-2xl font-black text-black mb-4">Our Mission</h2>
              <p className="text-zinc-600 text-lg leading-relaxed">{content.aboutMission}</p>
            </div>
          )}

          {/* Values */}
          {content.aboutValues && (
            <div className="bg-zinc-900 text-white rounded-3xl p-10 mb-12">
              <h2 className="text-2xl font-black mb-4">Our Values</h2>
              <p className="text-zinc-300 text-lg leading-relaxed">{content.aboutValues}</p>
            </div>
          )}

          {/* Location Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            <div className="bg-zinc-50 rounded-3xl p-8 border border-zinc-100">
              <h3 className="text-lg font-black text-black mb-4">Location</h3>
              <p className="text-zinc-600">
                {business.address}<br />
                {business.city}, {business.state} {business.zipCode}
              </p>
            </div>
            <div className="bg-zinc-50 rounded-3xl p-8 border border-zinc-100">
              <h3 className="text-lg font-black text-black mb-4">Contact</h3>
              <p className="text-zinc-600">
                {business.businessPhone && <span>{business.businessPhone}<br /></span>}
                {business.ownerEmail}
              </p>
            </div>
          </div>

          {/* Back Link */}
          <div className="mt-16">
            <a 
              href={basePath || '/'}
              className="text-indigo-600 font-bold hover:underline"
            >
              ← Back to {business.name}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
