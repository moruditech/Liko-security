import { COMPANY } from '@/lib/constants/company';
import styles from './ImpactStats.module.css';

export function ImpactStats() {
  const stats = [
    { ...COMPANY.stats.studentsTrained, icon: <GraduationCapIcon /> },
    { ...COMPANY.stats.passRate, icon: <ShieldCheckIcon /> },
    { ...COMPANY.stats.yearsExperience, icon: <MedalIcon /> },
    { ...COMPANY.stats.partnerCompanies, icon: <BuildingIcon /> },
  ];

  return (
    <div className={styles.band}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Our Impact In Numbers</p>
        <h2>Building Safer Communities, Together</h2>
        <div className={styles.underline} />
      </div>

      <div className={styles.grid}>
        {stats.map((stat) => (
          <div key={stat.label}>
            <span className={styles.icon}>{stat.icon}</span>
            <span className={styles.number}>{stat.value}</span>
            <span className={styles.label}>{stat.label}</span>
            <p className={styles.desc}>{stat.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function GraduationCapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M22 10L12 5 2 10l10 5 10-5zM6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 2l7 3v6c0 5-3 9.2-7 10-4-.8-7-5-7-10V5z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function MedalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="8" r="5" />
      <path d="M8 13l-2 8 6-3 6 3-2-8" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="4" y="3" width="16" height="18" />
      <path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1" />
    </svg>
  );
}
