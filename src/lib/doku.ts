import crypto from "crypto";

// ── Config ──────────────────────────────────────────────────────────────────
const DOKU_CLIENT_ID = process.env.DOKU_CLIENT_ID!;
const DOKU_SECRET_KEY = process.env.DOKU_SECRET_KEY!;
const DOKU_BASE_URL = process.env.DOKU_BASE_URL || "https://api-sandbox.doku.com";
const DOKU_PRIVATE_KEY = process.env.DOKU_PRIVATE_KEY!;
const DOKU_MERCHANT_ID = process.env.DOKU_MERCHANT_ID!;
const DOKU_TERMINAL_ID = process.env.DOKU_TERMINAL_ID || "A01";

// ── Helpers ─────────────────────────────────────────────────────────────────

/** ISO-8601 timestamp WITH timezone offset (required by SNAP) */
function snapTimestamp(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = now.getFullYear();
  const MM = pad(now.getMonth() + 1);
  const dd = pad(now.getDate());
  const hh = pad(now.getHours());
  const mm = pad(now.getMinutes());
  const ss = pad(now.getSeconds());
  const offset = -now.getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";
  const offH = pad(Math.floor(Math.abs(offset) / 60));
  const offM = pad(Math.abs(offset) % 60);
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}${sign}${offH}:${offM}`;
}

/** Numeric-only external ID, unique per day */
function externalId(): string {
  return Date.now().toString() + Math.floor(Math.random() * 1e8).toString();
}

/** SHA-256 → lowercase hex */
function sha256hex(data: string): string {
  return crypto.createHash("sha256").update(data, "utf8").digest("hex");
}

// ── Token cache ─────────────────────────────────────────────────────────────
let cachedToken: { accessToken: string; expiresAt: number } | null = null;

// ── 1. Get B2B Access Token ─────────────────────────────────────────────────
// Asymmetric signature: SHA256withRSA(privateKey, clientId + "|" + timestamp)

export async function getB2BToken(): Promise<string> {
  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.accessToken;
  }

  const timestamp = snapTimestamp();
  const stringToSign = `${DOKU_CLIENT_ID}|${timestamp}`;

  // Sign with RSA SHA-256
  const signer = crypto.createSign("SHA256");
  signer.update(stringToSign);
  signer.end();
  const asymmetricSignature = signer.sign(DOKU_PRIVATE_KEY, "base64");

  const requestBody = JSON.stringify({ grantType: "client_credentials" });

  const url = `${DOKU_BASE_URL}/authorization/v1/access-token/b2b`;

  console.log("[DOKU] Getting B2B token from:", url);
  console.log("[DOKU] X-TIMESTAMP:", timestamp);
  console.log("[DOKU] StringToSign:", stringToSign);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "X-CLIENT-KEY": DOKU_CLIENT_ID,
      "X-TIMESTAMP": timestamp,
      "X-SIGNATURE": asymmetricSignature,
      "Content-Type": "application/json",
    },
    body: requestBody,
  });

  const responseText = await response.text();
  console.log("[DOKU] Token response status:", response.status);
  console.log("[DOKU] Token response:", responseText);

  if (!response.ok) {
    throw new Error(`DOKU B2B token error: ${response.status} - ${responseText}`);
  }

  const data = JSON.parse(responseText);

  // Cache the token
  cachedToken = {
    accessToken: data.accessToken,
    expiresAt: Date.now() + (data.expiresIn || 900) * 1000,
  };

  return data.accessToken;
}

// ── 2. Symmetric Signature for SNAP transactions ────────────────────────────
// HMAC_SHA512(secretKey, HTTPMethod + ":" + EndpointUrl + ":" + AccessToken
//   + ":" + Lowercase(HexEncode(SHA-256(minify(body)))) + ":" + Timestamp)

function symmetricSignature(
  method: string,
  endpoint: string,
  accessToken: string,
  body: string,
  timestamp: string,
): string {
  const bodyHash = sha256hex(body).toLowerCase();
  const stringToSign = `${method}:${endpoint}:${accessToken}:${bodyHash}:${timestamp}`;

  const hmac = crypto
    .createHmac("sha512", DOKU_SECRET_KEY)
    .update(stringToSign, "utf8")
    .digest("base64");

  return hmac;
}

// ── Types ───────────────────────────────────────────────────────────────────

export interface GenerateQrisResponse {
  responseCode?: string;
  responseMessage?: string;
  referenceNo?: string;
  partnerReferenceNo?: string;
  qrContent?: string;
  terminalId?: string;
  additionalInfo?: {
    validityPeriod?: string;
  };
}

export interface QueryQrisResponse {
  responseCode?: string;
  responseMessage?: string;
  originalReferenceNo?: string;
  originalPartnerReferenceNo?: string;
  serviceCode?: string;
  latestTransactionStatus?: string;
  transactionStatusDesc?: string;
  paidTime?: string;
  amount?: { value: number; currency: string };
  additionalInfo?: Record<string, string>;
}

// ── 3. Generate QRIS ────────────────────────────────────────────────────────
// POST /snap-adapter/b2b/v1.0/qr/qr-mpm-generate

export async function generateQris(params: {
  invoiceNumber: string;
  amount: number;
  validityPeriod?: string; // ISO-8601, default 30 min from now
}): Promise<GenerateQrisResponse> {
  const accessToken = await getB2BToken();
  const endpoint = "/snap-adapter/b2b/v1.0/qr/qr-mpm-generate";
  const timestamp = snapTimestamp();
  const extId = externalId();

  // Default validity: 30 minutes from now
  const validity =
    params.validityPeriod ||
    new Date(Date.now() + 30 * 60 * 1000).toISOString().split(".")[0] + "+07:00";

  // Amount must be string with 2 decimal places
  const amountStr = Math.round(params.amount).toFixed(2);

  const payload = {
    partnerReferenceNo: params.invoiceNumber,
    amount: {
      value: amountStr,
      currency: "IDR",
    },
    merchantId: DOKU_MERCHANT_ID,
    terminalId: DOKU_TERMINAL_ID,
    validityPeriod: validity,
    additionalInfo: {
      postalCode: "12190",
      feeType: "1",
    },
  };

  const bodyString = JSON.stringify(payload);
  const signature = symmetricSignature("POST", endpoint, accessToken, bodyString, timestamp);

  console.log("[DOKU] Generate QRIS URL:", `${DOKU_BASE_URL}${endpoint}`);
  console.log("[DOKU] Generate QRIS Body:", bodyString);

  const response = await fetch(`${DOKU_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "X-PARTNER-ID": DOKU_CLIENT_ID,
      "X-EXTERNAL-ID": extId,
      "X-TIMESTAMP": timestamp,
      "X-SIGNATURE": signature,
      Authorization: `Bearer ${accessToken}`,
      "CHANNEL-ID": "H2H",
      "Content-Type": "application/json",
    },
    body: bodyString,
  });

  const responseText = await response.text();
  console.log("[DOKU] Generate QRIS status:", response.status);
  console.log("[DOKU] Generate QRIS response:", responseText);

  if (!response.ok) {
    throw new Error(`DOKU Generate QRIS error: ${response.status} - ${responseText}`);
  }

  return JSON.parse(responseText);
}

