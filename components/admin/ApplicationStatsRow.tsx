import type { Application, Invoice } from '@/types/api';
import styles from './ApplicationStatsRow.module.css';

interface ApplicationStatsRowProps {
  application: Application;
  invoices: Invoice[];
}

export function ApplicationStatsRow({ application, invoices }: ApplicationStatsRowProps) {
  const daysInProcess = Math.max(
    0,
    Math.floor((Date.now() - new Date(application.createdAt).getTime()) / (1000 * 60 * 60 * 24))
  );

  const stats = [
    {
      key: 'amount',
      icon: <CoinIcon />,
      accent: styles.icon_gold,
      label: 'Total amount',
      value: `R${application.totalAmount.toLocaleString('en-ZA')}`,
      caption: 'Courses + PSIRA fee',
    },
    {
      key: 'courses',
      icon: <BookIcon />,
      accent: styles.icon_navy,
      label: 'Courses selected',
      value: application.coursesSelected.length.toLocaleString('en-ZA'),
      caption: application.preferredIntake.title,
    },
    {
      key: 'invoices',
      icon: <ReceiptIcon />,
      accent: styles.icon_success,
      label: 'Invoices issued',
      value: invoices.length.toLocaleString('en-ZA'),
      caption: invoices.length === 0 ? 'None yet' : 'Proforma / official',
    },
    {
      key: 'days',
      icon: <ClockIcon />,
      accent: styles.icon_mixed,
      label: 'Days in process',
      value: daysInProcess.toLocaleString('en-ZA'),
      caption: 'Since submission',
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

function CoinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 015 0c0 1.4-1.1 2-2.5 2.5S9.5 12.6 9.5 14a2.5 2.5 0 005 0M12 7v10" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20V4a2 2 0 00-2-2H6.5A2.5 2.5 0 004 4.5v15z" />
    </svg>
  );
}

function ReceiptIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M6 2h12v20l-3-2-3 2-3-2-3 2V2z" />
      <path d="M9 8h6M9 12h6" />
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
