import type { StaffUser } from '@/types/api';
import styles from './UsersStatsRow.module.css';

export function UsersStatsRow({ users }: { users: StaffUser[] }) {
  const activeCount = users.filter((u) => u.active).length;
  const roleCount = new Set(users.map((u) => u.role.id)).size;

  const stats = [
    { key: 'total', icon: <UsersIcon />, accent: styles.icon_navy, label: 'Total staff', value: users.length },
    { key: 'active', icon: <CheckIcon />, accent: styles.icon_success, label: 'Active', value: activeCount },
    { key: 'inactive', icon: <XIcon />, accent: styles.icon_mixed, label: 'Inactive', value: users.length - activeCount },
    { key: 'roles', icon: <ShieldIcon />, accent: styles.icon_gold, label: 'Roles in use', value: roleCount },
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

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5M16 4.5c1.8.3 3.2 1.9 3.2 3.8S17.8 12 16 12.3M21.5 20c0-3-2-5.5-4.7-6.3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.5 2.5 5-5" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9l6 6M15 9l-6 6" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" />
    </svg>
  );
}