// ── 4. Query QRIS (check payment status) ────────────────────────────────────
// POST /snap-adapter/b2b/v1.0/qr/qr-mpm-query

export async function queryQris(params: {
  originalReferenceNo: string;
  originalPartnerReferenceNo: string;
}): Promise<QueryQrisResponse> {
  const accessToken = await getB2BToken();
  const endpoint = "/snap-adapter/b2b/v1.0/qr/qr-mpm-query";
  const timestamp = snapTimestamp();
  const extId = externalId();

  const payload = {
    originalReferenceNo: params.originalReferenceNo,
    originalPartnerReferenceNo: params.originalPartnerReferenceNo,
    serviceCode: "47",
    merchantId: DOKU_MERCHANT_ID,
  };

  const bodyString = JSON.stringify(payload);
  const signature = symmetricSignature("POST", endpoint, accessToken, bodyString, timestamp);

  const response = await fetch(`${DOKU_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "X-PARTNER-ID": DOKU_CLIENT_ID,
      "X-EXTERNAL-ID": extId,
      "X-TIMESTAMP": timestamp,
      "X-SIGNATURE": signature,
      Authorization: `Bearer ${accessToken}`,
      "CHANNEL-ID": "H2H",
      "Content-Type": "application/json",
    },
    body: bodyString,
  });

  const responseText = await response.text();
  console.log("[DOKU] Query QRIS status:", response.status);
  console.log("[DOKU] Query QRIS response:", responseText);

  if (!response.ok) {
    throw new Error(`DOKU Query QRIS error: ${response.status} - ${responseText}`);
  }

  return JSON.parse(responseText);
}

// ── 5. Notification signature verification (for webhook) ────────────────────
// DOKU sends HTTP notifications — verify symmetric signature

export function verifyNotificationSignature(
  method: string,
  endpoint: string,
  accessToken: string,
  rawBody: string,
  timestamp: string,
  signatureHeader: string,
): boolean {
  const expected = symmetricSignature(method, endpoint, accessToken, rawBody, timestamp);
  return signatureHeader === expected;
}
