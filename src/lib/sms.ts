import crypto from "crypto";
import { db } from "./db";

// =============================================================================
// Configuration & Constants
// =============================================================================

export const OTP_CONFIG = {
  CODE_LENGTH: 6,
  COOLDOWN_SECONDS: 120, // 2 minutes cooldown matching expiration
  MAX_FAILED_ATTEMPTS: 5,
  EXPIRATION_SECONDS: 120, // 2 minutes (120 seconds) exactly
  EXPIRATION_MINUTES: 2,
  RATE_LIMIT_WINDOW_SECONDS: 300, // 5 minutes sliding window
  MAX_REQUESTS_PER_WINDOW: 3, // Maximum 3 OTP requests per 5 minutes
} as const;

/**
 * Standard IGL SMS API Response Codes and User-Facing Descriptions.
 */
export const IGL_RESPONSE_CODES: Record<
  string,
  { description: string; userMessage: string; isError: boolean }
> = {
  "445000": {
    description: "Message Sent successfully",
    userMessage: "Message sent successfully.",
    isError: false,
  },
  "445010": {
    description: "missing api key",
    userMessage: "SMS gateway configuration error: missing API key.",
    isError: true,
  },
  "445020": {
    description: "missing contact number",
    userMessage: "Please provide a valid recipient contact number.",
    isError: true,
  },
  "445030": {
    description: "missing sender id",
    userMessage: "SMS gateway configuration error: missing sender ID.",
    isError: true,
  },
  "445040": {
    description: "Invalid api key",
    userMessage: "SMS gateway authentication error: invalid API key.",
    isError: true,
  },
  "445050": {
    description: "Your account was suspended",
    userMessage: "SMS gateway account is currently suspended. Please contact support.",
    isError: true,
  },
  "445060": {
    description: "Your account was expired",
    userMessage: "SMS gateway account has expired. Please renew the subscription.",
    isError: true,
  },
  "445070": {
    description: "Only a user can send sms",
    userMessage: "SMS gateway permission error: unauthorized account type.",
    isError: true,
  },
  "445080": {
    description: "Invalid sender id",
    userMessage: "SMS gateway configuration error: invalid sender ID.",
    isError: true,
  },
  "445090": {
    description: "You have no access to this sender id",
    userMessage: "SMS gateway permission error: no access to the configured sender ID.",
    isError: true,
  },
  "445100": {
    description: "Access Denied,Your IP is not whitelisted",
    userMessage: "SMS dispatch denied: Server IP is not whitelisted in the SMS gateway.",
    isError: true,
  },
  "445110": {
    description: "All numbers are invalid",
    userMessage: "The provided phone number is invalid for SMS delivery.",
    isError: true,
  },
  "445120": {
    description: "insufficient balance",
    userMessage: "SMS gateway account has insufficient balance. Please recharge the SMS account.",
    isError: true,
  },
  "445130": {
    description: "reseller insufficient balance",
    userMessage: "SMS gateway reseller account has insufficient balance.",
    isError: true,
  },
  "445170": {
    description: "You are not a user",
    userMessage: "SMS gateway account error: user account not found.",
    isError: true,
  },
};

// =============================================================================
// Types & Interfaces
// =============================================================================

export interface SendSmsParams {
  phone: string;
  message: string;
}

export interface SmsResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface OtpRecord {
  id: string;
  phone: string;
  otpHash: string;
  attempts: number;
  expiresAt: Date;
  verifiedAt: Date | null;
  createdAt: Date;
}

export interface OtpStore {
  createOtp(phone: string, otpHash: string, expiresAt: Date): Promise<OtpRecord>;
  findLatestOtp(phone: string): Promise<OtpRecord | null>;
  incrementAttempts(id: string): Promise<OtpRecord>;
  markVerified(id: string): Promise<OtpRecord>;
  markExpired(id: string): Promise<OtpRecord>;
  getRecentOtps(phone: string, since: Date): Promise<OtpRecord[]>;
  invalidateUnverifiedOtps?(phone: string): Promise<number>;
}

