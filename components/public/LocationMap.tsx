import { COMPANY } from '@/lib/constants/company';
import styles from './LocationMap.module.css';

export function LocationMap() {
  const query = encodeURIComponent(`${COMPANY.address.line1}, ${COMPANY.address.city}, South Africa`);

  return (
    <div className={styles.wrapper}>
      {/*
        Keyless Google Maps embed (google.com/maps?output=embed), no API key
        required, unlike the JS Maps Embed API. Confirm the exact pin lands
        on the real campus once the address is verified (see the flag in
        lib/constants/company.ts); a text query embed can land slightly off
        for a rural address like this one.
      */}
      <iframe
        title="Liko Security Training location"
        src={`https://maps.google.com/maps?q=${query}&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
