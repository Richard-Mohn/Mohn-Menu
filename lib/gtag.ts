// Google Tag Manager — single source of truth for all analytics.
//
// All events are pushed to the GTM dataLayer. Tags (GA4, Facebook Pixel,
// TikTok, etc.) are managed inside the GTM container — no code changes
// needed when you add a new tracking pixel.
//
// GA4 Measurement ID is configured inside GTM, NOT in this file.
// GTM Container ID is the only ID we need in code.

export const GTM_ID = 'GTM-P4KZDZQP';
export const GA_MEASUREMENT_ID = 'G-LQC1CSJGP6'; // referenced by gtag helpers below

// ---------------------------------------------------------------------------
// Typings
// ---------------------------------------------------------------------------
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: Record<string, unknown>[];
  }
}

// ---------------------------------------------------------------------------
// Low-level helpers
// ---------------------------------------------------------------------------

function push(data: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
}

// ---------------------------------------------------------------------------
// Page views (SPA virtual navigations)
// ---------------------------------------------------------------------------

/** Push a virtual page view for SPA route changes. */
export function pageview(url: string) {
  push({
    event: 'page_view',
    page_path: url,
  });
}

// ---------------------------------------------------------------------------
// Custom events  (generic)
// ---------------------------------------------------------------------------

/** Fire any named event with optional params. */
export function event(action: string, params: Record<string, unknown> = {}) {
  push({ event: action, ...params });
}

// ---------------------------------------------------------------------------
// User identity
// ---------------------------------------------------------------------------

/** Set the user_id for cross-device linking (GA4 reads this from dataLayer). */
export function setUserId(userId: string | null) {
  push({
    event: 'set_user_id',
    user_id: userId,
  });
}

// ---------------------------------------------------------------------------
// GA4 Ecommerce helpers  (dataLayer format)
// https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
// ---------------------------------------------------------------------------

export interface GtagItem {
  item_id: string;
  item_name: string;
  price?: number;
  quantity?: number;
  item_category?: string;
  item_brand?: string;      // business name / slug
  item_variant?: string;    // options joined
}

/** Clear previous ecommerce object before pushing a new one (GTM best practice). */
function clearEcommerce() {
  push({ ecommerce: null });
}

/** User views a product / menu item. */
export function viewItem(item: GtagItem, currency = 'USD') {
  clearEcommerce();
  push({
    event: 'view_item',
    ecommerce: {
      currency,
      value: (item.price ?? 0) * (item.quantity ?? 1),
      items: [item],
    },
  });
}

/** User adds an item to the cart. */
export function addToCartEvent(item: GtagItem, currency = 'USD') {
  clearEcommerce();
  push({
    event: 'add_to_cart',
    ecommerce: {
      currency,
      value: (item.price ?? 0) * (item.quantity ?? 1),
      items: [item],
    },
  });
}

/** User removes an item from the cart. */
export function removeFromCartEvent(item: GtagItem, currency = 'USD') {
  clearEcommerce();
  push({
    event: 'remove_from_cart',
    ecommerce: {
      currency,
      value: (item.price ?? 0) * (item.quantity ?? 1),
      items: [item],
    },
  });
}

/** User views their cart. */
export function viewCart(items: GtagItem[], value: number, currency = 'USD') {
  clearEcommerce();
  push({ event: 'view_cart', ecommerce: { currency, value, items } });
}

/** User begins checkout. */
export function beginCheckout(items: GtagItem[], value: number, currency = 'USD') {
  clearEcommerce();
  push({ event: 'begin_checkout', ecommerce: { currency, value, items } });
}

/** Checkout completed / payment received. */
export function purchase(
  transactionId: string,
  items: GtagItem[],
  value: number,
  currency = 'USD',
  extra: Record<string, unknown> = {},
) {
  clearEcommerce();
  push({
    event: 'purchase',
    ecommerce: {
      transaction_id: transactionId,
      currency,
      value,
      items,
      ...extra,
    },
  });
}

// ---------------------------------------------------------------------------
// Auth / engagement events
// ---------------------------------------------------------------------------

export function signUpEvent(method: string) {
  push({ event: 'sign_up', method });
}

export function loginEvent(method: string) {
  push({ event: 'login', method });
}

// ---------------------------------------------------------------------------
// Business / tenant context helper
// ---------------------------------------------------------------------------

/** Wrap a GtagItem with the tenant / business info so owner-level reports work. */
export function makeGtagItem(
  id: string,
  name: string,
  price: number,
  quantity: number,
  businessSlug: string,
  options?: string[],
): GtagItem {
  return {
    item_id: id,
    item_name: name,
    price,
    quantity,
    item_brand: businessSlug,
    item_variant: options?.join(', '),
  };
}
