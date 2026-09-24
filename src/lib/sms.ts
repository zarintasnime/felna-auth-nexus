import crypto from "crypto";
import { db } from "./db";

// =============================================================================
// Configuration & Constants
// =============================================================================

export const OTP_CONFIG = {
  CODE_LENGTH: 6,
  COOLDOWN_SECONDS: 60,
  MAX_FAILED_ATTEMPTS: 5,
  EXPIRATION_MINUTES: 5,
} as const;

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
  const secretSalt = salt || process.env.JWT_SECRET || "felma_secure_otp_salt";
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

// =============================================================================
// IGL SMS Gateway Client
// =============================================================================

/**
 * Dispatches an SMS via IGL SMS API with mock fallback for local testing.
 */
export async function sendSms({ phone, message }: SendSmsParams): Promise<SmsResponse> {
  const apiKey = process.env.IGL_API_KEY;
  const isMock =
    process.env.MOCK_SMS === "true" ||
    !apiKey ||
    apiKey === "your_igl_sms_api_key" ||
    process.env.NODE_ENV !== "production";

  if (isMock) {
    console.log(`[IGL SMS MOCK] To: ${phone} | Content: ${message}`);
    return {
      success: true,
      messageId: `mock_${Date.now()}`,
    };
  }

  const apiUrl = process.env.IGL_API_URL || "https://api.iglsms.com/send";
  const senderId = process.env.IGL_SENDER_ID || "FELMA";

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: apiKey,
        sender_id: senderId,
        recipient: phone,
        message,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[IGL SMS ERROR] Status: ${response.status} - ${errorText}`);
      return {
        success: false,
        error: "Failed to dispatch SMS through gateway. Please try again later.",
      };
    }

    const data = await response.json();
    return {
      success: true,
      messageId: data.message_id || data.id,
    };
  } catch (err) {
    console.error("[IGL SMS EXCEPTION]", err);
    return {
      success: false,
      error: "Unable to connect to SMS gateway. Please verify your connection.",
    };
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

  setCreatedAt(id: string, date: Date) {
    const record = this.records.find((r) => r.id === id);
    if (record) record.createdAt = date;
  }
}

// Default storage uses Prisma client
const defaultStore: OtpStore = new PrismaOtpStore();

// =============================================================================
// High-Level OTP Service Functions (Rate-Limiting & Verification)
// =============================================================================

/**
 * Requests an OTP for a phone number with a 60-second cooldown rate limit.
 */
export async function requestOtp(
  rawPhone: string,
  store: OtpStore = defaultStore
): Promise<RequestOtpResult> {
  const phone = normalizeBdPhone(rawPhone);

  // Check 60-second cooldown on recent requests
  const latest = await store.findLatestOtp(phone);
  if (latest && !latest.verifiedAt) {
    const elapsedSeconds = Math.floor((Date.now() - latest.createdAt.getTime()) / 1000);
    if (elapsedSeconds < OTP_CONFIG.COOLDOWN_SECONDS) {
      const waitSeconds = OTP_CONFIG.COOLDOWN_SECONDS - elapsedSeconds;
      return {
        success: false,
        error: `Please wait ${waitSeconds} seconds before requesting a new OTP.`,
        waitSeconds,
      };
    }
  }

  const rawOtp = generateOtp();
  const otpHash = hashOtp(rawOtp);
  const expiresAt = new Date(Date.now() + OTP_CONFIG.EXPIRATION_MINUTES * 60 * 1000);

  await store.createOtp(phone, otpHash, expiresAt);

  const smsResult = await sendSms({
    phone,
    message: `Your Felma verification code is: ${rawOtp}. Valid for ${OTP_CONFIG.EXPIRATION_MINUTES} minutes.`,
  });

  if (!smsResult.success) {
    return {
      success: false,
      error: smsResult.error || "Failed to send OTP SMS. Please try again.",
    };
  }

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
  const latest = await store.findLatestOtp(phone);

  if (!latest) {
    return {
      success: false,
      error: "No OTP request found for this phone number. Please request a new OTP.",
    };
  }

  if (latest.verifiedAt) {
    return {
      success: false,
      error: "This OTP has already been verified.",
    };
  }

  if (latest.attempts >= OTP_CONFIG.MAX_FAILED_ATTEMPTS) {
    return {
      success: false,
      error: "Too many failed attempts. This OTP has been locked. Please request a new one.",
      remainingAttempts: 0,
    };
  }

  if (Date.now() > latest.expiresAt.getTime()) {
    return {
      success: false,
      error: "This OTP has expired. Please request a new one.",
    };
  }

  const isValid = verifyOtpHash(submittedOtp, latest.otpHash);

  if (!isValid) {
    const updated = await store.incrementAttempts(latest.id);
    const remaining = OTP_CONFIG.MAX_FAILED_ATTEMPTS - updated.attempts;

    if (remaining <= 0) {
      await store.markExpired(latest.id);
      return {
        success: false,
        error: "Too many failed attempts. This OTP has been locked. Please request a new one.",
        remainingAttempts: 0,
      };
    }

    return {
      success: false,
      error: `Invalid OTP. You have ${remaining} attempts remaining.`,
      remainingAttempts: remaining,
    };
  }

  await store.markVerified(latest.id);

  return {
    success: true,
    message: "OTP verified successfully.",
  };
}
