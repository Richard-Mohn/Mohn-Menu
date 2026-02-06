/**
 * NOWPayments — Server-side SDK for MohnMenu Platform
 *
 * Custody + Customer Management architecture:
 *   - Each business tenant gets a NOWPayments "customer" (sub-partner) account
 *   - Inline white-label payments: POST /v1/payment returns a deposit address
 *     displayed directly in the QuickOrderModal (no redirect)
 *   - IPN webhook credits the business's custody sub-account
 *   - Transfers between master ↔ sub-partner are FREE (0 network fees)
 *
 * API Reference: https://documenter.getpostman.com/view/7907941/2s93JusNJt
 */

import crypto from 'crypto';

const API_BASE = 'https://api.nowpayments.io/v1';
const API_KEY = process.env.NOWPAYMENTS_API_KEY!;
const IPN_SECRET = process.env.NOWPAYMENTS_IPN_SECRET!;

// ─── API helpers ────────────────────────────────────────────

/** Standard API call with x-api-key header */
async function nowApi<T = Record<string, unknown>>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'x-api-key': API_KEY,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    console.error('[NOWPayments] API error:', data);
    throw new Error(data.message || data.error || `NOWPayments error ${res.status}`);
  }
  return data as T;
}

/** Custody API call — requires Bearer token + x-api-key */
async function custodyApi<T = Record<string, unknown>>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'x-api-key': API_KEY,
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    console.error('[NOWPayments Custody] API error:', data);
    throw new Error(data.message || data.error || `NOWPayments custody error ${res.status}`);
  }
  return data as T;
}

// ─── Status ─────────────────────────────────────────────────

export async function getApiStatus(): Promise<{ message: string }> {
  return nowApi('/status');
}

// ─── Currencies ─────────────────────────────────────────────

export interface CurrencyInfo {
  currency: string;
  name?: string;
  min_amount?: number;
}

export async function getAvailableCurrencies(): Promise<{ currencies: string[] }> {
  return nowApi('/currencies');
}

export async function getMinimumPaymentAmount(
  currencyFrom: string,
  currencyTo: string = 'usd'
): Promise<{ min_amount: number; currency_from: string; currency_to: string }> {
  return nowApi(`/min-amount?currency_from=${currencyFrom}&currency_to=${currencyTo}`);
}

// ─── Estimated price ────────────────────────────────────────

export async function getEstimatedPrice(
  amountUsd: number,
  currencyFrom: string = 'usd',
  currencyTo: string = 'btc'
): Promise<{
  currency_from: string;
  amount_from: number;
  currency_to: string;
  estimated_amount: number;
}> {
  return nowApi(
    `/estimate?amount=${amountUsd}&currency_from=${currencyFrom}&currency_to=${currencyTo}`
  );
}

// ─── Create Invoice (legacy — kept for fallback) ────────────

export interface CreateInvoiceParams {
  priceAmount: number;
  priceCurrency?: string;
  orderId: string;
  orderDescription?: string;
  successUrl?: string;
  cancelUrl?: string;
  ipnCallbackUrl?: string;
  isFeePaidByUser?: boolean;
}

export interface InvoiceResponse {
  id: string;
  token_id: string;
  order_id: string;
  order_description: string;
  price_amount: number;
  price_currency: string;
  pay_currency: string | null;
  ipn_callback_url: string;
  invoice_url: string;
  success_url: string;
  cancel_url: string;
  created_at: string;
  updated_at: string;
  is_fee_paid_by_user: boolean;
}

export async function createInvoice(params: CreateInvoiceParams): Promise<InvoiceResponse> {
  return nowApi<InvoiceResponse>('/invoice', {
    method: 'POST',
    body: JSON.stringify({
      price_amount: params.priceAmount,
      price_currency: params.priceCurrency || 'usd',
      order_id: params.orderId,
      order_description: params.orderDescription || '',
      success_url: params.successUrl || '',
      cancel_url: params.cancelUrl || '',
      ipn_callback_url: params.ipnCallbackUrl || '',
      is_fee_paid_by_user: params.isFeePaidByUser || false,
    }),
  });
}

// ─── Create Payment (inline — returns deposit address) ──────

export interface CreatePaymentParams {
  priceAmount: number;
  priceCurrency?: string;
  payCurrency: string;       // e.g., 'btc', 'eth', 'usdttrc20'
  orderId: string;
  orderDescription?: string;
  ipnCallbackUrl?: string;
  isFeePaidByUser?: boolean;
  case?: string;             // Associate with a custody case
}

