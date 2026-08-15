'use client';

import { useEffect, useState } from 'react';
import type { GalleryItem } from '@/types/api';
import modalStyles from '../ui/modal.module.css';
import styles from './GalleryEditModal.module.css';

interface GalleryEditModalProps {
  item: GalleryItem | null;
  open: boolean;
  onSave: (id: string, form: FormData) => Promise<void>;
  onClose: () => void;
}

export function GalleryEditModal({ item, open, onSave, onClose }: GalleryEditModalProps) {
  const [category, setCategory] = useState('');
  const [caption, setCaption] = useState('');
  const [active, setActive] = useState(true);
  const [replacementFile, setReplacementFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (item) {
      setCategory(item.category);
      setCaption(item.caption ?? '');
      setActive(item.active);
      setReplacementFile(null);
    }
  }, [item, open]);

  if (!open || !item) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const form = new FormData();
      form.append('category', category);
      form.append('caption', caption);
      form.append('active', String(active));
      if (replacementFile) form.append('media', replacementFile);
      await onSave(item!.id, form);
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

        <h2>Edit gallery item</h2>

        <div className={modalStyles.fieldGroup}>
          <label htmlFor="galleryCategory">Category</label>
          <input id="galleryCategory" required value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>

        <div className={modalStyles.fieldGroup}>
          <label htmlFor="galleryCaption">Caption</label>
          <input id="galleryCaption" value={caption} onChange={(e) => setCaption(e.target.value)} />
        </div>

        <label className={styles.checkboxRow}>
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
          Active on the public site
        </label>

        <div className={modalStyles.fieldGroup}>
          <label htmlFor="galleryMedia">Replace image (optional)</label>
          <input
            id="galleryMedia"
            type="file"
            accept="image/jpeg,image/png"
            onChange={(e) => setReplacementFile(e.target.files?.[0] ?? null)}
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
