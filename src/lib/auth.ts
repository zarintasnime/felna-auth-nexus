/**
 * Session & Authentication Boilerplate
 * 
 * Handles session tokens, cookie options, and auth utilities.
 */

export interface SessionPayload {
  userId: string;
  phone: string;
  role: string;
  expiresAt: Date;
}

export const SESSION_COOKIE_NAME = "felma_session";

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function createSession(payload: Omit<SessionPayload, "expiresAt">): Promise<string> {
  // Implementation will use jose / JWT in Phase 5
  return `session_${payload.userId}`;
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  // Implementation will verify token in Phase 5
  if (!token) return null;
  return null;
}
