'use client';

import { useEffect, useState } from 'react';
import type { GalleryItem } from '@/types/api';
import styles from './CourseEditModal.module.css';

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
        <h2>Edit gallery item</h2>

        <label htmlFor="galleryCategory">Category</label>
        <input id="galleryCategory" required value={category} onChange={(e) => setCategory(e.target.value)} />

        <label htmlFor="galleryCaption">Caption</label>
        <input id="galleryCaption" value={caption} onChange={(e) => setCaption(e.target.value)} />

        <label>
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
          Active
        </label>

        <label htmlFor="galleryMedia">Replace image (optional)</label>
        <input
          id="galleryMedia"
          type="file"
          accept="image/jpeg,image/png"
          onChange={(e) => setReplacementFile(e.target.files?.[0] ?? null)}
        />

        <div className={styles.actions}>
          <button type="button" onClick={onClose} className={styles.cancel}>
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
