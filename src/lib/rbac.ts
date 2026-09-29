import { getSession, SessionPayload } from "./auth";
import { ROLES, Role } from "./constants/roles";
import { PERMISSIONS, Permission, ROLE_PERMISSIONS } from "./constants/permissions";

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

  // SUPER_ADMIN has full access to all admin capabilities
  if (session.role === ROLES.SUPER_ADMIN) {
    return session;
  }

  if (session.role !== requiredRole) {
    throw new AuthError(
      `Access denied. This section requires ${requiredRole} administrative privileges.`,
      403
    );
  }

  return session;
}

/**
 * Checks whether a given role holds the requested granular permission.
 */
export function hasPermission(
  role: string | null | undefined,
  permission: Permission
): boolean {
  if (!role) return false;
  const granted = ROLE_PERMISSIONS[role] || [];
  return granted.includes(permission);
}

/**
 * Asserts that the authenticated user has a specific granular capability/permission.
 * Throws an AuthError (401 or 403) if unauthorized.
 */
export async function requirePermission(
  permission: Permission
): Promise<SessionPayload> {
  const session = await requireAuth();

  // SUPER_ADMIN has full access to all system capabilities
  if (session.role === ROLES.SUPER_ADMIN) {
    return session;
  }

  if (!hasPermission(session.role, permission)) {
    throw new AuthError(
      `Access denied. You lack the '${permission}' permission to perform this operation.`,
      403
    );
  }

  return session;
}

/**
 * Helper to check if a user can manage CMS content (write/edit).
 * Accepts either a SessionPayload or a role string.
 */
export function canManageCMS(sessionOrRole: SessionPayload | string | null | undefined): boolean {
  if (!sessionOrRole) return false;
  const role = typeof sessionOrRole === "string" ? sessionOrRole : sessionOrRole.role;
  return (
    role === ROLES.ADMIN ||
    role === ROLES.SUPER_ADMIN ||
    hasPermission(role, PERMISSIONS.CMS_WRITE)
  );
}

/**
 * Helper to check if a user is an admin without throwing.
 * Accepts either a SessionPayload or a role string.
 */
export function isAdmin(sessionOrRole: SessionPayload | string | null | undefined): boolean {
  if (!sessionOrRole) return false;
  const role = typeof sessionOrRole === "string" ? sessionOrRole : sessionOrRole.role;
  return role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN;
}
