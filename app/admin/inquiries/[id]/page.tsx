'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { inquiriesApi } from '@/lib/api/inquiries';
import { InquiryDetailPanel } from '@/components/admin/InquiryDetailPanel';
import { useToast } from '@/lib/context/ToastContext';
import { ApiClientError, ApiNetworkError } from '@/lib/fetcher';
import type { Inquiry } from '@/types/api';
import styles from './page.module.css';

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

  return (
    <div className={styles.page}>
      <Link href="/admin/inquiries" className={styles.backLink}>
        <BackIcon />
        Back to Inquiries
      </Link>

      {inquiry ? <InquiryDetailPanel inquiry={inquiry} onReply={handleReply} /> : <p className={styles.loading}>Loading...</p>}
    </div>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
