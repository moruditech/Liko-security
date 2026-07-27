import { COMPANY } from '@/lib/constants/company';
import styles from './AccreditationBadges.module.css';

export function AccreditationBadges() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Accredited &amp; Recognised</p>
        <h2>PSIRA-Accredited. Trusted. Recognised.</h2>
        <div className={styles.underline} />
        <p className={styles.subtitle}>
          Registered with PSIRA (No. {COMPANY.psiraNumber}) and based at Centre No. {COMPANY.centreNumber} in{' '}
          {COMPANY.address.city}.
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.item}>
          <span className={styles.iconBadge}>
            <ShieldIcon />
          </span>
          <h3>PSIRA Accredited</h3>
          <p>Registered training provider you can trust.</p>
        </div>
        <div className={styles.item}>
          <span className={styles.iconBadge}>
            <BuildingIcon />
          </span>
          <h3>Reg. No. {COMPANY.psiraNumber}</h3>
          <p>Officially registered with PSIRA.</p>
        </div>
        <div className={styles.item}>
          <span className={styles.iconBadge}>
            <PinIcon />
          </span>
          <h3>Centre No. {COMPANY.centreNumber}</h3>
          <p>Proudly based in {COMPANY.address.city}.</p>
        </div>
        <div className={styles.item}>
          <span className={styles.iconBadge}>
            <MedalIcon />
          </span>
          <h3>Quality Assured</h3>
          <p>Training that meets national standards.</p>
        </div>
      </div>
    </section>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 2l7 3v6c0 5-3 9.2-7 10-4-.8-7-5-7-10V5z" />
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

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 21s7-6.5 7-11.5A7 7 0 105 9.5C5 14.5 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.3" />
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
