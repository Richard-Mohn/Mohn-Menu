/**
 * Tenant Contact Page — /{businessSlug}/contact
 * 
 * Server-rendered contact page with business hours, phone, email, address.
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
    title: `Contact ${business.name} | ${business.city}, ${business.state}`,
    description: `Get in touch with ${business.name}. Call, email, or visit us in ${business.city}, ${business.state}.`,
    robots: { index: true, follow: true },
  };
}

export default async function TenantContactPage({
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
      <section className="pt-20 pb-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <p className="text-sm font-black uppercase tracking-widest text-indigo-600 mb-4">Get In Touch</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-black mb-8">
            {content.contactTitle || `Contact ${business.name}`}
          </h1>
          
          {content.contactContent && (
            <p className="text-xl text-zinc-500 leading-relaxed mb-16 max-w-2xl">
              {content.contactContent}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Address */}
            <div className="bg-zinc-50 rounded-3xl p-8 border border-zinc-100">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 text-xl border border-zinc-100">
                📍
              </div>
              <h3 className="text-lg font-black text-black mb-3">Visit Us</h3>
              <p className="text-zinc-600 leading-relaxed">
                {business.address}<br />
                {business.city}, {business.state} {business.zipCode}
              </p>
            </div>

            {/* Phone */}
            <div className="bg-zinc-50 rounded-3xl p-8 border border-zinc-100">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 text-xl border border-zinc-100">
                📞
              </div>
              <h3 className="text-lg font-black text-black mb-3">Call Us</h3>
              <p className="text-zinc-600">
                {business.businessPhone || business.ownerPhone || 'Contact us for our phone number'}
              </p>
            </div>

            {/* Email */}
            <div className="bg-zinc-50 rounded-3xl p-8 border border-zinc-100">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 text-xl border border-zinc-100">
                ✉️
              </div>
              <h3 className="text-lg font-black text-black mb-3">Email Us</h3>
              <p className="text-zinc-600">
                <a href={`mailto:${business.ownerEmail}`} className="text-indigo-600 font-bold hover:underline">
                  {business.ownerEmail}
                </a>
              </p>
            </div>

            {/* Business Hours */}
            <div className="bg-zinc-50 rounded-3xl p-8 border border-zinc-100">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 text-xl border border-zinc-100">
                🕐
              </div>
              <h3 className="text-lg font-black text-black mb-3">Hours</h3>
              <p className="text-zinc-600 whitespace-pre-line">
                {content.businessHours || 'Contact us for our business hours'}
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
