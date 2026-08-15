'use client';

import { useEffect, useState } from 'react';
import type { Testimonial } from '@/types/api';
import modalStyles from '../ui/modal.module.css';
import styles from './TestimonialEditForm.module.css';

interface TestimonialEditFormProps {
  testimonial: Testimonial | null;
  open: boolean;
  onSave: (input: Omit<Testimonial, 'id'>, id?: string) => Promise<void>;
  onClose: () => void;
}

const EMPTY: Omit<Testimonial, 'id'> = { name: '', grade: '', quote: '', photoUrl: '', featured: false };

export function TestimonialEditForm({ testimonial, open, onSave, onClose }: TestimonialEditFormProps) {
  const [form, setForm] = useState<Omit<Testimonial, 'id'>>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(
      testimonial
        ? {
            name: testimonial.name,
            grade: testimonial.grade,
            quote: testimonial.quote,
            photoUrl: testimonial.photoUrl ?? '',
            featured: testimonial.featured,
          }
        : EMPTY
    );
  }, [testimonial, open]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form, testimonial?.id);
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

        <h2>{testimonial ? 'Edit testimonial' : 'New testimonial'}</h2>

        <div className={modalStyles.fieldGroup}>
          <label htmlFor="tName">Name</label>
          <input id="tName" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>

        <div className={modalStyles.fieldGroup}>
          <label htmlFor="tGrade">Grade</label>
          <input id="tGrade" required value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} />
        </div>

        <div className={modalStyles.fieldGroup}>
          <label htmlFor="tQuote">Quote</label>
          <textarea
            id="tQuote"
            required
            rows={4}
            value={form.quote}
            onChange={(e) => setForm({ ...form, quote: e.target.value })}
          />
        </div>

        <div className={modalStyles.fieldGroup}>
          <label htmlFor="tPhotoUrl">Photo URL (optional)</label>
          <input
            id="tPhotoUrl"
            type="url"
            placeholder="https://..."
            value={form.photoUrl}
            onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
          />
        </div>

        <label className={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          />
          Featured
        </label>

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
