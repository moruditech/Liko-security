import type { Permission, Role } from '@/types/api';
import styles from './RolesStatsRow.module.css';

const ALL_PERMISSIONS_COUNT = 10; // matches PermissionCheckboxGrid's ALL_PERMISSIONS list (types/api.ts's Permission union)

export function RolesStatsRow({ roles }: { roles: Role[] }) {
  const fullAccessCount = roles.filter((r) => r.permissions.includes('users:manage' as Permission)).length;

  const stats = [
    { key: 'total', icon: <ShieldIcon />, accent: styles.icon_navy, label: 'Total roles', value: roles.length },
    { key: 'fullAccess', icon: <KeyIcon />, accent: styles.icon_gold, label: 'Full-access roles', value: fullAccessCount },
    { key: 'permissions', icon: <LockIcon />, accent: styles.icon_success, label: 'Available permissions', value: ALL_PERMISSIONS_COUNT },
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

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="8" cy="15" r="4" />
      <path d="M11 12l8-8M16 4l3 3M13 9l2 2" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 018 0v4" />
    </svg>
  );
}
