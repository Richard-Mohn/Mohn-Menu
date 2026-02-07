/**
 * Domain Registrar Service — DomainNameAPI Integration
 *
 * White-label ICANN-accredited domain registration via DomainNameAPI.
 * Handles domain search, purchase, DNS configuration, and renewal.
 * Domains are registered under our reseller account and sold to tenants
 * at a flat $14.99/yr — cheaper than GoDaddy, Namecheap, and others.
 *
 * Requires env vars:
 *   DNA_API_USERNAME   — DomainNameAPI reseller username
 *   DNA_API_PASSWORD   — DomainNameAPI reseller password
 *
 * SDK: nodejs-dna (SOAP-based, connects to whmcs.domainnameapi.com)
 * Docs: https://www.domainnameapi.com/domain-reseller-api
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const DomainNameAPI = require('nodejs-dna');

// ── Config ───────────────────────────────────────────────────

const DNA_USERNAME = process.env.DNA_API_USERNAME || '';
const DNA_PASSWORD = process.env.DNA_API_PASSWORD || '';

// Flat retail price: $14.99/year — covers wholesale (~$10.91) + Stripe fee (~$0.73) + profit (~$3.35)
export const DOMAIN_PRICE_CENTS = 1499;

// Firebase App Hosting nameservers (point domains here)
const APP_HOSTING_NS1 = process.env.APP_HOSTING_NS1 || 'ns1.mohnmenu.com';
const APP_HOSTING_NS2 = process.env.APP_HOSTING_NS2 || 'ns2.mohnmenu.com';
const APP_HOSTING_CNAME = process.env.FIREBASE_APP_HOSTING_DOMAIN || 'mohnmenu.com';

// Competitor prices for comparison UI (retail prices for .com/yr)
export const COMPETITOR_PRICES: Record<string, { price: string; note?: string }> = {
  'GoDaddy':     { price: '$22.99', note: 'Renewal jumps to $24.99' },
  'Namecheap':   { price: '$15.98' },
  'Squarespace': { price: '$20.00' },
  'Hostinger':   { price: '$15.99' },
  'Google':      { price: '$14.00', note: 'No website included' },
};

// Popular TLD extensions for keyword search
const POPULAR_EXTENSIONS = ['com', 'net', 'org', 'io', 'co', 'shop', 'store', 'menu', 'food', 'restaurant'];

// ── Types ────────────────────────────────────────────────────

export interface DomainSearchResult {
  domain: string;
  available: boolean;
  price: number;       // Flat retail price in cents
  currency: string;
  period: number;      // Years
  totalPrice: number;  // Same as price (flat pricing, no separate markup)
  markup: number;      // Always 0 — flat pricing model
  wholesalePrice?: number; // Internal: what we pay (cents)
}

export interface DomainSuggestion {
  domain: string;
  available?: boolean;
  price?: number;
  totalPrice?: number;
}

export interface DomainPurchaseRequest {
  domain: string;
  years?: number;
  contact: DomainContact;
}

export interface DomainContact {
  nameFirst: string;
  nameLast: string;
  email: string;
  phone: string;        // Format: +1.5555555555
  addressMailing: {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;     // ISO 3166 (e.g., "US")
  };
  organization?: string;
}

export interface DomainPurchaseResult {
  domain: string;
  orderId: string;
  total: number;         // Wholesale cost in cents
  currency: string;
  itemCount: number;
  expirationDate?: string;
}

export interface DomainInfo {
  domain: string;
  status: string;
  expires: string;
  nameServers: string[];
  locked: boolean;
  autoRenew: boolean;
  createdAt: string;
  privacyEnabled?: boolean;
}

export interface DNSRecord {
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'NS' | 'SOA' | 'SRV' | 'TXT';
  name: string;
  data: string;
  ttl?: number;
  priority?: number;
}

// ── API Client ───────────────────────────────────────────────

function getClient() {
  if (!DNA_USERNAME || !DNA_PASSWORD) {
    throw new Error(
      'DomainNameAPI credentials not configured. Set DNA_API_USERNAME and DNA_API_PASSWORD env vars.',
    );
  }
  return new DomainNameAPI(DNA_USERNAME, DNA_PASSWORD);
}

/**
 * Split a domain into SLD (second-level domain) and TLD
 * e.g., "mybusiness.com" → { sld: "mybusiness", tld: "com" }
 */
function splitDomain(domain: string): { sld: string; tld: string } {
  const parts = domain.split('.');
  if (parts.length < 2) {
    return { sld: parts[0], tld: 'com' };
  }
  const tld = parts.slice(1).join('.');
  const sld = parts[0];
  return { sld, tld };
}

