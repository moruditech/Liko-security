'use client';

import { useState } from 'react';
import styles from './CourseFilterBar.module.css';

export type StatusFilter = 'all' | 'active' | 'inactive';

interface CourseFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
  grade: string;
  onGradeChange: (value: string) => void;
  gradeOptions: string[];
  onClear: () => void;
  hasActiveFilters: boolean;
}

export function CourseFilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  grade,
  onGradeChange,
  gradeOptions,
  onClear,
  hasActiveFilters,
}: CourseFilterBarProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.bar}>
      <div className={styles.searchWrap}>
        <SearchIcon />
        <input
          type="search"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search courses"
        />
      </div>

      <button type="button" className={styles.toggle} onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <FunnelIcon />
        Filters
      </button>

      <div className={`${styles.extra} ${open ? styles.open : ''}`}>
        <div className={styles.field}>
          <label htmlFor="statusFilter">Status</label>
          <div className={styles.selectWrap}>
            <select
              id="statusFilter"
              value={status}
              onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <ChevronIcon />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="gradeFilter">Grade</label>
          <div className={styles.selectWrap}>
            <select id="gradeFilter" value={grade} onChange={(e) => onGradeChange(e.target.value)}>
              <option value="all">All</option>
              {gradeOptions.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            <ChevronIcon />
          </div>
        </div>

        <button type="button" className={styles.clear} onClick={onClear} disabled={!hasActiveFilters}>
          Clear
        </button>
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

function FunnelIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 5h16l-6 8v5l-4 2v-7L4 5z" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
