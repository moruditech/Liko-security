'use client';

import { useEffect, useState } from 'react';
import { inquiriesApi } from '@/lib/api/inquiries';
import { InquiryList } from '@/components/admin/InquiryList';
import { Pagination } from '@/components/admin/Pagination';
import { useToast } from '@/lib/context/ToastContext';
import { ApiClientError, ApiNetworkError } from '@/lib/fetcher';
import type { Inquiry } from '@/types/api';

const PAGE_SIZE = 20;

export default function InquiriesListPage() {
  const { showToast } = useToast();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<'open' | 'replied' | ''>('');
  const [page, setPage] = useState(1);

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

  function handleStatusFilterChange(next: 'open' | 'replied' | '') {
    setStatusFilter(next);
    setPage(1);
  }

  return (
    <div>
      <h1>Inquiries</h1>
      <InquiryList inquiries={inquiries} statusFilter={statusFilter} onStatusFilterChange={handleStatusFilterChange} />
      <Pagination page={page} totalPages={Math.max(1, Math.ceil(total / PAGE_SIZE))} onChange={setPage} />
    </div>
  );
}
