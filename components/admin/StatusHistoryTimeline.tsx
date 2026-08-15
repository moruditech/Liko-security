import type { Application } from '@/types/api';
import styles from './StatusHistoryTimeline.module.css';

export function StatusHistoryTimeline({ history }: { history: Application['statusHistory'] }) {
  if (history.length === 0) return null;

  return (
    <ol className={styles.timeline}>
      {history.map((entry, i) => (
        <li key={i}>
          <span className={styles.status}>{entry.status.replace('_', ' ')}</span>
          <span>{entry.changedBy ? entry.changedBy.name : 'System'}</span>
          <span>{new Date(entry.date).toLocaleString('en-ZA')}</span>
        </li>
      ))}
    </ol>
  );
}
