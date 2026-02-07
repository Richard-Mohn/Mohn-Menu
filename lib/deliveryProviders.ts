/**
 * Third-Party Delivery Provider Integration — DoorDash Drive + Uber Direct
 *
 * White-label delivery-as-a-service integration that lets MohnMenu business owners
 * dispatch deliveries through DoorDash or Uber without customers seeing those brands.
 *
 * Architecture:
 *   - Business owner enables third-party delivery in Settings
 *   - At checkout, customer sees delivery options (Community Courier / DoorDash / Uber)
 *   - API routes call this lib to get quotes, create deliveries, track status
 *   - Webhooks receive real-time delivery status updates
 *
 * Required env vars:
 *   DOORDASH_DEVELOPER_ID   — DoorDash Drive developer ID
 *   DOORDASH_KEY_ID          — DoorDash Drive key ID
 *   DOORDASH_SIGNING_SECRET  — DoorDash Drive signing secret (base64)
 *   UBER_CLIENT_ID           — Uber Direct OAuth client ID
 *   UBER_CLIENT_SECRET       — Uber Direct OAuth client secret
 *   UBER_CUSTOMER_ID         — Uber Direct customer account ID
 */

/* ─── DoorDash Drive ─────────────────────────────────────── */

const DD_BASE = 'https://openapi.doordash.com';
const DD_DEVELOPER_ID = process.env.DOORDASH_DEVELOPER_ID || '';
const DD_KEY_ID = process.env.DOORDASH_KEY_ID || '';
const DD_SIGNING_SECRET = process.env.DOORDASH_SIGNING_SECRET || '';

if (!DD_DEVELOPER_ID) console.warn('[DeliveryProviders] DOORDASH_DEVELOPER_ID not set');

/**
 * Create a self-signed JWT for DoorDash Drive API authentication.
 * DoorDash uses HS256-signed JWTs instead of OAuth tokens.
 */
