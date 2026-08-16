'use client';

import type { StaffUser } from '@/types/api';
import styles from './ApplicationFilterBar.module.css';

export interface AuditLogFilters {
  actor?: string;
  action?: string;
  from?: string;
  to?: string;
}

interface AuditLogFilterBarProps {
  filters: AuditLogFilters;
  onChange: (filters: AuditLogFilters) => void;
  actors: StaffUser[];
}

export function AuditLogFilterBar({ filters, onChange, actors }: AuditLogFilterBarProps) {
  function set<K extends keyof AuditLogFilters>(key: K, value: AuditLogFilters[K]) {
    onChange({ ...filters, [key]: value || undefined });
  }

  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <div className={styles.bar}>
      <div className={styles.field}>
        <label htmlFor="auditActorFilter">Staff member</label>
        <div className={styles.selectWrap}>
          <select id="auditActorFilter" value={filters.actor ?? ''} onChange={(e) => set('actor', e.target.value)}>
            <option value="">All staff</option>
            {actors.map((actor) => (
              <option key={actor.id} value={actor.id}>
                {actor.name}
              </option>
            ))}
          </select>
          <ChevronIcon />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="auditActionFilter">Action</label>
        <input
          id="auditActionFilter"
          placeholder="e.g. status_change"
          value={filters.action ?? ''}
          onChange={(e) => set('action', e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="auditFromFilter">From</label>
        <input id="auditFromFilter" type="date" value={filters.from ?? ''} onChange={(e) => set('from', e.target.value)} />
      </div>

      <div className={styles.field}>
        <label htmlFor="auditToFilter">To</label>
        <input id="auditToFilter" type="date" value={filters.to ?? ''} onChange={(e) => set('to', e.target.value)} />
      </div>

      <button type="button" className={styles.clear} onClick={() => onChange({})} disabled={!hasActiveFilters}>
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
