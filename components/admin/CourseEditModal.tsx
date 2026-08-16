'use client';

import { useEffect, useState } from 'react';
import type { Course } from '@/types/api';
import styles from './CourseEditModal.module.css';

interface CourseEditModalProps {
  course: Course | null; // null means "create new"
  open: boolean;
  onSave: (input: Omit<Course, 'id'>, id?: string) => Promise<void>;
  onClose: () => void;
}

const EMPTY: Omit<Course, 'id'> = { grade: '', title: '', duration: '', fee: 0, isActive: true };

// PSIRA's standard training grades, lowest to highest (see the same set in
// components/public/CoursePreviewGrid.tsx's GRADE_CONTENT map). The API
// models `grade` as a free string, so an existing course whose grade falls
// outside this set is still added as an option below rather than dropped.
const GRADE_OPTIONS = ['E', 'D', 'C', 'B', 'A'];

// FLAG: `duration` is a free string on the Course model with no canonical
// list anywhere in the backend or codebase. These are the common lengths
// offered for security training, matching the dropdown in the approved
// design reference. An existing course's current value is always kept as
// an option even if it isn't one of these, so editing never silently
// discards real data.
const DURATION_OPTIONS = ['1 Day', '3 Days', '1 Week', '2 Weeks', '1 Month', '3 Months', '6 Months'];

export function CourseEditModal({ course, open, onSave, onClose }: CourseEditModalProps) {
  const [form, setForm] = useState<Omit<Course, 'id'>>(EMPTY);
  // Fee is tracked as its own string so a new course's field starts genuinely
  // empty instead of pre-filled with "0" (which the person then has to
  // manually clear before typing a real amount). Kept in sync with
  // form.fee, which stays the real number the rest of the form/submit uses.
  const [feeInput, setFeeInput] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (course) {
      setForm({ grade: course.grade, title: course.title, duration: course.duration, fee: course.fee, isActive: course.isActive });
      setFeeInput(String(course.fee));
    } else {
      setForm(EMPTY);
      setFeeInput('');
    }
  }, [course, open]);

  if (!open) return null;

  const gradeOptions = form.grade && !GRADE_OPTIONS.includes(form.grade) ? [form.grade, ...GRADE_OPTIONS] : GRADE_OPTIONS;
  const durationOptions =
    form.duration && !DURATION_OPTIONS.includes(form.duration) ? [form.duration, ...DURATION_OPTIONS] : DURATION_OPTIONS;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form, course?.id);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" onClick={onClose}>
      <form className={styles.dialog} onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close">
          <CloseIcon />
        </button>

        <div className={styles.header}>
          <h2>{course ? 'Edit Course' : 'New Course'}</h2>
          <p className={styles.subtitle}>
            {course ? 'Update the course details below.' : 'Fill in the details for the new course.'}
          </p>
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="grade">
            Grade <span className={styles.required}>*</span>
          </label>
          <div className={styles.selectWrap}>
            <select id="grade" required value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })}>
              <option value="" disabled>
                Choose a grade
              </option>
              {gradeOptions.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
            <ChevronIcon className={styles.selectChevron} />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="title">
            Title <span className={styles.required}>*</span>
          </label>
          <input id="title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>

        <div className={styles.row}>
          <div className={styles.fieldGroup}>
            <label htmlFor="duration">
              Duration <span className={styles.required}>*</span>
            </label>
            <div className={styles.selectWrap}>
              <select
                id="duration"
                required
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
              >
                <option value="" disabled>
                  Choose duration
                </option>
                {durationOptions.map((duration) => (
                  <option key={duration} value={duration}>
                    {duration}
                  </option>
                ))}
              </select>
              <ChevronIcon className={styles.selectChevron} />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="fee">
              Fee (ZAR) <span className={styles.required}>*</span>
            </label>
            <input
              id="fee"
              type="number"
              min={0}
              required
              value={feeInput}
              onChange={(e) => {
                setFeeInput(e.target.value);
                setForm({ ...form, fee: e.target.value === '' ? 0 : Number(e.target.value) });
              }}
            />
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.activeSection}>
          <span className={styles.activeLabel}>Active</span>
          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            Course is active and visible
          </label>
        </div>

        <div className={styles.actions}>
          <button type="button" onClick={onClose} className={styles.cancel}>
            Cancel
          </button>
          <button type="submit" className={styles.save} disabled={saving}>
            {saving ? 'Saving...' : course ? 'Save changes' : 'Create course'}
          </button>
        </div>
      </form>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
