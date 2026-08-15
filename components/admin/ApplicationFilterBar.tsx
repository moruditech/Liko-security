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

  const hasActiveFilters = Object.values(filters).some(Boolean);

  function clear() {
    onChange({});
  }

  return (
    <div className={styles.bar}>
      <div className={styles.field}>
        <label htmlFor="statusFilter">Status</label>
        <div className={styles.selectWrap}>
          <select
            id="statusFilter"
            value={filters.status ?? ''}
            onChange={(e) => set('status', e.target.value as ApplicationStatus)}
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status.replace('_', ' ')}
              </option>
            ))}
          </select>
          <ChevronIcon />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="courseFilter">Course</label>
        <div className={styles.selectWrap}>
          <select id="courseFilter" value={filters.courseId ?? ''} onChange={(e) => set('courseId', e.target.value)}>
            <option value="">All courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                Grade {course.grade}
              </option>
            ))}
          </select>
          <ChevronIcon />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="intakeFilter">Intake</label>
        <div className={styles.selectWrap}>
          <select id="intakeFilter" value={filters.intakeId ?? ''} onChange={(e) => set('intakeId', e.target.value)}>
            <option value="">All intakes</option>
            {intakes.map((intake) => (
              <option key={intake.id} value={intake.id}>
                {new Date(intake.startDate).toLocaleDateString('en-ZA')}
              </option>
            ))}
          </select>
          <ChevronIcon />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="fromFilter">From</label>
        <input id="fromFilter" type="date" value={filters.from ?? ''} onChange={(e) => set('from', e.target.value)} />
      </div>

      <div className={styles.field}>
        <label htmlFor="toFilter">To</label>
        <input id="toFilter" type="date" value={filters.to ?? ''} onChange={(e) => set('to', e.target.value)} />
      </div>

      <button type="button" className={styles.clear} onClick={clear} disabled={!hasActiveFilters}>
        Clear
      </button>
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