// ── Domain Search & Availability ─────────────────────────────

/**
 * Check if a single domain is available for purchase.
 * Returns flat pricing of $14.99/yr regardless of TLD wholesale cost.
 */
export async function checkDomainAvailability(
  domain: string,
): Promise<DomainSearchResult> {
  const api = getClient();
  const { sld, tld } = splitDomain(domain);

  try {
    const results = await api.CheckAvailability([sld], [tld], 1, 'create');

    if (results && results.length > 0) {
      const result = results[0];
      const isAvailable = result.Status === 1 || result.Status === 'available';
      const wholesaleCents = result.Price ? Math.round(parseFloat(result.Price) * 100) : 0;

      return {
        domain: result.DomainName || `${sld}.${tld}`,
        available: isAvailable,
        price: DOMAIN_PRICE_CENTS,
        currency: result.Currency || 'USD',
        period: result.Period || 1,
        totalPrice: DOMAIN_PRICE_CENTS,
        markup: 0,
        wholesalePrice: wholesaleCents,
      };
    }

    // Fallback if no results returned
    return {
      domain: `${sld}.${tld}`,
      available: false,
      price: DOMAIN_PRICE_CENTS,
      currency: 'USD',
      period: 1,
      totalPrice: DOMAIN_PRICE_CENTS,
      markup: 0,
    };
  } catch (error) {
    console.error('DomainNameAPI availability check failed:', error);
    throw new Error(`Domain availability check failed for ${domain}`);
  }
}

/**
 * Check availability for a keyword across popular TLD extensions.
 * Returns all available domains sorted by relevance.
 */
export async function checkKeywordAvailability(
  keyword: string,
  extensions?: string[],
  limit = 12,
): Promise<DomainSearchResult[]> {
  const api = getClient();
  const exts = extensions || POPULAR_EXTENSIONS;
  const cleanKeyword = keyword.replace(/[^a-z0-9-]/gi, '').toLowerCase();

  if (!cleanKeyword) return [];

  try {
    const results = await api.CheckAvailability([cleanKeyword], exts, 1, 'create');

    if (!results || !Array.isArray(results)) return [];

    return results
      .map((r: { DomainName?: string; Status?: number | string; Price?: string; Currency?: string; Period?: number }) => {
        const isAvailable = r.Status === 1 || r.Status === 'available';
        const wholesaleCents = r.Price ? Math.round(parseFloat(r.Price) * 100) : 0;

        return {
          domain: r.DomainName || `${cleanKeyword}.com`,
          available: isAvailable,
          price: DOMAIN_PRICE_CENTS,
          currency: r.Currency || 'USD',
          period: r.Period || 1,
          totalPrice: DOMAIN_PRICE_CENTS,
          markup: 0,
          wholesalePrice: wholesaleCents,
        };
      })
      .slice(0, limit);
  } catch (error) {
    console.error('DomainNameAPI keyword check failed:', error);
    return [];
  }
}

/**
 * Bulk check availability — checks multiple full domain names.
 * Groups by TLD for efficient API usage.
 */
export async function checkBulkAvailability(
  domains: string[],
): Promise<DomainSearchResult[]> {
  // Group domains by TLD for batch API calls
  const groups = new Map<string, string[]>();
  for (const domain of domains) {
    const { sld, tld } = splitDomain(domain);
    if (!groups.has(tld)) groups.set(tld, []);
    groups.get(tld)!.push(sld);
  }

  const api = getClient();
  const allResults: DomainSearchResult[] = [];

  // Check each TLD group
  for (const [tld, slds] of groups) {
    try {
      const results = await api.CheckAvailability(slds, [tld], 1, 'create');
      if (results && Array.isArray(results)) {
        for (const r of results) {
          const isAvailable = r.Status === 1 || r.Status === 'available';
          const wholesaleCents = r.Price ? Math.round(parseFloat(r.Price) * 100) : 0;

          allResults.push({
            domain: r.DomainName || `${slds[0]}.${tld}`,
            available: isAvailable,
            price: DOMAIN_PRICE_CENTS,
            currency: r.Currency || 'USD',
            period: r.Period || 1,
            totalPrice: DOMAIN_PRICE_CENTS,
            markup: 0,
            wholesalePrice: wholesaleCents,
          });
        }
      }
    } catch (error) {
      console.error(`Bulk check failed for .${tld}:`, error);
    }
  }

  return allResults;
}

/**
 * Get domain name suggestions based on a keyword.
 * Uses keyword availability check across popular TLDs.
 */
