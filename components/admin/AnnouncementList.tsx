import type { Announcement } from '@/types/api';
import styles from './AnnouncementList.module.css';

function computeState(announcement: Announcement): 'scheduled' | 'live' | 'expired' {
  const now = Date.now();
  const publishAt = new Date(announcement.publishAt).getTime();
  const expiresAt = announcement.expiresAt ? new Date(announcement.expiresAt).getTime() : null;

  if (publishAt > now) return 'scheduled';
  if (expiresAt && expiresAt < now) return 'expired';
  return 'live';
}

interface AnnouncementListProps {
  announcements: Announcement[];
  onEdit: (announcement: Announcement) => void;
  onDelete: (announcement: Announcement) => void;
}

export function AnnouncementList({ announcements, onEdit, onDelete }: AnnouncementListProps) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Title</th>
          <th>Status</th>
          <th>Publishes</th>
          <th>Expires</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {announcements.map((a) => (
          <tr key={a.id}>
            <td>{a.title}</td>
            <td>{computeState(a)}</td>
            <td>{new Date(a.publishAt).toLocaleDateString('en-ZA')}</td>
            <td>{a.expiresAt ? new Date(a.expiresAt).toLocaleDateString('en-ZA') : 'No expiry'}</td>
            <td>
              <button type="button" onClick={() => onEdit(a)}>
                Edit
              </button>
              <button type="button" onClick={() => onDelete(a)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