export interface RequestOtpResult {
  success: boolean;
  message?: string;
  error?: string;
  waitSeconds?: number;
}

export interface VerifyOtpResult {
  success: boolean;
  message?: string;
  error?: string;
  remainingAttempts?: number;
}

// =============================================================================
// Phone Normalization
// =============================================================================

/**
 * Normalizes Bangladesh phone numbers to E.164 standard (+8801XXXXXXXXX).
 */
export function normalizeBdPhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-()]/g, "");
  if (cleaned.startsWith("+880")) {
    return cleaned;
  }
  if (cleaned.startsWith("880")) {
    return `+${cleaned}`;
  }
  if (cleaned.startsWith("01")) {
    return `+88${cleaned}`;
  }
  return cleaned;
}

// =============================================================================
// Cryptographic Helpers (OTP Generation & SHA-256 Hashing)
// =============================================================================

/**
 * Generates a cryptographically secure 6-digit OTP.
 */
export function generateOtp(): string {
  // crypto.randomInt(min, max) -> min <= n < max
  // 100000 to 1000000 yields integer in [100000, 999999]
  return crypto.randomInt(100000, 1000000).toString();
}

/**
 * Computes a secure SHA-256 hash of an OTP code with salt.
 */
export function hashOtp(otp: string, salt: string = ""): string {
  const secretSalt = salt || process.env.JWT_SECRET || "felna_secure_otp_salt";
  return crypto.createHash("sha256").update(`${otp}:${secretSalt}`).digest("hex");
}

/**
 * Performs timing-safe comparison of submitted OTP against stored hash.
 */
export function verifyOtpHash(otp: string, hash: string, salt: string = ""): boolean {
  const computed = hashOtp(otp, salt);
  if (computed.length !== hash.length) {
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(hash));
}

/**
 * Formats a phone number for the IGL SMS Gateway (e.g. 8801XXXXXXXXX).
 */
export function formatPhoneForIgl(phone: string): string {
  const cleaned = phone.replace(/[\s\-()+]/g, "");
  if (cleaned.startsWith("01")) {
    return `88${cleaned}`;
  }
  if (cleaned.startsWith("8801")) {
    return cleaned;
  }
  return cleaned;
}

// =============================================================================
// IGL SMS Gateway Client
// =============================================================================

/**
 * Dispatches an SMS via IGL SMS API with mock fallback for local testing.
 * Endpoint: http://sms.iglweb.com/api/v1/send?api_key=(API KEY)&contacts=(NUMBER)&senderid=(Approved Sender ID)&msg=(Message Content)
 */
