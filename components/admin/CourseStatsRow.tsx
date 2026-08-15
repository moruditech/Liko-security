import styles from './CourseStatsRow.module.css';

interface CourseStatsRowProps {
  totalCourses: number;
  activeCourses: number;
  upcomingIntakes: number;
  /** null while loading, or when the session lacks applications:read */
  totalEnrollments: number | null;
}

export function CourseStatsRow({ totalCourses, activeCourses, upcomingIntakes, totalEnrollments }: CourseStatsRowProps) {
  const stats = [
    {
      key: 'total',
      icon: <BookIcon />,
      accent: styles.icon_navy,
      label: 'Total courses',
      value: totalCourses.toLocaleString('en-ZA'),
      caption: 'All available courses',
    },
    {
      key: 'active',
      icon: <CheckIcon />,
      accent: styles.icon_success,
      label: 'Active courses',
      value: activeCourses.toLocaleString('en-ZA'),
      caption: 'Visible to learners',
    },
    {
      key: 'upcoming',
      icon: <ClockIcon />,
      accent: styles.icon_gold,
      label: 'Upcoming intakes',
      value: upcomingIntakes.toLocaleString('en-ZA'),
      caption: 'Next 90 days',
    },
    {
      key: 'enrollments',
      icon: <UsersIcon />,
      accent: styles.icon_mixed,
      label: 'Total enrollments',
      value: totalEnrollments === null ? '—' : totalEnrollments.toLocaleString('en-ZA'),
      caption: 'Across all courses',
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
          <div className={styles.value}>{stat.value}</div>
          <div className={styles.caption}>{stat.caption}</div>
        </div>
      ))}
    </div>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20V4a2 2 0 00-2-2H6.5A2.5 2.5 0 004 4.5v15z" />
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

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="9" cy="8" r="3" />
      <path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6M16 8.5a3 3 0 010 5M22 20c0-2.7-2.2-5-5-5.7" />
    </svg>
  );
}
