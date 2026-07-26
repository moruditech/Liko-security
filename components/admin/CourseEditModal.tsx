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

const EMPTY: Omit<Course, 'id'> = { grade: '', title: '', duration: '', fee: 0, active: true };

export function CourseEditModal({ course, open, onSave, onClose }: CourseEditModalProps) {
  const [form, setForm] = useState<Omit<Course, 'id'>>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(course ? { grade: course.grade, title: course.title, duration: course.duration, fee: course.fee, active: course.active } : EMPTY);
  }, [course, open]);

  if (!open) return null;

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
        <h2>{course ? 'Edit course' : 'New course'}</h2>

        <label htmlFor="grade">Grade</label>
        <input id="grade" required value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} />

        <label htmlFor="title">Title</label>
        <input id="title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />

        <label htmlFor="duration">Duration</label>
        <input
          id="duration"
          required
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
        />

        <label htmlFor="fee">Fee (ZAR)</label>
        <input
          id="fee"
          type="number"
          min={0}
          required
          value={form.fee}
          onChange={(e) => setForm({ ...form, fee: Number(e.target.value) })}
        />

        <label>
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          Active
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