export interface PaymentResponse {
  payment_id: string;
  payment_status: string;
  pay_address: string;
  payin_extra_id: string | null;
  price_amount: number;
  price_currency: string;
  pay_amount: number;
  amount_received: number;
  pay_currency: string;
  order_id: string;
  order_description: string;
  ipn_callback_url: string;
  created_at: string;
  updated_at: string;
  purchase_id: string;
  burning_percent: number | null;
  expiration_estimate_date: string;
}

export async function createPayment(params: CreatePaymentParams): Promise<PaymentResponse> {
  return nowApi<PaymentResponse>('/payment', {
    method: 'POST',
    body: JSON.stringify({
      price_amount: params.priceAmount,
      price_currency: params.priceCurrency || 'usd',
      pay_currency: params.payCurrency,
      order_id: params.orderId,
      order_description: params.orderDescription || '',
      ipn_callback_url: params.ipnCallbackUrl || '',
      is_fee_paid_by_user: params.isFeePaidByUser || false,
      ...(params.case ? { case: params.case } : {}),
    }),
  });
}

// ─── Get Payment Status ─────────────────────────────────────

export interface PaymentStatus {
  payment_id: number;
  invoice_id: number | null;
  payment_status: string;
  pay_address: string;
  payin_extra_id: string | null;
  price_amount: number;
  price_currency: string;
  pay_amount: number;
  actually_paid: number;
  actually_paid_at_fiat: number;
  pay_currency: string;
  order_id: string;
  order_description: string;
  purchase_id: string;
  outcome_amount: number;
  outcome_currency: string;
}

export async function getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
  return nowApi<PaymentStatus>(`/payment/${paymentId}`);
}

// ═════════════════════════════════════════════════════════════
//  CUSTODY — Customer Management (Sub-Partner Accounts)
// ═════════════════════════════════════════════════════════════

/**
 * Create a custody sub-partner account for a business tenant.
 * Each business maps to one NOWPayments "customer".
 * Name must be unique, max 30 chars, NOT an email.
 */
export interface CustodyCustomer {
  id: string;           // e.g., "1515573197"
  name: string;         // The unique name we set
  created_at: string;
  updated_at: string;
}

export async function createCustodyCustomer(
  name: string
): Promise<{ result: CustodyCustomer }> {
  if (name.length > 30) {
    throw new Error('Custody customer name must be 30 chars or less');
  }
  return custodyApi<{ result: CustodyCustomer }>('/sub-partner/balance', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
}

/**
 * Get a custody customer's balance across all cryptocurrencies.
 */
export interface CustodyBalance {
  subPartnerId: string;
  balances: Record<string, { amount: number; pendingAmount: number }>;
}

export async function getCustodyCustomerBalance(
  customerId: string
): Promise<{ result: CustodyBalance }> {
  return nowApi<{ result: CustodyBalance }>(`/sub-partner/balance/${customerId}`);
}

/**
 * List all custody customers (sub-partners) with pagination.
 */
export interface CustodyCustomerListItem {
  id: string;
  name: string;
  created_at: string;
}

export async function listCustodyCustomers(params?: {
  id?: string;
  offset?: number;
  limit?: number;
  order?: 'ASC' | 'DESC';
}): Promise<{ result: CustodyCustomerListItem[]; count: number }> {
  const searchParams = new URLSearchParams();
  if (params?.id) searchParams.set('id', params.id);
  if (params?.offset) searchParams.set('offset', String(params.offset));
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.order) searchParams.set('order', params.order);
  const qs = searchParams.toString();
  return nowApi<{ result: CustodyCustomerListItem[]; count: number }>(
    `/sub-partner${qs ? `?${qs}` : ''}`
  );
}

/**
 * Create a deposit address for a custody customer.
 * Use this to let a business top up their custody balance directly.
 */
export async function createCustodyDeposit(params: {
  subPartnerId: string;
  currency: string;
  ipnCallbackUrl?: string;
}): Promise<Record<string, unknown>> {
  return custodyApi('/sub-partner/deposit', {
    method: 'POST',
    body: JSON.stringify({
      sub_partner_id: params.subPartnerId,
      currency: params.currency,
      ipn_callback_url: params.ipnCallbackUrl || '',
    }),
  });
}

/**
 * Create a custody payment for a customer (payment goes to their sub-account).
 */