export async function sendSms({ phone, message }: SendSmsParams): Promise<SmsResponse> {
  const apiKey = process.env.IGL_API_KEY;
  const isMock =
    process.env.MOCK_SMS === "true" ||
    !apiKey ||
    apiKey === "your_igl_sms_api_key";

  if (isMock) {
    console.log(`\n================== [IGL SMS MOCK] ==================`);
    console.log(`📱 Target Phone : ${phone} (IGL Format: ${formatPhoneForIgl(phone)})`);
    console.log(`💬 Message      : ${message}`);
    console.log(`ℹ️  Note         : Mock mode active (MOCK_SMS=true or no API key)`);
    console.log(`====================================================\n`);
    return {
      success: true,
      messageId: `mock_${Date.now()}`,
    };
  }

  const apiUrl = process.env.IGL_API_URL || "http://sms.iglweb.com/api/v1/send";
  const senderId = process.env.IGL_SENDER_ID || "01844532630";
  const contacts = formatPhoneForIgl(phone);

  try {
    const url = new URL(apiUrl);
    url.searchParams.set("api_key", apiKey);
    url.searchParams.set("contacts", contacts);
    url.searchParams.set("senderid", senderId);
    url.searchParams.set("msg", message);

    console.log(`\n================== [IGL SMS DISPATCH] ==================`);
    console.log(`📱 Target Phone   : ${phone}`);
    console.log(`📞 Contacts (IGL) : ${contacts}`);
    console.log(`✉️  Sender ID      : ${senderId}`);
    console.log(`💬 Message Content: ${message}`);
    console.log(`🌐 Gateway URL    : ${apiUrl}`);
    console.log(`========================================================`);

    const response = await fetch(url.toString(), {
      method: "GET",
      signal: AbortSignal.timeout(10000), // 10-second timeout guard
    });

    const responseText = await response.text();

    console.log(`\n================== [IGL SMS RESPONSE] ==================`);
    console.log(`📱 Target Phone   : ${phone}`);
    console.log(`📊 HTTP Status    : ${response.status} ${response.statusText}`);
    console.log(`📄 Response Body  : ${responseText}`);
    console.log(`========================================================\n`);

    if (!response.ok) {
      console.error(`[IGL SMS HTTP ERROR] Status: ${response.status} - ${responseText}`);
      return {
        success: false,
        error: "Failed to dispatch SMS through gateway. Please try again later.",
      };
    }

    // Attempt to parse JSON response or handle text status
    try {
      const data = JSON.parse(responseText);
      const codeKey = data.code ? String(data.code) : undefined;
      const knownCode = codeKey ? IGL_RESPONSE_CODES[codeKey] : undefined;

      const isIglError =
        (knownCode && knownCode.isError) ||
        (data.code && data.code !== "445000" && data.code !== 445000) ||
        data.status === "failed" ||
        data.status === "error" ||
        (data.response_code && data.response_code >= 400) ||
        (typeof data.message === "string" && (
          data.message.toLowerCase().includes("balance") ||
          data.message.toLowerCase().includes("recharge") ||
          data.message.toLowerCase().includes("invalid") ||
          data.message.toLowerCase().includes("error") ||
          data.message.toLowerCase().includes("failed")
        ));

      if (isIglError) {
        console.error("[IGL SMS GATEWAY ERROR]", {
          ...data,
          interpreted: knownCode ? knownCode.description : undefined,
        });

        const errorMsg =
          knownCode?.userMessage ||
          data.message ||
          data.error ||
          "SMS gateway rejected the dispatch request.";

        return {
          success: false,
          error: errorMsg,
        };
      }

      console.log(`[IGL SMS SUCCESS] SMS dispatched successfully to ${phone}. Message ID / Code: ${data.message_id || data.id || data.code}`);
      return {
        success: true,
        messageId: data.message_id || data.id || (data.code === "445000" ? "445000" : "igl_ok"),
      };
    } catch {
      // Non-JSON response (status text or transaction ID)
      if (
        responseText.toLowerCase().includes("error") ||
        responseText.toLowerCase().includes("failed") ||
        responseText.toLowerCase().includes("invalid")
      ) {
        console.error(`[IGL SMS RESPONSE ERROR] ${responseText}`);
        return {
          success: false,
          error: "SMS gateway reported a dispatch error. Please verify credentials.",
        };
      }
      console.log(`[IGL SMS SUCCESS] Raw text dispatch confirmation for ${phone}: ${responseText.trim()}`);
      return {
        success: true,
        messageId: responseText.trim(),
      };
    }
  } catch (err: any) {
    if (err.name === "TimeoutError") {
      console.error("[IGL SMS TIMEOUT] Gateway did not respond within 10 seconds.");
      return {
        success: false,
        error: "SMS gateway request timed out. Please try again in a few moments.",
      };
    }
    console.error("[IGL SMS EXCEPTION]", err);
    return {
      success: false,
      error: "Unable to connect to SMS gateway. Please verify your connection.",
    };
  }
}

/**
 * Queries the IGL Gateway for current account balance.
 */
