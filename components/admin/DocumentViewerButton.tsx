'use client';

import { useState } from 'react';
import { applicationsApi } from '@/lib/api/applications';
import { ApiClientError, ApiNetworkError } from '@/lib/fetcher';
import { useToast } from '@/lib/context/ToastContext';
import styles from './DocumentViewerButton.module.css';

export function DocumentViewerButton({ applicationId }: { applicationId: string }) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      // Fetched fresh on every click, never cached or reused from a prior
      // load, since the signed URL expires (TAD §12.3).
      const { url } = await applicationsApi.getDocumentUrl(applicationId);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      if (err instanceof ApiClientError || err instanceof ApiNetworkError) {
        showToast(err.message, 'error');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button type="button" className={styles.button} onClick={handleClick} disabled={loading}>
      {loading ? 'Loading...' : 'View ID document'}
    </button>
  );
}
