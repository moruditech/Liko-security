'use client';

import type { ApplicationStatus, Course, Intake } from '@/types/api';
import styles from './ApplicationFilterBar.module.css';

export interface ApplicationFilters {
  status?: ApplicationStatus;
  courseId?: string;
  intakeId?: string;
  from?: string;
  to?: string;
}

interface ApplicationFilterBarProps {
  filters: ApplicationFilters;
  onChange: (filters: ApplicationFilters) => void;
  courses: Course[];
  intakes: Intake[];
}

const STATUS_OPTIONS: ApplicationStatus[] = ['new', 'under_review', 'payment_verified', 'enrolled', 'rejected'];

export function ApplicationFilterBar({ filters, onChange, courses, intakes }: ApplicationFilterBarProps) {
  function set<K extends keyof ApplicationFilters>(key: K, value: ApplicationFilters[K]) {
    onChange({ ...filters, [key]: value || undefined });
  }

  return (
    <div className={styles.bar}>
      <select value={filters.status ?? ''} onChange={(e) => set('status', e.target.value as ApplicationStatus)}>
        <option value="">All statuses</option>
        {STATUS_OPTIONS.map((status) => (
          <option key={status} value={status}>
            {status.replace('_', ' ')}
          </option>
        ))}
      </select>

      <select value={filters.courseId ?? ''} onChange={(e) => set('courseId', e.target.value)}>
        <option value="">All courses</option>
        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            Grade {course.grade}
          </option>
        ))}
      </select>

      <select value={filters.intakeId ?? ''} onChange={(e) => set('intakeId', e.target.value)}>
        <option value="">All intakes</option>
        {intakes.map((intake) => (
          <option key={intake.id} value={intake.id}>
            {new Date(intake.startDate).toLocaleDateString('en-ZA')}
          </option>
        ))}
      </select>

      <label>
        From
        <input type="date" value={filters.from ?? ''} onChange={(e) => set('from', e.target.value)} />
      </label>
      <label>
        To
        <input type="date" value={filters.to ?? ''} onChange={(e) => set('to', e.target.value)} />
      </label>
    </div>
  );
}
