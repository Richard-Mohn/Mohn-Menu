/**
 * Create Delivery API — POST /api/delivery/create
 * 
 * Creates a delivery with the specified provider (DoorDash / Uber / Community).
 * Stores the delivery info on the order document for tracking.
 * 
 * Body: { businessId, orderId, provider, quoteId?, dropoffAddress, dropoffPhone, dropoffName, dropoffInstructions?, tip? }
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyApiAuth } from '@/lib/apiAuth';
import { createDelivery, type DeliveryProvider, type DeliveryRequest } from '@/lib/deliveryProviders';
import { adminDb } from '@/lib/firebaseAdmin';

export async function POST(request: NextRequest) {
  const auth = await verifyApiAuth(request);
  if ('error' in auth) return auth.error;

  try {
    const body = await request.json();
    const { businessId, orderId, provider, quoteId, dropoffAddress, dropoffPhone, dropoffName, dropoffInstructions, tip } = body;

    if (!businessId || !orderId || !provider || !dropoffAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify order exists and belongs to business
    const orderRef = adminDb.collection('businesses').doc(businessId).collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();
    if (!orderDoc.exists) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = orderDoc.data()!;

    // If community courier, just mark the order as awaiting courier
    if (provider === 'community') {
      await orderRef.update({
        deliveryProvider: 'community',
        deliveryStatus: 'awaiting_courier',
        updatedAt: new Date().toISOString(),
      });

      return NextResponse.json({
        provider: 'community',
        status: 'awaiting_courier',
        message: 'Order is awaiting community courier assignment',
      });
    }

    // Get business info for pickup
    const businessDoc = await adminDb.collection('businesses').doc(businessId).get();
    const business = businessDoc.data()!;
    const pickupAddress = [business.address, business.city, business.state, business.zipCode]
      .filter(Boolean)
      .join(', ');

    const req: DeliveryRequest = {
      orderId,
      businessId,
      pickupAddress,
      pickupPhone: business.businessPhone || business.ownerPhone || '',
      pickupBusinessName: business.name || 'Restaurant',
      dropoffAddress,
      dropoffPhone: dropoffPhone || order.phone || '',
      dropoffName: dropoffName || order.customerName || 'Customer',
      dropoffInstructions: dropoffInstructions || order.deliveryInstructions || '',
      orderValue: Math.round((order.total || 0) * 100),
      tip: Math.round((tip || order.tip || 0) * 100),
      items: (order.items || []).map((item: any) => ({
        name: item.name,
        quantity: item.quantity || 1,
      })),
    };

    const result = await createDelivery(provider as DeliveryProvider, req, quoteId);

    // Update order with delivery info
    await orderRef.update({
      deliveryProvider: provider,
      providerDeliveryId: result.providerDeliveryId,
      deliveryStatus: result.status,
      deliveryTrackingUrl: result.trackingUrl || null,
      deliveryFee: result.fee ? result.fee / 100 : null,
      deliveryDriverName: result.driverName || null,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error('[API] Create delivery error:', err);
    return NextResponse.json({ error: 'Failed to create delivery' }, { status: 500 });
  }
}
