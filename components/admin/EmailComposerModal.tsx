'use client';

import { useState } from 'react';
import { applicationsApi } from '@/lib/api/applications';
import { ApiClientError, ApiNetworkError } from '@/lib/fetcher';
import { useToast } from '@/lib/context/ToastContext';
import styles from './EmailComposerModal.module.css';

interface EmailComposerModalProps {
  applicationId: string;
  open: boolean;
  onClose: () => void;
}

export function EmailComposerModal({ applicationId, open, onClose }: EmailComposerModalProps) {
  const { showToast } = useToast();
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  if (!open) return null;

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      await applicationsApi.sendEmail(applicationId, subject, body);
      showToast('Email sent.', 'success');
      setSubject('');
      setBody('');
      onClose();
    } catch (err) {
      if (err instanceof ApiClientError || err instanceof ApiNetworkError) {
        showToast(err.message, 'error');
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" onClick={onClose}>
      <form className={styles.dialog} onClick={(e) => e.stopPropagation()} onSubmit={handleSend}>
        <h2>Send email to applicant</h2>

        <label htmlFor="emailSubject">Subject</label>
        <input id="emailSubject" required value={subject} onChange={(e) => setSubject(e.target.value)} />

        <label htmlFor="emailBody">Message</label>
        <textarea id="emailBody" required rows={6} value={body} onChange={(e) => setBody(e.target.value)} />

        <div className={styles.actions}>
          <button type="button" onClick={onClose} className={styles.cancel}>
            Cancel
          </button>
          <button type="submit" disabled={sending}>
            {sending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}
