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

  return (
    <div className={styles.bar}>
      <select value={filters.actor ?? ''} onChange={(e) => set('actor', e.target.value)}>
        <option value="">All staff</option>
        {actors.map((actor) => (
          <option key={actor.id} value={actor.id}>
            {actor.name}
          </option>
        ))}
      </select>

      <input
        placeholder="Action (e.g. status_change)"
        value={filters.action ?? ''}
        onChange={(e) => set('action', e.target.value)}
      />

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
