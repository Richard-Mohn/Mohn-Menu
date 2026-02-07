/**
 * Domain Search API — DomainNameAPI
 *
 * GET  /api/domains/search?domain=mybusiness.com         — Check single domain
 * GET  /api/domains/search?keyword=mybusiness&limit=10   — Keyword search across TLDs
 * POST /api/domains/search { domains: ["a.com","b.com"] } — Bulk check
 *
 * All results return flat $14.99/yr pricing + competitor comparison data.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  checkDomainAvailability,
  checkKeywordAvailability,
  checkBulkAvailability,
  getCompetitorComparison,
  getDomainPrice,
} from '@/lib/domain-registrar';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get('domain');
  const keyword = searchParams.get('keyword');
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    const pricing = getDomainPrice();
    const competitors = getCompetitorComparison();

    // Single domain availability check
    if (domain) {
      const result = await checkDomainAvailability(domain);

      // Also get keyword suggestions from the domain's SLD
      const sld = domain.split('.')[0];
      const suggestions = sld
        ? await checkKeywordAvailability(sld, undefined, 8)
        : [];

      // Merge — put exact check first, then suggestions (excluding duplicates)
      const allResults = [result];
      for (const s of suggestions) {
        if (s.domain !== result.domain) {
          allResults.push(s);
        }
      }

      return NextResponse.json({
        results: allResults,
        primary: result,
        pricing,
        competitors,
      });
    }

    // Keyword-based search across popular TLDs
    if (keyword) {
      const results = await checkKeywordAvailability(keyword, undefined, limit);
      return NextResponse.json({
        suggestions: results,
        pricing,
        competitors,
      });
    }

    return NextResponse.json(
      { error: 'Provide either ?domain= or ?keyword= parameter' },
      { status: 400 },
    );
  } catch (error) {
    console.error('Domain search error:', error);
    const msg = error instanceof Error ? error.message : 'Domain search failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domains } = body;

    if (!domains || !Array.isArray(domains) || domains.length === 0) {
      return NextResponse.json(
        { error: 'Provide an array of domains to check' },
        { status: 400 },
      );
    }

    if (domains.length > 50) {
      return NextResponse.json(
        { error: 'Maximum 50 domains per request' },
        { status: 400 },
      );
    }

    const results = await checkBulkAvailability(domains);
    const pricing = getDomainPrice();
    const competitors = getCompetitorComparison();

    return NextResponse.json({ domains: results, pricing, competitors });
  } catch (error) {
    console.error('Bulk domain search error:', error);
    const msg = error instanceof Error ? error.message : 'Bulk search failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
