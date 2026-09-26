import { getSession, SessionPayload } from "./auth";
import { ROLES, Role } from "./constants/roles";

export class AuthError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 401) {
    super(message);
    this.name = "AuthError";
    this.statusCode = statusCode;
  }
}

/**
 * Asserts that the incoming request has a valid authenticated session.
 * Throws an AuthError (401) if unauthenticated.
 */
export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new AuthError(
      "Authentication required. Please sign in to access this resource.",
      401
    );
  }
  return session;
}

/**
 * Asserts that the authenticated user possesses the required role (e.g., ADMIN).
 * Throws an AuthError (403) if the user lacks the role.
 */
export async function requireRole(requiredRole: Role): Promise<SessionPayload> {
  const session = await requireAuth();

  if (session.role !== requiredRole) {
    throw new AuthError(
      `Access denied. This section requires ${requiredRole} administrative privileges.`,
      403
    );
  }

  return session;
}

/**
 * Helper to check if a user is an admin without throwing.
 */
export function isAdmin(session: SessionPayload | null): boolean {
  return session?.role === ROLES.ADMIN;
}
