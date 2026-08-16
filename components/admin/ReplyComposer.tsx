'use client';

import { useState } from 'react';
import styles from './ReplyComposer.module.css';

export function ReplyComposer({ onSubmit }: { onSubmit: (body: string) => Promise<void> }) {
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      await onSubmit(body);
      setBody('');
    } finally {
      setSending(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="replyBody">Reply</label>
        <textarea id="replyBody" required rows={4} value={body} onChange={(e) => setBody(e.target.value)} />
      </div>
      <button type="submit" disabled={sending} className={styles.submit}>
        <SendIcon />
        {sending ? 'Sending...' : 'Send reply'}
      </button>
    </form>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}
