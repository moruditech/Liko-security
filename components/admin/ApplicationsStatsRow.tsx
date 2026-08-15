import styles from './ApplicationsStatsRow.module.css';

interface ApplicationsStatsRowProps {
  total: number | null;
  newCount: number | null;
  underReviewCount: number | null;
  enrolledCount: number | null;
}

export function ApplicationsStatsRow({ total, newCount, underReviewCount, enrolledCount }: ApplicationsStatsRowProps) {
  const stats = [
    {
      key: 'total',
      icon: <InboxIcon />,
      accent: styles.icon_navy,
      label: 'Total applications',
      value: total,
      caption: 'All submitted applications',
    },
    {
      key: 'new',
      icon: <SparkleIcon />,
      accent: styles.icon_gold,
      label: 'New',
      value: newCount,
      caption: 'Awaiting first review',
    },
    {
      key: 'underReview',
      icon: <ClockIcon />,
      accent: styles.icon_mixed,
      label: 'Under review',
      value: underReviewCount,
      caption: 'Currently being assessed',
    },
    {
      key: 'enrolled',
      icon: <CheckIcon />,
      accent: styles.icon_success,
      label: 'Enrolled',
      value: enrolledCount,
      caption: 'Confirmed learners',
    },
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
          <div className={styles.caption}>{stat.caption}</div>
        </div>
      ))}
    </div>
  );
}

function InboxIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.5 5h13l3.5 7v7a2 2 0 01-2 2H4a2 2 0 01-2-2v-7l3.5-7z" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 3v6M12 15v6M3 12h6M15 12h6" />
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

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.5 2.5 5-5" />
    </svg>
  );
}
