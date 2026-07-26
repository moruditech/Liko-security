'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { inquiriesApi } from '@/lib/api/inquiries';
import { InquiryDetailPanel } from '@/components/admin/InquiryDetailPanel';
import { useToast } from '@/lib/context/ToastContext';
import { ApiClientError, ApiNetworkError } from '@/lib/fetcher';
import type { Inquiry } from '@/types/api';

export default function InquiryDetailPage() {
  const params = useParams<{ id: string }>();
  const { showToast } = useToast();
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);

  function load() {
    inquiriesApi
      .get(params.id)
      .then(setInquiry)
      .catch((err) => {
        if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
      });
  }

  useEffect(load, [params.id]);

  async function handleReply(body: string) {
    try {
      // Status auto-flips to 'replied' server-side on reply, per TAD §12.8,
      // so re-fetching afterward is what picks up the new status, this
      // component doesn't set it locally.
      const updated = await inquiriesApi.reply(params.id, body);
      setInquiry(updated);
      showToast('Reply sent.', 'success');
    } catch (err) {
      if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
    }
  }

  if (!inquiry) return <p>Loading...</p>;

  return <InquiryDetailPanel inquiry={inquiry} onReply={handleReply} />;
}
