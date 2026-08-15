import type { Announcement } from '@/types/api';
import styles from './AnnouncementList.module.css';

export function computeState(announcement: Announcement): 'scheduled' | 'live' | 'expired' {
  const now = Date.now();
  const publishAt = new Date(announcement.publishAt).getTime();
  const expiresAt = announcement.expiresAt ? new Date(announcement.expiresAt).getTime() : null;

  if (publishAt > now) return 'scheduled';
  if (expiresAt && expiresAt < now) return 'expired';
  return 'live';
}

const STATE_LABEL: Record<ReturnType<typeof computeState>, string> = {
  scheduled: 'Scheduled',
  live: 'Live',
  expired: 'Expired',
};

interface AnnouncementListProps {
  announcements: Announcement[];
  onEdit: (announcement: Announcement) => void;
  onDelete: (announcement: Announcement) => void;
}

export function AnnouncementList({ announcements, onEdit, onDelete }: AnnouncementListProps) {
  if (announcements.length === 0) {
    return (
      <div className={styles.card}>
        <p className={styles.empty}>No announcements yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Publishes</th>
            <th>Expires</th>
            <th className={styles.actionsHeader} />
          </tr>
        </thead>
        <tbody>
          {announcements.map((a) => {
            const state = computeState(a);
            return (
              <tr key={a.id}>
                <td className={styles.titleCell}>{a.title}</td>
                <td>
                  <span className={`${styles.statusPill} ${styles[state]}`}>{STATE_LABEL[state]}</span>
                </td>
                <td>{new Date(a.publishAt).toLocaleDateString('en-ZA')}</td>
                <td>{a.expiresAt ? new Date(a.expiresAt).toLocaleDateString('en-ZA') : 'No expiry'}</td>
                <td className={styles.actionsCell}>
                  <button type="button" className={styles.textButton} onClick={() => onEdit(a)}>
                    Edit
                  </button>
                  <button type="button" className={styles.deleteButton} onClick={() => onDelete(a)}>
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
