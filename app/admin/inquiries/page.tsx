'use client';

import { useEffect, useState } from 'react';
import { inquiriesApi } from '@/lib/api/inquiries';
import { InquiriesStatsRow } from '@/components/admin/InquiriesStatsRow';
import { InquiryList } from '@/components/admin/InquiryList';
import { Pagination } from '@/components/admin/Pagination';
import { useToast } from '@/lib/context/ToastContext';
import { ApiClientError, ApiNetworkError } from '@/lib/fetcher';
import type { Inquiry } from '@/types/api';
import styles from './page.module.css';

const PAGE_SIZE = 20;

export default function InquiriesListPage() {
  const { showToast } = useToast();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<'open' | 'replied' | ''>('');
  const [page, setPage] = useState(1);

  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [openCount, setOpenCount] = useState<number | null>(null);
  const [repliedCount, setRepliedCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    inquiriesApi
      .list({ ...(statusFilter ? { status: statusFilter } : {}), page })
      .then((result) => {
        if (cancelled) return;
        setInquiries(result.items);
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
  }, [statusFilter, page]);

  // Stats row counts: same limit:1/read-back-total technique as
  // ApplicationsStatsRow, since there's no dedicated stats endpoint.
  useEffect(() => {
    inquiriesApi.list({ page: 1, limit: 1 }).then((r) => setTotalCount(r.total)).catch(() => setTotalCount(null));
    inquiriesApi.list({ status: 'open', page: 1, limit: 1 }).then((r) => setOpenCount(r.total)).catch(() => setOpenCount(null));
    inquiriesApi
      .list({ status: 'replied', page: 1, limit: 1 })
      .then((r) => setRepliedCount(r.total))
      .catch(() => setRepliedCount(null));
  }, []);

  function handleStatusFilterChange(next: 'open' | 'replied' | '') {
    setStatusFilter(next);
    setPage(1);
  }

  return (
    <div>
      <div className={styles.header}>
        <h1>Inquiries</h1>
        <p className={styles.subtitle}>Respond to messages submitted through the public contact form.</p>
      </div>

      <InquiriesStatsRow total={totalCount} open={openCount} replied={repliedCount} />

      <div className={styles.listRow}>
        <InquiryList inquiries={inquiries} statusFilter={statusFilter} onStatusFilterChange={handleStatusFilterChange} />
      </div>

      <Pagination page={page} totalPages={Math.max(1, Math.ceil(total / PAGE_SIZE))} onChange={setPage} />
    </div>
  );
}
