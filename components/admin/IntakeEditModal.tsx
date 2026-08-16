'use client';

import { useEffect, useState } from 'react';
import type { Intake } from '@/types/api';
import styles from './IntakeEditModal.module.css';

interface IntakeEditModalProps {
  intake: Intake | null;
  open: boolean;
  onSave: (input: Omit<Intake, 'id'>, id?: string) => Promise<void>;
  onClose: () => void;
}

// Same PSIRA grade set used by CourseEditModal — intakes reference grades
// directly (applicableGrades: string[] on intake.model.js), there is no
// course reference on an intake at all.
const GRADE_OPTIONS = ['E', 'D', 'C', 'B', 'A'];

const EMPTY: Omit<Intake, 'id'> = { title: '', applicableGrades: [], startDate: '', capacity: null, isActive: true };

export function IntakeEditModal({ intake, open, onSave, onClose }: IntakeEditModalProps) {
  const [form, setForm] = useState<Omit<Intake, 'id'>>(EMPTY);
  const [capacityInput, setCapacityInput] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (intake) {
      setForm({
        title: intake.title,
        applicableGrades: intake.applicableGrades,
        startDate: intake.startDate.slice(0, 10),
        capacity: intake.capacity,
        isActive: intake.isActive,
      });
      setCapacityInput(intake.capacity === null ? '' : String(intake.capacity));
    } else {
      setForm(EMPTY);
      setCapacityInput('');
    }
  }, [intake, open]);

  if (!open) return null;

  function toggleGrade(grade: string) {
    setForm((f) => ({
      ...f,
      applicableGrades: f.applicableGrades.includes(grade)
        ? f.applicableGrades.filter((g) => g !== grade)
        : [...f.applicableGrades, grade],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      // createIntake's Joi schema (course.validation.js) has no `capacity`
      // key at all, so it's silently stripped on create — only settable via
      // a follow-up edit. Sent here regardless since it's harmless on create
      // and correct on edit.
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

        <label htmlFor="intakeTitle">Title</label>
        <input
          id="intakeTitle"
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <fieldset className={styles.gradeFieldset}>
          <legend>Applicable grades</legend>
          {GRADE_OPTIONS.map((grade) => (
            <label key={grade} className={styles.gradeOption}>
              <input
                type="checkbox"
                checked={form.applicableGrades.includes(grade)}
                onChange={() => toggleGrade(grade)}
              />
              Grade {grade}
            </label>
          ))}
        </fieldset>

        <label htmlFor="startDate">Start date</label>
        <input
          id="startDate"
          type="date"
          required
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
        />

        <label htmlFor="capacity">Capacity (optional)</label>
        <input
          id="capacity"
          type="number"
          min={1}
          value={capacityInput}
          onChange={(e) => {
            setCapacityInput(e.target.value);
            setForm({ ...form, capacity: e.target.value === '' ? null : Number(e.target.value) });
          }}
        />

        <label>
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          />
          Active
        </label>

        <div className={styles.actions}>
          <button type="button" onClick={onClose} className={styles.cancel}>
            Cancel
          </button>
          <button type="submit" disabled={saving || form.applicableGrades.length === 0}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
