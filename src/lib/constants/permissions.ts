/**
 * System Permissions & Capability Matrix
 * Provides decoupled, granular permissions for enterprise RBAC.
 */

export const PERMISSIONS = {
  CMS_READ: "cms:read",
  CMS_WRITE: "cms:write",
  CMS_PUBLISH: "cms:publish",
  CMS_DELETE: "cms:delete",
  USERS_MANAGE: "users:manage",
  SETTINGS_MANAGE: "settings:manage",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/**
 * Role-to-Permissions Mapping
 */
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  SUPER_ADMIN: [
    PERMISSIONS.CMS_READ,
    PERMISSIONS.CMS_WRITE,
    PERMISSIONS.CMS_PUBLISH,
    PERMISSIONS.CMS_DELETE,
    PERMISSIONS.USERS_MANAGE,
    PERMISSIONS.SETTINGS_MANAGE,
  ],
  ADMIN: [
    PERMISSIONS.CMS_READ,
    PERMISSIONS.CMS_WRITE,
    PERMISSIONS.CMS_PUBLISH,
    PERMISSIONS.CMS_DELETE,
    PERMISSIONS.USERS_MANAGE,
    PERMISSIONS.SETTINGS_MANAGE,
  ],
  EDITOR: [
    PERMISSIONS.CMS_READ,
    PERMISSIONS.CMS_WRITE,
    PERMISSIONS.CMS_PUBLISH,
  ],
  USER: [],
};
