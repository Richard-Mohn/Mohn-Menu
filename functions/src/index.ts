/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";
import { onDocumentUpdated } from "firebase-functions/v2/firestore"; // Import onDocumentUpdated
import * as admin from "firebase-admin";
import Stripe from "stripe";
import cors from "cors";

admin.initializeApp();
const db = admin.firestore();

setGlobalOptions({ maxInstances: 10 });

const corsHandler = cors({ origin: true });

// Note: In production, use Firebase Secret Manager for the Stripe Secret Key
// firebase functions:secrets:set STRIPE_SECRET_KEY
// firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2026-01-28.clover",
});

/**
 * Creates a Stripe Payment Intent for an order.
 */
export const createPaymentIntent = onRequest(async (req, res) => {
  return corsHandler(req, res, async () => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    try {
      const { amount, customerEmail, orderId } = req.body;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe expects amounts in cents
        currency: "usd",
        receipt_email: customerEmail,
        metadata: { orderId },
      });

      res.status(200).send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error: unknown) {
      console.error("Error creating payment intent:", error);
      const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
      res.status(500).send({ error: errorMessage });
    }
  });
});

/**
 * Handles Stripe Webhook events to confirm payment and update order status.
 */
export const stripeWebhook = onRequest(async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook Error: ${message}`);
    res.status(400).send(`Webhook Error: ${message}`);
    return;
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as any; // Cast to any to access receipt_url
    const orderId = paymentIntent.metadata.orderId;
    const receiptUrl = paymentIntent.receipt_url; // Get the Stripe hosted receipt URL

    if (orderId) {
      await db.collection("orders").doc(orderId).update({
        paymentStatus: "succeeded",
        currentStatus: "Received",
        paymentConfirmedAt: admin.firestore.FieldValue.serverTimestamp(),
        receiptUrl: receiptUrl, // Store the receipt URL
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`Order ${orderId} marked as paid. Receipt URL: ${receiptUrl}`);
    }
  }

  res.json({ received: true });
});

/**
 * Cloud Function to handle order status changes and calculate driver payouts.
 */
export const onOrderStatusUpdate = onDocumentUpdated("orders/{orderId}", async (event) => {
  const orderAfter = event.data?.after.data();
  const orderBefore = event.data?.before.data();

  if (!orderAfter || !orderBefore) {
    console.log("No data for order update.");
    return null;
  }

  const orderId = event.params.orderId;
  const DRIVER_PAYOUT_PER_DELIVERY = 5.00; // Define fixed payout amount

  // Check if status changed to 'Delivered' and a driverId is present
  if (orderAfter.currentStatus === 'Delivered' && orderBefore.currentStatus !== 'Delivered' && orderAfter.driverId) {
    // Only set payout if it hasn't been set before to prevent multiple payouts
    if (!orderAfter.driverPayoutAmount) {
      await db.collection("orders").doc(orderId).update({
        driverPayoutAmount: DRIVER_PAYOUT_PER_DELIVERY,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`Driver ${orderAfter.driverId} earned $${DRIVER_PAYOUT_PER_DELIVERY} for order ${orderId}.`);
    }
  }

  // Add more logic here for other status changes if needed

  return null;
});