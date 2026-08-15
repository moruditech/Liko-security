'use client';

import { useEffect, useState } from 'react';
import type { Testimonial } from '@/types/api';
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
        <h2>{testimonial ? 'Edit testimonial' : 'New testimonial'}</h2>

        <label htmlFor="tName">Name</label>
        <input id="tName" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

        <label htmlFor="tGrade">Grade</label>
        <input id="tGrade" required value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} />

        <label htmlFor="tQuote">Quote</label>
        <textarea
          id="tQuote"
          required
          rows={4}
          value={form.quote}
          onChange={(e) => setForm({ ...form, quote: e.target.value })}
        />

        <label>
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          />
          Featured
        </label>

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