async function getDoorDashJWT(): Promise<string> {
  if (!DD_DEVELOPER_ID || !DD_KEY_ID || !DD_SIGNING_SECRET) {
    throw new Error('[DoorDash] Missing credentials — set DOORDASH_DEVELOPER_ID, DOORDASH_KEY_ID, DOORDASH_SIGNING_SECRET');
  }

  const jose = await import('jose');
  const secret = Buffer.from(DD_SIGNING_SECRET, 'base64');
  const now = Math.floor(Date.now() / 1000);

  const jwt = await new jose.SignJWT({
    aud: 'doordash',
    iss: DD_DEVELOPER_ID,
    kid: DD_KEY_ID,
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT', 'dd-ver': 'DD-JWT-V1' } as any)
    .setIssuedAt(now)
    .setExpirationTime(now + 300)
    .sign(secret);

  return jwt;
}

async function ddFetch<T = Record<string, unknown>>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getDoorDashJWT();
  const res = await fetch(`${DD_BASE}${path}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    console.error('[DoorDash] API error:', data);
    throw new Error(data.message || data.field_errors?.[0]?.error || `DoorDash error ${res.status}`);
  }
  return data as T;
}

/* ─── Uber Direct ────────────────────────────────────────── */

const UBER_CLIENT_ID = process.env.UBER_CLIENT_ID || '';
const UBER_CLIENT_SECRET = process.env.UBER_CLIENT_SECRET || '';
const UBER_CUSTOMER_ID = process.env.UBER_CUSTOMER_ID || '';

if (!UBER_CLIENT_ID) console.warn('[DeliveryProviders] UBER_CLIENT_ID not set');

let uberToken: string | null = null;
let uberTokenExpiry = 0;

/**
 * Get/refresh Uber Direct OAuth token.
 * Tokens last 30 days — we cache and re-use.
 */
async function getUberToken(): Promise<string> {
  if (!UBER_CLIENT_ID || !UBER_CLIENT_SECRET) {
    throw new Error('[Uber] Missing credentials — set UBER_CLIENT_ID, UBER_CLIENT_SECRET');
  }

  // Return cached token if still valid (with 1-hour buffer)
  if (uberToken && Date.now() < uberTokenExpiry - 3600_000) {
    return uberToken;
  }

  const params = new URLSearchParams({
    client_id: UBER_CLIENT_ID,
    client_secret: UBER_CLIENT_SECRET,
    grant_type: 'client_credentials',
    scope: 'eats.deliveries',
  });

  const res = await fetch('https://auth.uber.com/oauth/v2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });

  const data = await res.json();
  if (!res.ok) {
    console.error('[Uber] Auth error:', data);
    throw new Error(data.error_description || data.error || `Uber auth error ${res.status}`);
  }

  uberToken = data.access_token;
  uberTokenExpiry = Date.now() + (data.expires_in * 1000);
  return uberToken!;
}

async function uberFetch<T = Record<string, unknown>>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getUberToken();
  const base = `https://api.uber.com/v1/customers/${UBER_CUSTOMER_ID}`;
  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    console.error('[Uber] API error:', data);
    throw new Error(data.message || data.code || `Uber error ${res.status}`);
  }
  return data as T;
}

/* ─── Shared Types ───────────────────────────────────────── */

export type DeliveryProvider = 'doordash' | 'uber' | 'community';

export interface DeliveryQuote {
  provider: DeliveryProvider;
  fee: number;          // cents
  estimatedMinutes: number;
  quoteId: string;      // provider-specific quote ID
  expiresAt: string;    // ISO timestamp
}

export interface DeliveryRequest {
  orderId: string;
  businessId: string;
  // Pickup
  pickupAddress: string;
  pickupPhone: string;
  pickupBusinessName: string;
  pickupInstructions?: string;
  // Dropoff
  dropoffAddress: string;
  dropoffPhone: string;
  dropoffName: string;
  dropoffInstructions?: string;
  // Order
  orderValue: number;   // cents
  tip: number;           // cents
  items: { name: string; quantity: number }[];
}

export interface DeliveryStatus {
  provider: DeliveryProvider;
  providerDeliveryId: string;
  status: 'created' | 'assigned' | 'picking_up' | 'picked_up' | 'delivering' | 'delivered' | 'cancelled' | 'returned';
  driverName?: string;
  driverPhone?: string;
  driverLat?: number;
  driverLng?: number;
  trackingUrl?: string;
  estimatedDeliveryTime?: string;
  fee?: number;
}

/* ─── Public API ─────────────────────────────────────────── */

/**
 * Get delivery quotes from one or both providers.
 * Returns an array of quotes sorted by fee (cheapest first).
 */
export async function getDeliveryQuotes(
  req: DeliveryRequest,
  providers: DeliveryProvider[] = ['doordash', 'uber'],
): Promise<DeliveryQuote[]> {
  const quotes: DeliveryQuote[] = [];

  const promises = providers.map(async (provider) => {
    try {
      if (provider === 'doordash' && DD_DEVELOPER_ID) {
        const q = await getDoorDashQuote(req);
        quotes.push(q);
      } else if (provider === 'uber' && UBER_CLIENT_ID) {
        const q = await getUberQuote(req);
        quotes.push(q);
      }
    } catch (err) {
      console.error(`[DeliveryProviders] Quote from ${provider} failed:`, err);
    }
  });

  await Promise.all(promises);
  return quotes.sort((a, b) => a.fee - b.fee);
}

/**
 * Create a delivery with the specified provider.
 */
export async function createDelivery(
  provider: DeliveryProvider,
  req: DeliveryRequest,
  quoteId?: string,
): Promise<DeliveryStatus> {
  if (provider === 'doordash') return createDoorDashDelivery(req);
  if (provider === 'uber') return createUberDelivery(req, quoteId);
  throw new Error(`Unsupported provider: ${provider}`);
}

/**
 * Get the current status of a delivery from its provider.
 */
export async function getDeliveryStatus(
  provider: DeliveryProvider,
  providerDeliveryId: string,
): Promise<DeliveryStatus> {
  if (provider === 'doordash') return getDoorDashStatus(providerDeliveryId);
  if (provider === 'uber') return getUberStatus(providerDeliveryId);
  throw new Error(`Unsupported provider: ${provider}`);
}

/**
 * Cancel a delivery.
 */
export async function cancelDelivery(
  provider: DeliveryProvider,
  providerDeliveryId: string,
): Promise<void> {
  if (provider === 'doordash') return cancelDoorDashDelivery(providerDeliveryId);
  if (provider === 'uber') return cancelUberDelivery(providerDeliveryId);
  throw new Error(`Unsupported provider: ${provider}`);
}

/**
 * Check which providers are configured and available.
 */
export function getAvailableProviders(): DeliveryProvider[] {
  const available: DeliveryProvider[] = ['community']; // Always available
  if (DD_DEVELOPER_ID && DD_KEY_ID && DD_SIGNING_SECRET) available.push('doordash');
  if (UBER_CLIENT_ID && UBER_CLIENT_SECRET && UBER_CUSTOMER_ID) available.push('uber');
  return available;
}

/* ─── DoorDash Implementation ────────────────────────────── */

async function getDoorDashQuote(req: DeliveryRequest): Promise<DeliveryQuote> {
  const externalId = `mohn-${req.orderId}-${Date.now()}`;

  const data = await ddFetch<{
    external_delivery_id: string;
    fee: number;
    delivery_time?: string;
    pickup_time_estimated?: string;
    dropoff_time_estimated?: string;
  }>('/drive/v2/quotes', {
    method: 'POST',
    body: JSON.stringify({
      external_delivery_id: externalId,
      pickup_address: req.pickupAddress,
      pickup_phone_number: req.pickupPhone,
      pickup_business_name: req.pickupBusinessName,
      dropoff_address: req.dropoffAddress,
      dropoff_phone_number: req.dropoffPhone,
      dropoff_contact_given_name: req.dropoffName,
      order_value: req.orderValue,
    }),
  });

  const dropoffTime = data.dropoff_time_estimated ? new Date(data.dropoff_time_estimated) : null;
  const etaMinutes = dropoffTime ? Math.round((dropoffTime.getTime() - Date.now()) / 60_000) : 35;

  return {
    provider: 'doordash',
    fee: data.fee || 0,
    estimatedMinutes: etaMinutes,
    quoteId: externalId,
    expiresAt: new Date(Date.now() + 5 * 60_000).toISOString(), // 5 min
  };
}

async function createDoorDashDelivery(req: DeliveryRequest): Promise<DeliveryStatus> {
  const externalId = `mohn-${req.orderId}-${Date.now()}`;

  const data = await ddFetch<{
    external_delivery_id: string;
    delivery_status: string;
    fee: number;
    tracking_url?: string;
    dropoff_time_estimated?: string;
    dasher_name?: string;
    dasher_phone_number?: string;
  }>('/drive/v2/deliveries', {
    method: 'POST',
    body: JSON.stringify({
      external_delivery_id: externalId,
      pickup_address: req.pickupAddress,
      pickup_phone_number: req.pickupPhone,
      pickup_business_name: req.pickupBusinessName,
      pickup_instructions: req.pickupInstructions || '',
      dropoff_address: req.dropoffAddress,
      dropoff_phone_number: req.dropoffPhone,
      dropoff_contact_given_name: req.dropoffName,
      dropoff_instructions: req.dropoffInstructions || '',
      order_value: req.orderValue,
      tip: req.tip,
      items: req.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
      })),
    }),
  });

  return {
    provider: 'doordash',
    providerDeliveryId: externalId,
    status: mapDoorDashStatus(data.delivery_status),
    driverName: data.dasher_name,
    driverPhone: data.dasher_phone_number,
    trackingUrl: data.tracking_url,
    estimatedDeliveryTime: data.dropoff_time_estimated,
    fee: data.fee,
  };
}

