import type { Metadata } from 'next';
import { settingsApi } from '@/lib/api/settings';
import { ContactInfoBlock } from '@/components/public/ContactInfoBlock';
import { LocationMap } from '@/components/public/LocationMap';
import { InquiryForm } from '@/components/public/InquiryForm';
import styles from './page.module.css';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Contact | Liko Security Training',
  description: 'Get in touch with Liko Security Training in Mount Frere.',
};

export default async function ContactPage() {
  const settings = await settingsApi.get().catch(() => null);

  return (
    <main className={styles.main}>
      <h1>Contact us</h1>
      <div className={styles.grid}>
        <div>
          <ContactInfoBlock settings={settings} />
          <LocationMap />
        </div>
        <InquiryForm />
      </div>
    </main>
  );
}
