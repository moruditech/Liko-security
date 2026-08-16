import type { AuditLogEntry } from '@/types/api';
import styles from './ApplicationsTable.module.css';

export function AuditLogTable({ entries }: { entries: AuditLogEntry[] }) {
  if (entries.length === 0) {
    return <p>No audit log entries match these filters.</p>;
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Actor</th>
          <th>Action</th>
          <th>Target</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry, i) => (
          <tr key={entry.id} className={i % 2 === 1 ? styles.altRow : undefined}>
            <td>{entry.actor ? entry.actor.name : 'System'}</td>
            <td>{entry.action}</td>
            <td>{entry.targetType ? `${entry.targetType} (${entry.targetId})` : '-'}</td>
            <td>{new Date(entry.createdAt).toLocaleString('en-ZA')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
