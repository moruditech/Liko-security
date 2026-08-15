'use client';

import { useState } from 'react';
import { applicationsApi } from '@/lib/api/applications';
import { ApiClientError, ApiNetworkError } from '@/lib/fetcher';
import { useToast } from '@/lib/context/ToastContext';
import modalStyles from '../ui/modal.module.css';
import styles from './EmailComposerModal.module.css';

interface EmailComposerModalProps {
  applicationId: string;
  recipientName: string;
  open: boolean;
  onClose: () => void;
}

export function EmailComposerModal({ applicationId, recipientName, open, onClose }: EmailComposerModalProps) {
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
        <button type="button" className={modalStyles.closeButton} onClick={onClose} aria-label="Close">
          <CloseIcon />
        </button>

        <div className={styles.titleBlock}>
          <h2>Send email</h2>
          <p className={styles.subtitle}>Send an email to {recipientName}</p>
        </div>

        <div className={modalStyles.fieldGroup}>
          <label htmlFor="emailSubject">Subject</label>
          <input
            id="emailSubject"
            required
            placeholder="Enter email subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div className={modalStyles.fieldGroup}>
          <label htmlFor="emailBody">Message</label>
          <textarea
            id="emailBody"
            required
            rows={6}
            placeholder="Type your message here..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>

        <div className={modalStyles.actions}>
          <button type="button" onClick={onClose} className={modalStyles.cancel}>
            Cancel
          </button>
          <button type="submit" disabled={sending}>
            <SendIcon />
            {sending ? 'Sending...' : 'Send email'}
          </button>
        </div>
      </form>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}
