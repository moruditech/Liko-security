import styles from './InquiriesStatsRow.module.css';

interface InquiriesStatsRowProps {
  total: number | null;
  open: number | null;
  replied: number | null;
}

// Takes counts, not the current page's `inquiries` array — the array is only
// the current filtered page (up to 20 rows), and rendering counts derived
// from it would silently understate the real totals. Same fix applied to
// ApplicationsStatsRow earlier: separate GET calls with limit:1, reading `total`.
export function InquiriesStatsRow({ total, open, replied }: InquiriesStatsRowProps) {
  const stats = [
    { key: 'total', icon: <MailIcon />, accent: styles.icon_navy, label: 'Total inquiries', value: total },
    { key: 'open', icon: <AlertIcon />, accent: styles.icon_gold, label: 'Open', value: open },
    { key: 'replied', icon: <CheckIcon />, accent: styles.icon_success, label: 'Replied', value: replied },
  ];

  return (
    <div className={styles.grid}>
      {stats.map((stat) => (
        <div key={stat.key} className={styles.card}>
          <div className={styles.iconRow}>
            <span className={`${styles.icon} ${stat.accent}`}>{stat.icon}</span>
            <span className={styles.label}>{stat.label}</span>
          </div>
          <div className={styles.value}>{stat.value === null ? '—' : stat.value.toLocaleString('en-ZA')}</div>
        </div>
      ))}
    </div>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5" />
      <circle cx="12" cy="16.5" r="0.75" fill="currentColor" stroke="none" />
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
