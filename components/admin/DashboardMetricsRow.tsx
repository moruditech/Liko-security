import type { AnalyticsDashboard } from '@/types/api';
import styles from './DashboardMetricsRow.module.css';

interface DashboardMetricsRowProps {
  metrics: AnalyticsDashboard['metrics'] | null;
}

export function DashboardMetricsRow({ metrics }: DashboardMetricsRowProps) {
  const conversionRate = metrics?.conversionRate.rate ?? null;
  const avgDays = metrics?.avgTimeToEnrollment.avgDays ?? null;
  const avgHours = metrics?.avgInquiryResponseTime.avgHours ?? null;
  const revenue = metrics?.monthlyRevenue ?? null;
  const mfaRate = metrics?.mfaAdoption.rate ?? null;

  const stats = [
    {
      key: 'conversion',
      icon: <TargetIcon />,
      accent: styles.icon_navy,
      label: 'Conversion rate',
      value: conversionRate === null ? '\u2013' : `${conversionRate}%`,
      caption: 'Enrolled vs. finalized applications',
    },
    {
      key: 'timeToEnroll',
      icon: <ClockIcon />,
      accent: styles.icon_gold,
      label: 'Avg. time to enroll',
      value: avgDays === null ? '\u2013' : `${avgDays}d`,
      caption: 'From application to enrollment',
    },
    {
      key: 'inquiryResponse',
      icon: <ChatIcon />,
      accent: styles.icon_mixed,
      label: 'Avg. inquiry response',
      value: avgHours === null ? '\u2013' : `${avgHours}h`,
      caption: 'Time to first reply',
    },
    {
      key: 'revenue',
      icon: <BanknoteIcon />,
      accent: styles.icon_success,
      label: 'Revenue this month',
      value: revenue === null ? '\u2013' : `R${revenue.thisMonth.toLocaleString('en-ZA')}`,
      caption: revenue?.change == null ? 'No prior month to compare' : `${revenue.change > 0 ? '+' : ''}${revenue.change}% vs. last month`,
      captionClass: revenue?.change == null ? undefined : revenue.change >= 0 ? styles.trendUp : styles.trendDown,
    },
    {
      key: 'mfa',
      icon: <ShieldIcon />,
      accent: styles.icon_navy,
      label: 'MFA adoption',
      value: mfaRate === null ? '\u2013' : `${mfaRate}%`,
      caption: 'Staff accounts with MFA enabled',
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
          <div className={`${styles.caption} ${stat.captionClass ?? ''}`}>{stat.caption}</div>
        </div>
      ))}
    </div>
  );
}

function TargetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
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

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 20l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
    </svg>
  );
}

function BanknoteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="3" />
      <path d="M6 10v.01M18 14v.01" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 3l8 3v6c0 4.5-3 7.5-8 9-5-1.5-8-4.5-8-9V6l8-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
