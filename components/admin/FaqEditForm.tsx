'use client';

import { useEffect, useState } from 'react';
import type { Faq } from '@/types/api';
import modalStyles from '../ui/modal.module.css';
import styles from './FaqEditForm.module.css';

interface FaqEditFormProps {
  faq: Faq | null;
  open: boolean;
  onSave: (input: { question: string; answer: string }, id?: string) => Promise<void>;
  onClose: () => void;
}

export function FaqEditForm({ faq, open, onSave, onClose }: FaqEditFormProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setQuestion(faq?.question ?? '');
    setAnswer(faq?.answer ?? '');
  }, [faq, open]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ question, answer }, faq?.id);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" onClick={onClose}>
      <form className={styles.dialog} onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <button type="button" className={modalStyles.closeButton} onClick={onClose} aria-label="Close">
          <CloseIcon />
        </button>

        <h2>{faq ? 'Edit FAQ' : 'New FAQ'}</h2>

        <div className={modalStyles.fieldGroup}>
          <label htmlFor="faqQuestion">Question</label>
          <input id="faqQuestion" required value={question} onChange={(e) => setQuestion(e.target.value)} />
        </div>

        <div className={modalStyles.fieldGroup}>
          <label htmlFor="faqAnswer">Answer</label>
          <textarea id="faqAnswer" required rows={4} value={answer} onChange={(e) => setAnswer(e.target.value)} />
        </div>

        <div className={modalStyles.actions}>
          <button type="button" onClick={onClose} className={modalStyles.cancel}>
            Cancel
          </button>
          <button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
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
