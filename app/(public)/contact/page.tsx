import type { Metadata } from 'next';
import { settingsApi } from '@/lib/api/settings';
import { ContactInfoBlock } from '@/components/public/ContactInfoBlock';
import { LocationMap } from '@/components/public/LocationMap';
import { ContactFormCard } from '@/components/public/ContactFormCard';
import { COMPANY } from '@/lib/constants/company';
import styles from './page.module.css';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Contact | Liko Security Training',
  description: 'Get in touch with Liko Security Training in Mount Frere.',
};

export default async function ContactPage() {
  const settings = await settingsApi.get().catch(() => null);
  const directionsHref = `https://maps.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${COMPANY.address.line1}, ${COMPANY.address.city}, South Africa`,
  )}`;

  return (
    <main className={styles.main}>
      <div className={styles.grid}>
        <div>
          <p className={styles.eyebrow}>Get In Touch</p>
          <h1>Contact Us</h1>
          <hr className={styles.rule} />
          <p className={styles.lead}>
            We&apos;re here to help. Whether you have a question about our courses, need more information, or want
            to partner with us, feel free to reach out.
          </p>

          <ContactInfoBlock settings={settings} />
          <LocationMap />

          {/* Mobile-only per the reference design; desktop relies on the map itself */}
          <a href={directionsHref} target="_blank" rel="noopener noreferrer" className={styles.directionsBtn}>
            Get Directions
            <PinIcon />
          </a>
        </div>

        <ContactFormCard />
      </div>

      {/*
        FLAG: these four blurbs (Quick Response / Expert Support / Visit Us /
        Partnerships) are static copy straight from the reference image, no
        CMS/Settings field backs them, same caveat as the About page's impact
        stats. Edit here directly if the wording needs to change.
      */}
      <div className={styles.perks}>
        <div className={styles.perkItem}>
          <span className={styles.perkIcon}>
            <ShieldCheckIcon />
          </span>
          <div>
            <strong>Quick Response</strong>
            <p>We aim to respond to all enquiries within 24 hours.</p>
          </div>
        </div>
        <div className={styles.perkItem}>
          <span className={styles.perkIcon}>
            <PersonIcon />
          </span>
          <div>
            <strong>Expert Support</strong>
            <p>Our team is ready to help you find the right training.</p>
          </div>
        </div>
        <div className={styles.perkItem}>
          <span className={styles.perkIcon}>
            <CalendarIcon />
          </span>
          <div>
            <strong>Visit Us</strong>
            <p>Walk-ins welcome during our office hours.</p>
          </div>
        </div>
        <div className={styles.perkItem}>
          <span className={styles.perkIcon}>
            <HandshakeIcon />
          </span>
          <div>
            <strong>Partnerships</strong>
            <p>Interested in partnering with us? Let&apos;s start a conversation.</p>
          </div>
        </div>
      </div>
    </main>
  );
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--liko-navy)" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 2l8 3v6c0 5.2-3.4 9.6-8 11-4.6-1.4-8-5.8-8-11V5z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--liko-navy)" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M5 21c0-4 3-6.5 7-6.5s7 2.5 7 6.5" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--liko-navy)" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M3 9h18M8 2v4M16 2v4" />
    </svg>
  );
}

function HandshakeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--liko-navy)" strokeWidth="1.8" aria-hidden="true">
      <path d="M11 13l-2-2a2 2 0 00-3 0l-1 1a2 2 0 000 3l6 6a2 2 0 003 0l7-7a2 2 0 000-3l-1-1a2 2 0 00-3 0l-1 1" />
      <path d="M13 11l2 2" />
    </svg>
  );
}
