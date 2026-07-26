'use client';

import { usePermission } from '@/lib/auth/usePermission';
import type { Permission } from '@/types/api';

interface PermissionGateProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Client-side convenience gate for conditionally rendering UI (buttons,
 * sections, whole panels) based on the session's permission strings.
 *
 * This is NOT the security boundary, the backend's permission.middleware.js
 * enforces every write on the server regardless of what this renders, and
 * middleware.ts (TAD §10) is the real gate for whether /admin/* renders at
 * all. This component exists purely so an admin without a permission
 * doesn't see controls that would 403 anyway.
 */
export function PermissionGate({ permission, children, fallback = null }: PermissionGateProps) {
  const allowed = usePermission(permission);
  return allowed ? <>{children}</> : <>{fallback}</>;
}
