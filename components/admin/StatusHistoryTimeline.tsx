import type { Application } from '@/types/api';
import styles from './StatusHistoryTimeline.module.css';

export function StatusHistoryTimeline({ history }: { history: Application['statusHistory'] }) {
  if (history.length === 0) return null;

  return (
    <ol className={styles.timeline}>
      {history.map((entry, i) => (
        <li key={i} className={styles.entry}>
          <span className={styles.dot} />
          <div className={styles.content}>
            <span className={styles.status}>{entry.status.replace('_', ' ')}</span>
            <span className={styles.meta}>
              {entry.changedBy ? entry.changedBy.name : 'System'} · {new Date(entry.date).toLocaleString('en-ZA')}
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
}
