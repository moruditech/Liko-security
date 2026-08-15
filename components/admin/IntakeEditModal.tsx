'use client';

import { useEffect, useState } from 'react';
import type { Course, Intake } from '@/types/api';
import styles from './IntakeEditModal.module.css';

interface IntakeEditModalProps {
  intake: Intake | null;
  courses: Course[];
  open: boolean;
  onSave: (input: Omit<Intake, 'id'>, id?: string) => Promise<void>;
  onClose: () => void;
}

const EMPTY: Omit<Intake, 'id'> = { courseId: '', startDate: '', capacity: 20, active: true };

export function IntakeEditModal({ intake, courses, open, onSave, onClose }: IntakeEditModalProps) {
  const [form, setForm] = useState<Omit<Intake, 'id'>>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(
      intake
        ? { courseId: intake.courseId, startDate: intake.startDate.slice(0, 10), capacity: intake.capacity, active: intake.active }
        : EMPTY
    );
  }, [intake, open]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form, intake?.id);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" onClick={onClose}>
      <form className={styles.dialog} onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h2>{intake ? 'Edit intake' : 'New intake'}</h2>

        <label htmlFor="courseId">Course</label>
        <select
          id="courseId"
          required
          value={form.courseId}
          onChange={(e) => setForm({ ...form, courseId: e.target.value })}
        >
          <option value="" disabled>
            Choose a course
          </option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              Grade {course.grade}: {course.title}
            </option>
          ))}
        </select>

        <label htmlFor="startDate">Start date</label>
        <input
          id="startDate"
          type="date"
          required
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
        />

        <label htmlFor="capacity">Capacity</label>
        <input
          id="capacity"
          type="number"
          min={1}
          required
          value={form.capacity}
          onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
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
