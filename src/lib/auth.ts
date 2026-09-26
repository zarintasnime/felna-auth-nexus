import { cookies } from "next/headers";
import {
  SESSION_COOKIE_NAME,
  sessionCookieOptions,
  verifySessionToken,
  SessionPayload,
} from "./auth-token";

export * from "./auth-token";

// =============================================================================
// Server-Side Cookie Management (Next.js cookies())
// =============================================================================

/**
 * Stores the signed session JWT in an HttpOnly, Secure cookie.
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, sessionCookieOptions);
}

/**
 * Clears the session cookie on logout.
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    ...sessionCookieOptions,
    maxAge: 0,
  });
}

/**
 * Retrieves and validates the current session from incoming request cookies.
 */
export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}
