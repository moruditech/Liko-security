import type { Announcement } from '@/types/api';
import { computeState } from './AnnouncementList';
import styles from './AnnouncementsStatsRow.module.css';

export function AnnouncementsStatsRow({ announcements }: { announcements: Announcement[] }) {
  const live = announcements.filter((a) => computeState(a) === 'live').length;
  const scheduled = announcements.filter((a) => computeState(a) === 'scheduled').length;
  const expired = announcements.filter((a) => computeState(a) === 'expired').length;

  const stats = [
    { key: 'total', icon: <MegaphoneIcon />, accent: styles.icon_navy, label: 'Total announcements', value: announcements.length },
    { key: 'live', icon: <PulseIcon />, accent: styles.icon_success, label: 'Live', value: live },
    { key: 'scheduled', icon: <ClockIcon />, accent: styles.icon_gold, label: 'Scheduled', value: scheduled },
    { key: 'expired', icon: <ArchiveIcon />, accent: styles.icon_mixed, label: 'Expired', value: expired },
  ];

  return (
    <div className={styles.grid}>
      {stats.map((stat) => (
        <div key={stat.key} className={styles.card}>
          <div className={styles.iconRow}>
            <span className={`${styles.icon} ${stat.accent}`}>{stat.icon}</span>
            <span className={styles.label}>{stat.label}</span>
          </div>
          <div className={styles.value}>{stat.value.toLocaleString('en-ZA')}</div>
        </div>
      ))}
    </div>
  );
}

function MegaphoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 11v2a2 2 0 002 2h1l3 5V4L6 9H5a2 2 0 00-2 2z" />
      <path d="M14 8a4 4 0 010 8M17 4a9 9 0 010 16" />
    </svg>
  );
}

function PulseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 12h4l2-7 4 14 2-7h6" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

function ArchiveIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="4" width="18" height="4" rx="1" />
      <path d="M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8M10 13h4" />
    </svg>
  );
}
