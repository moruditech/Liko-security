import { COMPANY } from '@/lib/constants/company';
import type { Settings } from '@/types/api';
import styles from './ContactInfoBlock.module.css';

export function ContactInfoBlock({ settings }: { settings: Settings | null }) {
  return (
    <div className={styles.block}>
      <p>
        {COMPANY.address.line1}, {COMPANY.address.city}
      </p>
      {settings?.contactPhone && <p>Phone: {settings.contactPhone}</p>}
      {settings?.whatsappNumber && <p>WhatsApp: {settings.whatsappNumber}</p>}
    </div>
  );
}
