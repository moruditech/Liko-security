import Link from 'next/link';
import { settingsApi } from '@/lib/api/settings';
import { COMPANY } from '@/lib/constants/company';
import styles from './SiteFooter.module.css';

export async function SiteFooter() {
  // Settings fetch failing shouldn't take the whole footer down, contact
  // numbers just won't render that column if it does.
  const settings = await settingsApi.get().catch(() => null);

  return (
    <footer className={styles.footer}>
      <div className={styles.column}>
        <strong>{COMPANY.name}</strong>
        <p>PSIRA No. {COMPANY.psiraNumber}</p>
        <p>Centre No. {COMPANY.centreNumber}</p>
      </div>

      <div className={styles.column}>
        <strong>Quick links</strong>
        <Link href="/courses">Courses</Link>
        <Link href="/gallery">Gallery</Link>
        <Link href="/apply">Apply Now</Link>
      </div>

      <div className={styles.column}>
        <strong>Contact</strong>
        <p>
          {COMPANY.address.line1}, {COMPANY.address.city}
        </p>
        {settings?.contactPhone && <p>{settings.contactPhone}</p>}
        {settings?.whatsappNumber && <p>WhatsApp: {settings.whatsappNumber}</p>}
      </div>

      <div className={styles.column}>
        <strong>Legal</strong>
        <Link href="/terms">Terms &amp; Conditions</Link>
        <Link href="/privacy">Privacy Policy</Link>
      </div>
    </footer>
  );
}