async function getDoorDashStatus(externalId: string): Promise<DeliveryStatus> {
  const data = await ddFetch<{
    external_delivery_id: string;
    delivery_status: string;
    dasher_name?: string;
    dasher_phone_number?: string;
    dasher_location?: { lat: number; lng: number };
    tracking_url?: string;
    dropoff_time_estimated?: string;
    fee: number;
  }>(`/drive/v2/deliveries/${externalId}`);

  return {
    provider: 'doordash',
    providerDeliveryId: externalId,
    status: mapDoorDashStatus(data.delivery_status),
    driverName: data.dasher_name,
    driverPhone: data.dasher_phone_number,
    driverLat: data.dasher_location?.lat,
    driverLng: data.dasher_location?.lng,
    trackingUrl: data.tracking_url,
    estimatedDeliveryTime: data.dropoff_time_estimated,
    fee: data.fee,
  };
}

async function cancelDoorDashDelivery(externalId: string): Promise<void> {
  await ddFetch(`/drive/v2/deliveries/${externalId}/cancel`, { method: 'PUT' });
}

function mapDoorDashStatus(ddStatus: string): DeliveryStatus['status'] {
  const map: Record<string, DeliveryStatus['status']> = {
    quote: 'created',
    created: 'created',
    confirmed: 'assigned',
    enroute_to_pickup: 'picking_up',
    arrived_at_pickup: 'picking_up',
    picked_up: 'picked_up',
    enroute_to_dropoff: 'delivering',
    arrived_at_dropoff: 'delivering',
    delivered: 'delivered',
    cancelled: 'cancelled',
    returned: 'returned',
  };
  return map[ddStatus] || 'created';
}

/* ─── Uber Direct Implementation ─────────────────────────── */

async function getUberQuote(req: DeliveryRequest): Promise<DeliveryQuote> {
  const pickupAddr = formatUberAddress(req.pickupAddress);
  const dropoffAddr = formatUberAddress(req.dropoffAddress);

  const data = await uberFetch<{
    id: string;
    fee: number;
    estimated_at: string;
    expires_at: string;
    duration: number; // estimated mins
    dropoff_eta?: string;
  }>('/delivery_quotes', {
    method: 'POST',
    body: JSON.stringify({
      pickup_address: pickupAddr,
      dropoff_address: dropoffAddr,
    }),
  });

  return {
    provider: 'uber',
    fee: data.fee || 0,
    estimatedMinutes: data.duration || 30,
    quoteId: data.id,
    expiresAt: data.expires_at || new Date(Date.now() + 15 * 60_000).toISOString(),
  };
}

