import type { AuditLogEntry } from '@/types/api';
import styles from './AuditLogTable.module.css';

export function AuditLogTable({ entries }: { entries: AuditLogEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className={styles.card}>
        <p className={styles.empty}>No audit log entries match these filters.</p>
      </div>
    );
  }

  return (
    <div className={styles.card}>
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
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td className={styles.actorCell}>{entry.actor ? entry.actor.name : 'System'}</td>
              <td>
                <span className="mono">{entry.action}</span>
              </td>
              <td>
                {entry.targetType ? (
                  <span className={`mono ${styles.targetTag}`}>
                    {entry.targetType} ({entry.targetId})
                  </span>
                ) : (
                  <span className={styles.dash}>—</span>
                )}
              </td>
              <td>{new Date(entry.createdAt).toLocaleString('en-ZA')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
