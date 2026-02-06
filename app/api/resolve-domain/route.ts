/**
 * Domain Resolution API
 * 
 * Maps custom domains to business slugs.
 * GET /api/resolve-domain?domain=chinawok.com → { slug: "china-wok" }
 * 
 * Uses in-memory cache with 5-minute TTL (resets on cold start).
 */

import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// In-memory cache: domain → { slug, cachedAt }
const domainCache = new Map<string, { slug: string; cachedAt: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get('domain');
  
  if (!domain) {
    return NextResponse.json({ error: 'Missing domain parameter' }, { status: 400 });
  }

  // Check cache first
  const cached = domainCache.get(domain);
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL) {
    return NextResponse.json({ slug: cached.slug });
  }

  try {
    // Query Firestore for business with this custom domain
    const businessesRef = collection(db, 'businesses');
    const q = query(
      businessesRef,
      where('website.customDomain', '==', domain),
      where('website.customDomainEnabled', '==', true)
    );
    
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const business = snapshot.docs[0].data();
      const slug = business.slug;
      
      // Cache the result
      domainCache.set(domain, { slug, cachedAt: Date.now() });
      
      return NextResponse.json({ slug });
    }

    // Fallback: try without www. prefix
    if (domain.startsWith('www.')) {
      const bareDomain = domain.replace('www.', '');
      const q2 = query(
        businessesRef,
        where('website.customDomain', '==', bareDomain),
        where('website.customDomainEnabled', '==', true)
      );
      
      const snapshot2 = await getDocs(q2);
      
      if (!snapshot2.empty) {
        const business = snapshot2.docs[0].data();
        const slug = business.slug;
        
        domainCache.set(domain, { slug, cachedAt: Date.now() });
        return NextResponse.json({ slug });
      }
    }

    return NextResponse.json({ error: 'Domain not found' }, { status: 404 });
  } catch (error) {
    console.error('Domain resolution error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