async function createUberDelivery(req: DeliveryRequest, quoteId?: string): Promise<DeliveryStatus> {
  const pickupAddr = formatUberAddress(req.pickupAddress);
  const dropoffAddr = formatUberAddress(req.dropoffAddress);

  const body: Record<string, unknown> = {
    pickup_name: req.pickupBusinessName,
    pickup_address: pickupAddr,
    pickup_phone_number: req.pickupPhone,
    pickup_notes: req.pickupInstructions || '',
    dropoff_name: req.dropoffName,
    dropoff_address: dropoffAddr,
    dropoff_phone_number: req.dropoffPhone,
    dropoff_notes: req.dropoffInstructions || '',
    manifest_items: req.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
    })),
    manifest_total_value: req.orderValue,
    tip: req.tip,
    external_id: `mohn-${req.orderId}`,
  };

  if (quoteId) body.quote_id = quoteId;

  const data = await uberFetch<{
    id: string;
    status: string;
    fee: number;
    tracking_url?: string;
    dropoff_eta?: string;
    courier?: {
      name?: string;
      phone_number?: string;
      location?: { lat: number; lng: number };
    };
  }>('/deliveries', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return {
    provider: 'uber',
    providerDeliveryId: data.id,
    status: mapUberStatus(data.status),
    driverName: data.courier?.name,
    driverPhone: data.courier?.phone_number,
    driverLat: data.courier?.location?.lat,
    driverLng: data.courier?.location?.lng,
    trackingUrl: data.tracking_url,
    estimatedDeliveryTime: data.dropoff_eta,
    fee: data.fee,
  };
}

async function getUberStatus(deliveryId: string): Promise<DeliveryStatus> {
  const data = await uberFetch<{
    id: string;
    status: string;
    fee: number;
    tracking_url?: string;
    dropoff_eta?: string;
    courier?: {
      name?: string;
      phone_number?: string;
      location?: { lat: number; lng: number };
    };
  }>(`/deliveries/${deliveryId}`);

  return {
    provider: 'uber',
    providerDeliveryId: deliveryId,
    status: mapUberStatus(data.status),
    driverName: data.courier?.name,
    driverPhone: data.courier?.phone_number,
    driverLat: data.courier?.location?.lat,
    driverLng: data.courier?.location?.lng,
    trackingUrl: data.tracking_url,
    estimatedDeliveryTime: data.dropoff_eta,
    fee: data.fee,
  };
}

async function cancelUberDelivery(deliveryId: string): Promise<void> {
  await uberFetch(`/deliveries/${deliveryId}/cancel`, { method: 'POST' });
}

function mapUberStatus(uberStatus: string): DeliveryStatus['status'] {
  const map: Record<string, DeliveryStatus['status']> = {
    pending: 'created',
    pickup: 'picking_up',
    pickup_complete: 'picked_up',
    dropoff: 'delivering',
    delivered: 'delivered',
    canceled: 'cancelled',
    returned: 'returned',
  };
  return map[uberStatus] || 'created';
}

/**
 * Uber Direct requires addresses as JSON-encoded strings with structured fields.
 * We accept a plain address string and wrap it in Uber's format.
 */
function formatUberAddress(address: string): string {
  // Uber expects a JSON string like: {"street_address":["123 Main St"],"city":"Richmond","state":"VA","zip_code":"23220","country":"US"}
  // For simplicity, we pass the full address in street_address and let Uber's geocoder handle it
  return JSON.stringify({
    street_address: [address],
    country: 'US',
  });
}

/* ─── Webhook Helpers ────────────────────────────────────── */

/**
 * Parse a DoorDash Drive webhook event into our standard DeliveryStatus.
 */
export function parseDoorDashWebhook(body: any): DeliveryStatus {
  return {
    provider: 'doordash',
    providerDeliveryId: body.external_delivery_id,
    status: mapDoorDashStatus(body.delivery_status || body.event_name?.toLowerCase().replace('dasher_', '').replace('delivery_', '') || 'created'),
    driverName: body.dasher_name,
    driverPhone: body.dasher_phone_number,
    driverLat: body.dasher_location?.lat,
    driverLng: body.dasher_location?.lng,
    trackingUrl: body.tracking_url,
    fee: body.fee,
  };
}

/**
 * Parse an Uber Direct webhook event into our standard DeliveryStatus.
 */
export function parseUberWebhook(body: any): DeliveryStatus {
  const d = body.data || body;
  return {
    provider: 'uber',
    providerDeliveryId: d.id || body.delivery_id,
    status: mapUberStatus(d.status || 'pending'),
    driverName: d.courier?.name,
    driverPhone: d.courier?.phone_number,
    driverLat: d.courier?.location?.lat,
    driverLng: d.courier?.location?.lng,
    trackingUrl: d.tracking_url,
    fee: d.fee,
  };
}
