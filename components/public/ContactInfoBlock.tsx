import { COMPANY } from '@/lib/constants/company';
import type { Settings } from '@/types/api';
import styles from './ContactInfoBlock.module.css';

export function ContactInfoBlock({ settings }: { settings: Settings | null }) {
  return (
    <div className={styles.list}>
      <div className={styles.item}>
        <span className={styles.icon}>
          <PinIcon />
        </span>
        <div>
          <strong>Our Location</strong>
          <span>
            {COMPANY.address.line1}, {COMPANY.address.city}
          </span>
        </div>
        <span className={styles.chevron} aria-hidden="true">
          &#8250;
        </span>
      </div>

      {settings?.contactPhone && (
        <div className={styles.item}>
          <span className={styles.icon}>
            <PhoneIcon />
          </span>
          <div>
            <strong>Call Us</strong>
            <span>{settings.contactPhone}</span>
          </div>
          <span className={styles.chevron} aria-hidden="true">
            &#8250;
          </span>
        </div>
      )}

      <div className={styles.item}>
        <span className={styles.icon}>
          <MailIcon />
        </span>
        <div>
          <strong>Email Us</strong>
          <span>{COMPANY.email}</span>
        </div>
        <span className={styles.chevron} aria-hidden="true">
          &#8250;
        </span>
      </div>

      <div className={styles.item}>
        <span className={styles.icon}>
          <ClockIcon />
        </span>
        <div>
          <strong>Office Hours</strong>
          <span>
            {COMPANY.officeHours.map((row) => (
              <span key={row.days} className={styles.hoursRow}>
                {row.days}: {row.hours}
              </span>
            ))}
          </span>
        </div>
        <span className={styles.chevron} aria-hidden="true">
          &#8250;
        </span>
      </div>
    </div>
  );
}

function PinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--liko-navy)" strokeWidth="2" aria-hidden="true">
      <path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--liko-navy)" strokeWidth="2" aria-hidden="true">
      <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.7A2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.7a2 2 0 01-.4 2.1L8 9.9a16 16 0 006 6l1.4-1.3a2 2 0 012.1-.4c.9.3 1.8.5 2.7.6a2 2 0 011.8 2.1z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--liko-navy)" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--liko-navy)" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}
