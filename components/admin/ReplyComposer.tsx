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
      <label htmlFor="replyBody">Reply</label>
      <textarea id="replyBody" required rows={4} value={body} onChange={(e) => setBody(e.target.value)} />
      <button type="submit" disabled={sending}>
        {sending ? 'Sending...' : 'Send reply'}
      </button>
    </form>
  );
}
