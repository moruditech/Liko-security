import { useAuth } from '@/lib/auth/AuthProvider';
import type { Permission } from '@/types/api';

/**
 * Reads permission strings from the authenticated session only. Never gate
 * UI on user.role name (TAD §10), role display strings can change or be
 * renamed by an admin editing /admin/roles without the underlying
 * permission set changing, and vice versa.
 */
export function usePermission(permission: Permission): boolean {
  const { hasPermission } = useAuth();
  return hasPermission(permission);
}
