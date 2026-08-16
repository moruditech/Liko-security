'use client';

import { useEffect, useState } from 'react';
import type { GalleryCategory, GalleryItem } from '@/types/api';
import modalStyles from '../ui/modal.module.css';
import styles from './GalleryEditModal.module.css';

const CATEGORIES: GalleryCategory[] = ['Practical Drills', 'Graduations', 'Campus Life'];

interface GalleryEditModalProps {
  item: GalleryItem | null;
  open: boolean;
  onSave: (id: string, form: FormData) => Promise<void>;
  onClose: () => void;
}

export function GalleryEditModal({ item, open, onSave, onClose }: GalleryEditModalProps) {
  const [category, setCategory] = useState<GalleryCategory>('Practical Drills');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [title, setTitle] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [replacementFile, setReplacementFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (item) {
      setCategory(item.category);
      setMediaType(item.mediaType);
      setTitle(item.title);
      setIsActive(item.isActive);
      setReplacementFile(null);
    }
  }, [item, open]);

  if (!open || !item) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const form = new FormData();
      form.append('category', category); // required on every PUT — full-replace semantics
      form.append('mediaType', mediaType); // required on every PUT — full-replace semantics
      form.append('title', title);
      form.append('isActive', String(isActive));
      if (replacementFile) form.append('media', replacementFile);
      await onSave(item!._id, form);
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
          <select id="galleryCategory" required value={category} onChange={(e) => setCategory(e.target.value as GalleryCategory)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className={modalStyles.fieldGroup}>
          <label htmlFor="galleryMediaType">Type</label>
          <select id="galleryMediaType" required value={mediaType} onChange={(e) => setMediaType(e.target.value as 'image' | 'video')}>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>

        <div className={modalStyles.fieldGroup}>
          <label htmlFor="galleryTitle">Title</label>
          <input id="galleryTitle" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <label className={styles.checkboxRow}>
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          Active on the public site
        </label>

        <div className={modalStyles.fieldGroup}>
          <label htmlFor="galleryMedia">Replace file (optional)</label>
          <input
            id="galleryMedia"
            type="file"
            accept={mediaType === 'video' ? 'video/mp4,video/quicktime,video/webm' : 'image/jpeg,image/png'}
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