export async function getDomainSuggestions(
  keyword: string,
  limit = 10,
): Promise<DomainSuggestion[]> {
  const results = await checkKeywordAvailability(keyword, POPULAR_EXTENSIONS, limit);
  return results
    .filter((r) => r.available)
    .map((r) => ({
      domain: r.domain,
      available: r.available,
      price: r.price,
      totalPrice: r.totalPrice,
    }));
}

// ── Domain Purchase ──────────────────────────────────────────

/**
 * Register a domain via DomainNameAPI.
 * Should only be called AFTER Stripe payment is confirmed.
 *
 * Features included free:
 *   - WHOIS privacy protection
 *   - EPP lock (transfer protection)
 *   - Auto-renewal ready
 */
export async function registerDomain(
  request: DomainPurchaseRequest,
): Promise<DomainPurchaseResult> {
  const { domain, years = 1, contact } = request;
  const api = getClient();

  // Build contact object for DomainNameAPI
  const dnaContact = {
    FirstName: contact.nameFirst,
    LastName: contact.nameLast,
    Company: contact.organization || '',
    EMail: contact.email,
    Phone: contact.phone,
    AddressLine1: contact.addressMailing.address1,
    AddressLine2: contact.addressMailing.address2 || '',
    AddressLine3: '',
    City: contact.addressMailing.city,
    State: contact.addressMailing.state,
    ZipCode: contact.addressMailing.postalCode,
    Country: contact.addressMailing.country,
    Type: 'Contact',
  };

  // All four contacts use the same registrant info
  const contacts = {
    Administrative: dnaContact,
    Billing: dnaContact,
    Technical: dnaContact,
    Registrant: dnaContact,
  };

  // Point to our App Hosting nameservers for automatic setup
  const nameServers = [APP_HOSTING_NS1, APP_HOSTING_NS2];

  try {
    console.log(`[DomainNameAPI] Registering ${domain} for ${years} year(s)`);

    const result = await api.RegisterWithContactInfo(
      domain,
      years,
      contacts,
      nameServers,
      true,   // eppLock — prevent unauthorized transfers
      true,   // privacyLock — free WHOIS privacy
    );

    console.log(`[DomainNameAPI] Registration result:`, JSON.stringify(result));

    return {
      domain,
      orderId: result?.OrderId || result?.DomainId || String(Date.now()),
      total: 0, // We handle pricing on our side via Stripe
      currency: 'USD',
      itemCount: 1,
      expirationDate: result?.ExpirationDate || undefined,
    };
  } catch (error) {
    console.error(`[DomainNameAPI] Registration failed for ${domain}:`, error);
    throw new Error(`Domain registration failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// ── DNS / Nameserver Management ──────────────────────────────

/**
 * Configure nameservers for a domain to point to our hosting.
 * With DomainNameAPI, we set nameservers during registration,
 * but this can be used to update them later.
 */
export async function configureDNSForAppHosting(
  domain: string,
): Promise<{ success: boolean; records: DNSRecord[] }> {
  try {
    await setNameServers(domain, [APP_HOSTING_NS1, APP_HOSTING_NS2]);

    const records: DNSRecord[] = [
      { type: 'CNAME', name: '@', data: APP_HOSTING_CNAME, ttl: 600 },
      { type: 'CNAME', name: 'www', data: APP_HOSTING_CNAME, ttl: 600 },
    ];

    return { success: true, records };
  } catch (error) {
    console.error(`DNS configuration failed for ${domain}:`, error);
    throw error;
  }
}

/**
 * Set nameservers for a domain
 */
export async function setNameServers(
  domain: string,
  nameServers: string[],
): Promise<void> {
  const api = getClient();

  try {
    // DomainNameAPI uses ModifyNameServer or we can set during registration
    // Use the SaveNameServers or callApiFunction approach
    await api.callApiFunction('ModifyNameServer', {
      DomainName: domain,
      NameServer1: nameServers[0] || '',
      NameServer2: nameServers[1] || '',
      NameServer3: nameServers[2] || '',
      NameServer4: nameServers[3] || '',
    });

    console.log(`[DomainNameAPI] Nameservers updated for ${domain}:`, nameServers);
  } catch (error) {
    console.error(`Failed to set nameservers for ${domain}:`, error);
    throw error;
  }
}

/**
 * Get DNS records for a domain (via DomainNameAPI child nameservers/DNS)
 */
export async function getDNSRecords(
  domain: string,
): Promise<DNSRecord[]> {
  // DomainNameAPI doesn't provide granular DNS record management
  // DNS records are managed via nameservers. Return expected config.
  return [
    { type: 'CNAME', name: '@', data: APP_HOSTING_CNAME, ttl: 600 },
    { type: 'CNAME', name: 'www', data: APP_HOSTING_CNAME, ttl: 600 },
  ];
}

// ── Domain Info & Management ─────────────────────────────────

/**
 * Get details about a registered domain
 */
export async function getDomainInfo(domain: string): Promise<DomainInfo> {
  const api = getClient();

  try {
    const details = await api.GetDetails(domain);

    return {
      domain: details?.DomainName || domain,
      status: details?.Status || 'unknown',
      expires: details?.ExpirationDate || '',
      nameServers: [
        details?.NameServer1,
        details?.NameServer2,
        details?.NameServer3,
        details?.NameServer4,
      ].filter(Boolean),
      locked: details?.LockStatus === true || details?.LockStatus === 'true',
      autoRenew: true, // We manage renewals
      createdAt: details?.StartDate || details?.CreationDate || '',
      privacyEnabled: details?.PrivacyProtectionStatus === true,
    };
  } catch (error) {
    console.error(`Failed to get domain info for ${domain}:`, error);
    throw new Error(`Could not retrieve domain info: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Renew a domain for additional years
 */
export async function renewDomain(
  domain: string,
  years = 1,
): Promise<{ orderId: string; total: number; expirationDate?: string }> {
  const api = getClient();

  try {
    const result = await api.Renew(domain, years);

    return {
      orderId: result?.OrderId || String(Date.now()),
      total: DOMAIN_PRICE_CENTS * years,
      expirationDate: result?.ExpirationDate || undefined,
    };
  } catch (error) {
    console.error(`Failed to renew ${domain}:`, error);
    throw new Error(`Domain renewal failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Enable WHOIS privacy protection (free with DomainNameAPI)
 */
export async function enablePrivacyProtection(domain: string): Promise<void> {
  const api = getClient();
  try {
    await api.ModifyPrivacyProtectionStatus(domain, true, 'Enable privacy protection');
    console.log(`[DomainNameAPI] Privacy protection enabled for ${domain}`);
  } catch (error) {
    console.error(`Failed to enable privacy for ${domain}:`, error);
  }
}

/**
 * Get reseller account balance
 */
export async function getAccountBalance(): Promise<{ balance: number; currency: string }> {
  const api = getClient();
  try {
    const result = await api.GetCurrentBalance(1); // 1 = USD
    return {
      balance: parseFloat(result?.Balance || '0'),
      currency: result?.Currency || 'USD',
    };
  } catch (error) {
    console.error('Failed to get account balance:', error);
    return { balance: 0, currency: 'USD' };
  }
}

// ── Pricing Helpers ──────────────────────────────────────────

/**
 * Format cents to display price (e.g., 1499 → "$14.99")
 */
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Get the flat domain price for tenants
 */
export function getDomainPrice(): { cents: number; display: string; perYear: string } {
  return {
    cents: DOMAIN_PRICE_CENTS,
    display: formatPrice(DOMAIN_PRICE_CENTS),
    perYear: `${formatPrice(DOMAIN_PRICE_CENTS)}/yr`,
  };
}

/**
 * Calculate Stripe processing fee for a domain purchase
 */
export function calculateStripeFee(amountCents: number): number {
  // Stripe: 2.9% + $0.30
  return Math.round(amountCents * 0.029 + 30);
}

/**
 * Get profit breakdown for a domain sale
 */
export function getProfitBreakdown(wholesaleCents?: number): {
  retail: number;
  wholesale: number;
  stripeFee: number;
  profit: number;
} {
  const wholesale = wholesaleCents || 1091; // Default .com wholesale
  const stripeFee = calculateStripeFee(DOMAIN_PRICE_CENTS);
  return {
    retail: DOMAIN_PRICE_CENTS,
    wholesale,
    stripeFee,
    profit: DOMAIN_PRICE_CENTS - wholesale - stripeFee,
  };
}

/**
 * Get the competitor comparison data for display in UI
 */
export function getCompetitorComparison(): Array<{
  name: string;
  price: string;
  savings: string;
  note?: string;
}> {
  const ourPrice = DOMAIN_PRICE_CENTS / 100;

  return Object.entries(COMPETITOR_PRICES).map(([name, data]) => {
    const theirPrice = parseFloat(data.price.replace('$', ''));
    const savings = (theirPrice - ourPrice).toFixed(2);
    return {
      name,
      price: data.price,
      savings: `$${savings}`,
      note: data.note,
    };
  });
}

/**
 * Legacy alias — returns 0 since we use flat pricing
 */
export function getDomainMarkup(): number {
  return 0;
}
