'use client';

import { useEffect, useState } from 'react';
import type { Announcement } from '@/types/api';
import modalStyles from '../ui/modal.module.css';
import styles from './AnnouncementEditForm.module.css';

interface AnnouncementEditFormProps {
  announcement: Announcement | null;
  open: boolean;
  onSave: (input: Omit<Announcement, 'id'>, id?: string) => Promise<void>;
  onClose: () => void;
}

const EMPTY: Omit<Announcement, 'id'> = { title: '', body: '', publishAt: '', expiresAt: undefined };

export function AnnouncementEditForm({ announcement, open, onSave, onClose }: AnnouncementEditFormProps) {
  const [form, setForm] = useState<Omit<Announcement, 'id'>>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(
      announcement
        ? {
            title: announcement.title,
            body: announcement.body,
            publishAt: announcement.publishAt.slice(0, 16),
            expiresAt: announcement.expiresAt?.slice(0, 16),
          }
        : EMPTY
    );
  }, [announcement, open]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form, announcement?.id);
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

        <h2>{announcement ? 'Edit announcement' : 'New announcement'}</h2>

        <div className={modalStyles.fieldGroup}>
          <label htmlFor="annTitle">Title</label>
          <input id="annTitle" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>

        <div className={modalStyles.fieldGroup}>
          <label htmlFor="annBody">Body</label>
          <textarea id="annBody" required rows={4} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
        </div>

        <div className={modalStyles.fieldGroup}>
          <label htmlFor="annPublishAt">Publish at</label>
          <input
            id="annPublishAt"
            type="datetime-local"
            required
            value={form.publishAt}
            onChange={(e) => setForm({ ...form, publishAt: e.target.value })}
          />
        </div>

        <div className={modalStyles.fieldGroup}>
          <label htmlFor="annExpiresAt">Expires at (optional)</label>
          <input
            id="annExpiresAt"
            type="datetime-local"
            value={form.expiresAt ?? ''}
            onChange={(e) => setForm({ ...form, expiresAt: e.target.value || undefined })}
          />
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
