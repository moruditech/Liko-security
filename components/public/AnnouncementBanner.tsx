import type { Announcement } from '@/types/api';
import styles from './AnnouncementBanner.module.css';

export function AnnouncementBanner({ announcements }: { announcements: Announcement[] }) {
  if (announcements.length === 0) return null;

  return (
    <div className={styles.banner} role="status">
      {announcements.map((a) => (
        <p key={a.id}>
          <strong>{a.title}.</strong> {a.body}
        </p>
      ))}
    </div>
  );
}
