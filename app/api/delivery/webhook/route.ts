/**
 * Delivery Webhook — POST /api/delivery/webhook
 * 
 * Receives status updates from DoorDash Drive and Uber Direct.
 * Updates the order document in Firestore with the latest delivery status.
 * 
 * NOT authenticated via Firebase — uses provider-specific verification instead.
 * DoorDash: Basic Auth or domain allowlisting
 * Uber: HMAC-SHA256 verification via x-uber-signature header
 */

import { NextRequest, NextResponse } from 'next/server';
import { parseDoorDashWebhook, parseUberWebhook, type DeliveryStatus } from '@/lib/deliveryProviders';
import { adminDb } from '@/lib/firebaseAdmin';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    let status: DeliveryStatus;
    let orderId: string | null = null;

    // Determine which provider sent the webhook
    const uberSignature = request.headers.get('x-uber-signature');
    const isDoorDash = body.event_name || body.external_delivery_id;

    if (uberSignature) {
      // Verify Uber webhook signature
      const uberSigningKey = process.env.UBER_WEBHOOK_SIGNING_KEY || '';
      if (uberSigningKey) {
        const rawBody = JSON.stringify(body);
        const expectedSig = crypto
          .createHmac('sha256', uberSigningKey)
          .update(rawBody)
          .digest('hex');

        if (uberSignature !== expectedSig) {
          console.warn('[Delivery Webhook] Invalid Uber signature');
          return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }
      }

      status = parseUberWebhook(body);
      // Uber external_id contains our order reference
      orderId = body.data?.external_id?.replace('mohn-', '') || null;
    } else if (isDoorDash) {
      status = parseDoorDashWebhook(body);
      // DoorDash external_delivery_id format: "mohn-{orderId}-{timestamp}"
      const parts = (body.external_delivery_id || '').split('-');
      if (parts.length >= 2 && parts[0] === 'mohn') {
        orderId = parts[1];
      }
    } else {
      return NextResponse.json({ error: 'Unknown webhook source' }, { status: 400 });
    }

    console.log(`[Delivery Webhook] ${status.provider} delivery ${status.providerDeliveryId} → ${status.status}`);

    // Find and update the order in Firestore
    if (orderId) {
      // Search across all businesses for this order
      const ordersQuery = adminDb.collectionGroup('orders')
        .where('providerDeliveryId', '==', status.providerDeliveryId)
        .limit(1);

      const snapshot = await ordersQuery.get();

      if (!snapshot.empty) {
        const orderDoc = snapshot.docs[0];
        const updateData: Record<string, any> = {
          deliveryStatus: status.status,
          updatedAt: new Date().toISOString(),
        };

        if (status.driverName) updateData.deliveryDriverName = status.driverName;
        if (status.driverPhone) updateData.deliveryDriverPhone = status.driverPhone;
        if (status.trackingUrl) updateData.deliveryTrackingUrl = status.trackingUrl;
        if (status.fee) updateData.deliveryFee = status.fee / 100;

        // Map delivery status to order status for the owner's order list
        if (status.status === 'picked_up') {
          updateData.status = 'Out for Delivery';
        } else if (status.status === 'delivered') {
          updateData.status = 'Delivered';
        } else if (status.status === 'cancelled') {
          updateData.status = 'Cancelled';
        }

        await orderDoc.ref.update(updateData);
        console.log(`[Delivery Webhook] Updated order ${orderDoc.id}`);
      } else {
        console.warn(`[Delivery Webhook] Order not found for delivery ${status.providerDeliveryId}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[Delivery Webhook] Error:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
