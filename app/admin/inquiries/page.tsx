'use client';

import { useEffect, useState } from 'react';
import { inquiriesApi } from '@/lib/api/inquiries';
import { InquiryList } from '@/components/admin/InquiryList';
import { useToast } from '@/lib/context/ToastContext';
import { ApiClientError, ApiNetworkError } from '@/lib/fetcher';
import type { Inquiry } from '@/types/api';

export default function InquiriesListPage() {
  const { showToast } = useToast();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [statusFilter, setStatusFilter] = useState<'open' | 'replied' | ''>('');

  useEffect(() => {
    inquiriesApi
      .list(statusFilter || undefined)
      .then(setInquiries)
      .catch((err) => {
        if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
      });
  }, [statusFilter, showToast]);

  return (
    <div>
      <h1>Inquiries</h1>
      <InquiryList inquiries={inquiries} statusFilter={statusFilter} onStatusFilterChange={setStatusFilter} />
    </div>
  );
}
