import { SignJWT, jwtVerify } from "jose";

// =============================================================================
// Constants & Secret Key
// =============================================================================

export const SESSION_COOKIE_NAME = "felna_session";
export const SESSION_EXPIRATION_TIME = "7d"; // 7 days
export const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

export function getSecretKey(): Uint8Array {
  const secret =
    process.env.JWT_SECRET || "felna_super_secret_jwt_key_minimum_32_characters_long";
  return new TextEncoder().encode(secret);
}

// =============================================================================
// Interfaces
// =============================================================================

export interface SessionPayload {
  userId: string;
  phone: string;
  role: string;
  name?: string;
  [key: string]: unknown;
}

export const sessionCookieOptions = {
  name: SESSION_COOKIE_NAME,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE,
};

// =============================================================================
// Edge-Safe JWT Signing & Verification
// =============================================================================

/**
 * Creates a signed JWT session token with 7-day expiration.
 */
export async function createSessionToken(payload: SessionPayload): Promise<string> {
  const secretKey = getSecretKey();
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_EXPIRATION_TIME)
    .sign(secretKey);
}

/**
 * Verifies a signed JWT session token and returns the payload if valid.
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  if (!token) return null;

  try {
    const secretKey = getSecretKey();
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });

    return {
      userId: payload.userId as string,
      phone: payload.phone as string,
      role: payload.role as string,
      name: payload.name as string | undefined,
    };
  } catch {
    return null;
  }
}
