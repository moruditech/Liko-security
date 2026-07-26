import type { Metadata } from 'next';
import styles from '../legal.module.css';

export const metadata: Metadata = {
  title: 'Privacy Policy | Liko Security Training',
};

/**
 * TAD §11.9: structure only. Legal copy drafted by client/legal counsel.
 */
export default function PrivacyPage() {
  return (
    <main className={styles.main}>
      <h1>Privacy Policy</h1>
      <p className={styles.pending}>Placeholder structure only. Final legal copy pending client/legal counsel.</p>

      <section>
        <h2>Information we collect</h2>
        <p>
          [Placeholder: name, ID/passport number, contact details, address, and ID document, and why each is
          collected.]
        </p>
      </section>

      <section>
        <h2>Legal basis for processing</h2>
        <p>[Placeholder: the POPIA legal basis relied on for each category of processing.]</p>
      </section>

      <section>
        <h2>Third parties</h2>
        <p>
          [Placeholder: third parties involved in processing, including Mailjet acting as a POPIA &quot;operator&quot;
          per the backend architecture.]
        </p>
      </section>

      <section>
        <h2>Data retention</h2>
        <p>[Placeholder: how long personal information is retained and why.]</p>
      </section>

      <section>
        <h2>Your rights</h2>
        <p>[Placeholder: applicant rights under POPIA, including access, correction, and deletion requests.]</p>
      </section>

      <section>
        <h2>Information Officer</h2>
        <p>[Placeholder: Information Officer contact details.]</p>
      </section>

      <section>
        <h2>Breach notification</h2>
        <p>[Placeholder: breach notification statement.]</p>
      </section>
    </main>
  );
}