export async function createCustodyPayment(params: {
  subPartnerId: string;
  priceAmount: number;
  priceCurrency?: string;
  payCurrency: string;
  orderId: string;
  orderDescription?: string;
  ipnCallbackUrl?: string;
}): Promise<PaymentResponse> {
  return custodyApi<PaymentResponse>('/sub-partner/payment', {
    method: 'POST',
    body: JSON.stringify({
      sub_partner_id: params.subPartnerId,
      price_amount: params.priceAmount,
      price_currency: params.priceCurrency || 'usd',
      pay_currency: params.payCurrency,
      order_id: params.orderId,
      order_description: params.orderDescription || '',
      ipn_callback_url: params.ipnCallbackUrl || '',
    }),
  });
}

/**
 * Convert between currencies within custody.
 */
export async function createCustodyConversion(params: {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
}): Promise<Record<string, unknown>> {
  return custodyApi('/conversion', {
    method: 'POST',
    body: JSON.stringify({
      from_currency: params.fromCurrency,
      to_currency: params.toCurrency,
      amount: params.amount,
    }),
  });
}

// ─── IPN Signature Verification ─────────────────────────────

function sortObject(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.keys(obj)
    .sort()
    .reduce<Record<string, unknown>>((result, key) => {
      const val = obj[key];
      result[key] =
        val && typeof val === 'object' && !Array.isArray(val)
          ? sortObject(val as Record<string, unknown>)
          : val;
      return result;
    }, {});
}

export function verifyIpnSignature(
  body: Record<string, unknown>,
  receivedSignature: string
): boolean {
  const sorted = sortObject(body);
  const hmac = crypto.createHmac('sha512', IPN_SECRET);
  hmac.update(JSON.stringify(sorted));
  const computed = hmac.digest('hex');
  return computed === receivedSignature;
}

// ─── NOWPayments payment statuses explained ─────────────────
// 'waiting'         — waiting for customer to send crypto
// 'confirming'      — transaction detected, waiting for confirmations
// 'confirmed'       — enough confirmations, processing exchange
// 'sending'         — sending to your payout wallet
// 'partially_paid'  — customer sent less than required
// 'finished'        — payment completed successfully
// 'failed'          — payment failed
// 'refunded'        — payment refunded
// 'expired'         — payment expired

export function isPaymentFinished(status: string): boolean {
  return status === 'finished';
}

export function isPaymentPending(status: string): boolean {
  return ['waiting', 'confirming', 'confirmed', 'sending'].includes(status);
}

export function isPaymentFailed(status: string): boolean {
  return ['failed', 'expired', 'refunded'].includes(status);
}

// ─── Supported coin display config ──────────────────────────

export interface CryptoOption {
  id: string;        // NOWPayments currency code
  name: string;      // Display name
  symbol: string;    // Symbol e.g. BTC
  icon: string;      // Emoji or icon key
  color: string;     // Brand color
}

export const SUPPORTED_CRYPTOS: CryptoOption[] = [
  { id: 'btc',        name: 'Bitcoin',       symbol: 'BTC',  icon: '₿', color: '#F7931A' },
  { id: 'eth',        name: 'Ethereum',      symbol: 'ETH',  icon: 'Ξ', color: '#627EEA' },
  { id: 'usdttrc20',  name: 'USDT (TRC20)',  symbol: 'USDT', icon: '₮', color: '#26A17B' },
  { id: 'usdterc20',  name: 'USDT (ERC20)',  symbol: 'USDT', icon: '₮', color: '#26A17B' },
  { id: 'usdcsol',    name: 'USDC (SOL)',    symbol: 'USDC', icon: '$', color: '#2775CA' },
  { id: 'sol',        name: 'Solana',        symbol: 'SOL',  icon: '◎', color: '#9945FF' },
  { id: 'ltc',        name: 'Litecoin',      symbol: 'LTC',  icon: 'Ł', color: '#BFBBBB' },
  { id: 'doge',       name: 'Dogecoin',      symbol: 'DOGE', icon: 'Ð', color: '#C2A633' },
  { id: 'xrp',        name: 'XRP',           symbol: 'XRP',  icon: '✕', color: '#23292F' },
  { id: 'trx',        name: 'TRON',          symbol: 'TRX',  icon: '⟁', color: '#FF0013' },
];

// ─── Withdrawal fee config ──────────────────────────────────

/** Platform fee on crypto withdrawals (1% or $2 minimum) */
export const CRYPTO_WITHDRAWAL_FEE_PERCENT = 1;
export const CRYPTO_WITHDRAWAL_MIN_FEE_USD = 2;

export function calculateWithdrawalFee(amountUsd: number): number {
  const percentFee = amountUsd * (CRYPTO_WITHDRAWAL_FEE_PERCENT / 100);
  return Math.max(percentFee, CRYPTO_WITHDRAWAL_MIN_FEE_USD);
}