export async function checkIglBalance(): Promise<{ success: boolean; balance?: string; error?: string }> {
  const apiKey = process.env.IGL_API_KEY;
  if (!apiKey) {
    return { success: false, error: "IGL_API_KEY is not configured." };
  }
  try {
    const url = `http://sms.iglweb.com/api/v1/balance?api_key=${apiKey}`;
    const res = await fetch(url, { method: "GET", signal: AbortSignal.timeout(5000) });
    const data = await res.json();
    if (data.code === "445000" && data.balance) {
      return { success: true, balance: data.balance };
    }
    return { success: false, error: data.message || "Failed to retrieve balance." };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// =============================================================================
// Storage Implementations (Prisma & In-Memory)
// =============================================================================

export class PrismaOtpStore implements OtpStore {
  async createOtp(phone: string, otpHash: string, expiresAt: Date): Promise<OtpRecord> {
    return await db.otpVerification.create({
      data: {
        phone,
        otpHash,
        expiresAt,
        attempts: 0,
      },
    });
  }

  async findLatestOtp(phone: string): Promise<OtpRecord | null> {
    return await db.otpVerification.findFirst({
      where: { phone },
      orderBy: { createdAt: "desc" },
    });
  }

  async incrementAttempts(id: string): Promise<OtpRecord> {
    return await db.otpVerification.update({
      where: { id },
      data: { attempts: { increment: 1 } },
    });
  }

  async markVerified(id: string): Promise<OtpRecord> {
    return await db.otpVerification.update({
      where: { id },
      data: { verifiedAt: new Date() },
    });
  }

  async markExpired(id: string): Promise<OtpRecord> {
    return await db.otpVerification.update({
      where: { id },
      data: { expiresAt: new Date(0) },
    });
  }

  async invalidateUnverifiedOtps(phone: string): Promise<number> {
    try {
      const res = await db.otpVerification.updateMany({
        where: {
          phone,
          verifiedAt: null,
          expiresAt: { gt: new Date(0) },
        },
        data: {
          expiresAt: new Date(0),
        },
      });
      return res.count;
    } catch {
      return 0;
    }
  }

  async getRecentOtps(phone: string, since: Date): Promise<OtpRecord[]> {
    try {
      return await db.otpVerification.findMany({
        where: {
          phone,
          createdAt: { gte: since },
        },
        orderBy: { createdAt: "asc" },
      });
    } catch {
      return [];
    }
  }
}

export class InMemoryOtpStore implements OtpStore {
  private records: OtpRecord[] = [];

  async createOtp(phone: string, otpHash: string, expiresAt: Date): Promise<OtpRecord> {
    const record: OtpRecord = {
      id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      phone,
      otpHash,
      attempts: 0,
      expiresAt,
      verifiedAt: null,
      createdAt: new Date(),
    };
    this.records.unshift(record);
    return record;
  }

  async findLatestOtp(phone: string): Promise<OtpRecord | null> {
    return this.records.find((r) => r.phone === phone) || null;
  }

  async incrementAttempts(id: string): Promise<OtpRecord> {
    const record = this.records.find((r) => r.id === id);
    if (!record) throw new Error("OTP record not found.");
    record.attempts += 1;
    return { ...record };
  }

  async markVerified(id: string): Promise<OtpRecord> {
    const record = this.records.find((r) => r.id === id);
    if (!record) throw new Error("OTP record not found.");
    record.verifiedAt = new Date();
    return { ...record };
  }

  async markExpired(id: string): Promise<OtpRecord> {
    const record = this.records.find((r) => r.id === id);
    if (!record) throw new Error("OTP record not found.");
    record.expiresAt = new Date(0);
    return { ...record };
  }

  async invalidateUnverifiedOtps(phone: string): Promise<number> {
    let count = 0;
    for (const r of this.records) {
      if (r.phone === phone && !r.verifiedAt && r.expiresAt.getTime() > 0) {
        r.expiresAt = new Date(0);
        count++;
      }
    }
    return count;
  }

  async getRecentOtps(phone: string, since: Date): Promise<OtpRecord[]> {
    return this.records
      .filter((r) => r.phone === phone && r.createdAt >= since)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  setCreatedAt(id: string, date: Date) {
    const record = this.records.find((r) => r.id === id);
    if (record) record.createdAt = date;
  }

  clear() {
    this.records = [];
  }
}

// Default storage uses Prisma client
const defaultStore: OtpStore = new PrismaOtpStore();

// =============================================================================
// High-Level OTP Service Functions (Rate-Limiting & Verification)
// =============================================================================

/**
 * Requests an OTP for a phone number with strict 3-per-5-minutes rate limit and 2-minute cooldown.
 */
export async function requestOtp(
  rawPhone: string,
  store: OtpStore = defaultStore
): Promise<RequestOtpResult> {
  const phone = normalizeBdPhone(rawPhone);

  // 1. Strict 5-Minute Window Rate Limiting: Max 3 requests per 5 minutes per phone
  const windowStart = new Date(Date.now() - OTP_CONFIG.RATE_LIMIT_WINDOW_SECONDS * 1000);
  const recentOtps = await store.getRecentOtps(phone, windowStart);

  if (recentOtps.length >= OTP_CONFIG.MAX_REQUESTS_PER_WINDOW) {
    const oldest = recentOtps[0];
    const elapsed = Math.floor((Date.now() - oldest.createdAt.getTime()) / 1000);
    const waitSeconds = Math.max(1, OTP_CONFIG.RATE_LIMIT_WINDOW_SECONDS - elapsed);
    console.warn(`[OTP RATE LIMIT] Phone ${phone} reached limit of ${OTP_CONFIG.MAX_REQUESTS_PER_WINDOW} requests per 5 minutes.`);
    return {
      success: false,
      error: `Rate limit reached: Maximum 3 OTP requests allowed per 5 minutes. Please wait ${waitSeconds} seconds before trying again.`,
      waitSeconds,
    };
  }

  // 2. Cooldown check on the most recent unverified OTP
  // NOTE: Cooldown applies only if the current OTP is still active (< 120s and not locked).
  // If it has already expired or reached max failed attempts, the user can request a new code immediately.
  const latest = await store.findLatestOtp(phone);
  if (latest && !latest.verifiedAt) {
    const isExpired = Date.now() >= latest.expiresAt.getTime();
    const isLocked = latest.attempts >= OTP_CONFIG.MAX_FAILED_ATTEMPTS;

    if (!isExpired && !isLocked) {
      const elapsedSeconds = Math.floor((Date.now() - latest.createdAt.getTime()) / 1000);
      // Allow 1 second tolerance for network / client-server clock skew
      if (elapsedSeconds < (OTP_CONFIG.COOLDOWN_SECONDS - 1)) {
        const waitSeconds = Math.max(1, OTP_CONFIG.COOLDOWN_SECONDS - elapsedSeconds);
        return {
          success: false,
          error: `Please wait ${waitSeconds} seconds before requesting a new OTP.`,
          waitSeconds,
        };
      }
    }
  }

  // Invalidate any older active unverified OTPs in DB/store so only 1 OTP is ever valid at a time
  if (typeof store.invalidateUnverifiedOtps === "function") {
    await store.invalidateUnverifiedOtps(phone).catch(() => {});
  }

  const rawOtp = generateOtp();
  const otpHash = hashOtp(rawOtp);
  const expiresAt = new Date(Date.now() + OTP_CONFIG.EXPIRATION_SECONDS * 1000);

  console.log(`\n================== [OTP GENERATION] ==================`);
  console.log(`📱 Target Phone : ${phone}`);
  console.log(`🔑 Generated OTP: ${rawOtp}`);
  console.log(`⏳ Valid For    : 2 minutes (${OTP_CONFIG.EXPIRATION_SECONDS} seconds) (Expires at ${expiresAt.toLocaleTimeString()})`);
  console.log(`======================================================\n`);

  await store.createOtp(phone, otpHash, expiresAt);

  const smsResult = await sendSms({
    phone,
    message: `Your Felna verification code is: ${rawOtp}. Valid for 2 minutes.`,
  });

  if (!smsResult.success) {
    console.error(`[OTP ENGINE ERROR] Failed to send OTP to ${phone}:`, smsResult.error);
    return {
      success: false,
      error: smsResult.error || "Failed to send OTP SMS. Please try again.",
    };
  }

  console.log(`[OTP ENGINE] OTP dispatch confirmed for ${phone}`);
  return {
    success: true,
    message: "OTP sent successfully.",
  };
}

/**
 * Verifies a submitted OTP with attempt limit (max 5) and expiration check.
 */
export async function verifyOtp(
  rawPhone: string,
  submittedOtp: string,
  store: OtpStore = defaultStore
): Promise<VerifyOtpResult> {
  const phone = normalizeBdPhone(rawPhone);
  console.log(`\n================== [OTP VERIFICATION ATTEMPT] ==================`);
  console.log(`📱 Target Phone   : ${phone}`);
  console.log(`🔢 Submitted Code : ${submittedOtp}`);
  console.log(`================================================================`);

  const latest = await store.findLatestOtp(phone);

  if (!latest) {
    console.warn(`[OTP VERIFY] No OTP record found for phone: ${phone}`);
    return {
      success: false,
      error: "No OTP request found for this phone number. Please request a new OTP.",
    };
  }

  if (latest.verifiedAt) {
    console.warn(`[OTP VERIFY] OTP for ${phone} was already verified at ${latest.verifiedAt.toISOString()}`);
    return {
      success: false,
      error: "This OTP has already been verified.",
    };
  }

  if (latest.attempts >= OTP_CONFIG.MAX_FAILED_ATTEMPTS) {
    console.warn(`[OTP VERIFY] OTP for ${phone} is locked due to max attempts exceeded (${latest.attempts})`);
    return {
      success: false,
      error: "Too many failed attempts. This OTP has been locked. Please request a new one.",
      remainingAttempts: 0,
    };
  }

  if (Date.now() > latest.expiresAt.getTime()) {
    console.warn(`[OTP VERIFY] OTP for ${phone} has expired at ${latest.expiresAt.toISOString()}`);
    // Explicitly record expired state in database
    await store.markExpired(latest.id).catch(() => {});
    return {
      success: false,
      error: "OTP Expired. Please request a new code.",
    };
  }

  const isValid = verifyOtpHash(submittedOtp, latest.otpHash);

  if (!isValid) {
    const updated = await store.incrementAttempts(latest.id);
    const remaining = Math.max(0, OTP_CONFIG.MAX_FAILED_ATTEMPTS - updated.attempts);

    if (remaining <= 0) {
      await store.markExpired(latest.id);
      console.error(`[OTP VERIFY] Invalid OTP for ${phone}. Maximum attempts reached. Account locked.`);
      return {
        success: false,
        error: "Too many failed attempts. This OTP has been locked. Please request a new one.",
        remainingAttempts: 0,
      };
    }

    console.warn(`[OTP VERIFY] Invalid OTP entered for ${phone}. Remaining attempts: ${remaining}`);
    return {
      success: false,
      error: `Invalid OTP. You have ${remaining} attempts remaining.`,
      remainingAttempts: remaining,
    };
  }

  await store.markVerified(latest.id);
  // Clean up any remaining unverified OTPs in store/DB
  if (typeof store.invalidateUnverifiedOtps === "function") {
    await store.invalidateUnverifiedOtps(phone).catch(() => {});
  }
  console.log(`[OTP VERIFY] ✅ OTP successfully verified for ${phone}!`);

  return {
    success: true,
    message: "OTP verified successfully.",
  };
}
