'use client';

import { useEffect, useState } from 'react';
import { auditLogsApi } from '@/lib/api/auditLogs';
import { usersApi } from '@/lib/api/users';
import { AuditLogFilterBar, type AuditLogFilters } from '@/components/admin/AuditLogFilterBar';
import { AuditLogTable } from '@/components/admin/AuditLogTable';
import { Pagination } from '@/components/admin/Pagination';
import { useToast } from '@/lib/context/ToastContext';
import { ApiClientError, ApiNetworkError } from '@/lib/fetcher';
import type { AuditLogEntry, StaffUser } from '@/types/api';
import styles from './page.module.css';

const PAGE_SIZE = 20;

export default function AuditLogsPage() {
  const { showToast } = useToast();
  const [filters, setFilters] = useState<AuditLogFilters>({});
  const [page, setPage] = useState(1);
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [actors, setActors] = useState<StaffUser[]>([]);

  useEffect(() => {
    usersApi.list().then(setActors).catch(() => setActors([]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    auditLogsApi
      .list({ ...filters, page })
      .then((result) => {
        if (cancelled) return;
        setEntries(result.items);
        setTotal(result.total);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page]);

  function handleFiltersChange(next: AuditLogFilters) {
    setFilters(next);
    setPage(1);
  }

  return (
    <div>
      <div className={styles.header}>
        <h1>Audit Logs</h1>
        <p className={styles.subtitle}>Track staff actions across the admin panel.</p>
      </div>

      <div className={styles.filterRow}>
        <AuditLogFilterBar filters={filters} onChange={handleFiltersChange} actors={actors} />
      </div>

      <AuditLogTable entries={entries} />
      <Pagination page={page} totalPages={Math.max(1, Math.ceil(total / PAGE_SIZE))} onChange={setPage} />
    </div>
  );
}
