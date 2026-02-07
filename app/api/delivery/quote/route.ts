/**
 * Delivery Quote API — GET /api/delivery/quote
 * 
 * Gets delivery fee quotes from available third-party providers
 * (DoorDash Drive + Uber Direct) for the specified pickup/dropoff.
 * 
 * Query params: businessId, orderId, dropoffAddress, dropoffPhone, dropoffName
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyApiAuth } from '@/lib/apiAuth';
import { getDeliveryQuotes, getAvailableProviders, type DeliveryRequest } from '@/lib/deliveryProviders';
import { adminDb } from '@/lib/firebaseAdmin';

export async function GET(request: NextRequest) {
  const auth = await verifyApiAuth(request);
  if ('error' in auth) return auth.error;

  const { searchParams } = request.nextUrl;
  const businessId = searchParams.get('businessId');
  const dropoffAddress = searchParams.get('dropoffAddress');
  const dropoffPhone = searchParams.get('dropoffPhone') || '';
  const dropoffName = searchParams.get('dropoffName') || 'Customer';

  if (!businessId || !dropoffAddress) {
    return NextResponse.json({ error: 'businessId and dropoffAddress are required' }, { status: 400 });
  }

  try {
    // Get business info for pickup address
    const businessDoc = await adminDb.collection('businesses').doc(businessId).get();
    if (!businessDoc.exists) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const business = businessDoc.data()!;
    const pickupAddress = [business.address, business.city, business.state, business.zipCode]
      .filter(Boolean)
      .join(', ');

    // Check if business has third-party delivery enabled
    if (!business.settings?.thirdPartyDelivery?.enabled) {
      return NextResponse.json({
        quotes: [],
        available: ['community'],
        message: 'Third-party delivery not enabled for this business',
      });
    }

    const enabledProviders = business.settings.thirdPartyDelivery.providers || ['doordash', 'uber'];
    const available = getAvailableProviders().filter(
      (p) => p === 'community' || enabledProviders.includes(p)
    );

    const req: DeliveryRequest = {
      orderId: `quote-${Date.now()}`,
      businessId,
      pickupAddress,
      pickupPhone: business.businessPhone || business.ownerPhone || '',
      pickupBusinessName: business.name || 'Restaurant',
      dropoffAddress,
      dropoffPhone,
      dropoffName,
      orderValue: 0, // Not needed for quotes
      tip: 0,
      items: [],
    };

    const quotes = await getDeliveryQuotes(
      req,
      available.filter((p): p is 'doordash' | 'uber' => p !== 'community'),
    );

    // Add community courier option with the business's configured delivery fee
    const deliveryFee = business.settings?.pricing?.deliveryFee || 3.99;
    quotes.push({
      provider: 'community',
      fee: Math.round(deliveryFee * 100), // Convert to cents
      estimatedMinutes: 30,
      quoteId: 'community',
      expiresAt: new Date(Date.now() + 30 * 60_000).toISOString(),
    });

    return NextResponse.json({
      quotes: quotes.sort((a, b) => a.fee - b.fee),
      available,
    });
  } catch (err) {
    console.error('[API] Delivery quote error:', err);
    return NextResponse.json({ error: 'Failed to get delivery quotes' }, { status: 500 });
  }
}
