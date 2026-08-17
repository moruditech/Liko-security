import type { Faq } from '@/types/api';
import styles from './FaqsStatsRow.module.css';

export function FaqsStatsRow({ faqs }: { faqs: Faq[] }) {
  const activeCount = faqs.filter((f) => f.isActive).length;

  const stats = [
    { key: 'total', icon: <QuestionIcon />, accent: styles.icon_navy, label: 'Total FAQs', value: faqs.length },
    { key: 'active', icon: <EyeIcon />, accent: styles.icon_success, label: 'Active', value: activeCount },
    { key: 'inactive', icon: <EyeOffIcon />, accent: styles.icon_mixed, label: 'Inactive', value: faqs.length - activeCount },
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

function QuestionIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 015 0c0 1.4-1.1 2-2.5 2.5S10.5 12.6 10.5 14" />
      <circle cx="12" cy="17.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M17.9 17.9A10.4 10.4 0 0112 19c-6.5 0-10-7-10-7a18.6 18.6 0 015.1-5.6M9.9 4.2A9.7 9.7 0 0112 4c6.5 0 10 7 10 7a18.4 18.4 0 01-2.2 3.2M14.1 14.1a3 3 0 10-4.2-4.2" />
      <path d="M2 2l20 20" />
    </svg>
  );
}
