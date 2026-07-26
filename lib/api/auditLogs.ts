import { fetcher } from '@/lib/fetcher';
import type { AuditLogEntry, Paginated } from '@/types/api';

export const auditLogsApi = {
  // Read-only, no write routes exist for this module.
  list: (params: { actor?: string; action?: string; from?: string; to?: string; page?: number }) =>
    fetcher.get<Paginated<AuditLogEntry>>(`/admin/audit-logs?${new URLSearchParams(params as Record<string, string>)}`),
};
