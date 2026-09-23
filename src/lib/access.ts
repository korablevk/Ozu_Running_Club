import type { Access, FieldAccess } from "payload";

/**
 * Access control helper: Grants access only to users with the 'admin' role.
 */
export const isAdmin = ({ req: { user } }: { req: { user?: any } }): boolean => {
  return Boolean(user && user.role === "admin");
};

/**
 * Access control helper: Grants access to any authenticated user (admin or editor).
 */
export const isAuthenticated = ({ req: { user } }: { req: { user?: any } }): boolean => {
  return Boolean(user);
};

/**
 * Access control helper for Users collection:
 * Admin can read all users; editor can only read their own user record.
 */
export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false;
  if (user.role === "admin") return true;
  return {
    id: {
      equals: user.id,
    },
  };
};

/**
 * Field-level access control helper: Grants read/update only to admins.
 * Used to redact sensitive PII (e.g., student IDs, phone numbers) from non-admin accounts.
 */
export const isAdminField: FieldAccess = ({ req: { user } }) => {
  return Boolean(user && user.role === "admin");
};
