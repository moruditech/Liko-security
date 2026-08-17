'use client';

import { useEffect, useState } from 'react';
import type { Testimonial } from '@/types/api';
import modalStyles from '../ui/modal.module.css';
import styles from './TestimonialEditForm.module.css';

interface TestimonialEditFormProps {
  testimonial: Testimonial | null;
  open: boolean;
  onSave: (form: FormData, id?: string) => Promise<void>;
  onClose: () => void;
}

// COURSE_GRADE (shared/constants/enums.js) — only these four, no 'A'.
const GRADE_OPTIONS = ['E', 'D', 'C', 'B'] as const;

export function TestimonialEditForm({ testimonial, open, onSave, onClose }: TestimonialEditFormProps) {
  const [studentName, setStudentName] = useState('');
  const [courseGrade, setCourseGrade] = useState<(typeof GRADE_OPTIONS)[number]>('E');
  const [quote, setQuote] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setStudentName(testimonial?.studentName ?? '');
    setCourseGrade((testimonial?.courseGrade as (typeof GRADE_OPTIONS)[number]) ?? 'E');
    setQuote(testimonial?.quote ?? '');
    setIsFeatured(testimonial?.isFeatured ?? false);
    setPhotoFile(null);
  }, [testimonial, open]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const form = new FormData();
      form.append('studentName', studentName);
      form.append('courseGrade', courseGrade);
      form.append('quote', quote);
      form.append('isFeatured', String(isFeatured));
      if (photoFile) form.append('photo', photoFile); // multer field name, testimonial.routes.js
      await onSave(form, testimonial?._id);
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
          <label htmlFor="tStudentName">Name</label>
          <input id="tStudentName" required value={studentName} onChange={(e) => setStudentName(e.target.value)} />
        </div>

        <div className={modalStyles.fieldGroup}>
          <label htmlFor="tCourseGrade">Grade</label>
          <select
            id="tCourseGrade"
            required
            value={courseGrade}
            onChange={(e) => setCourseGrade(e.target.value as (typeof GRADE_OPTIONS)[number])}
          >
            {GRADE_OPTIONS.map((g) => (
              <option key={g} value={g}>
                Grade {g}
              </option>
            ))}
          </select>
        </div>

        <div className={modalStyles.fieldGroup}>
          <label htmlFor="tQuote">Quote</label>
          <textarea id="tQuote" required rows={4} value={quote} onChange={(e) => setQuote(e.target.value)} />
        </div>

        <div className={modalStyles.fieldGroup}>
          <label htmlFor="tPhoto">Photo (optional)</label>
          <input id="tPhoto" type="file" accept="image/jpeg,image/png" onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)} />
          {testimonial?.photoUrl && !photoFile && <p className={modalStyles.hint}>Leave blank to keep the current photo.</p>}
        </div>

        <label className={styles.checkboxRow}>
          <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
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
