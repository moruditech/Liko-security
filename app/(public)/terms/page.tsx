import type { Metadata } from 'next';
import styles from '../legal.module.css';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Liko Security Training',
};

/**
 * TAD §11.8: this page defines structure only. Legal copy is drafted by the
 * client/legal counsel, not generated here, every paragraph below is a
 * structural placeholder, not real legal language, and must be replaced
 * before this page ships.
 */
export default function TermsPage() {
  return (
    <main className={styles.main}>
      <h1>Terms &amp; Conditions</h1>
      <p className={styles.pending}>Placeholder structure only. Final legal copy pending client/legal counsel.</p>

      <section>
        <h2>Application terms</h2>
        <p>[Placeholder: conditions under which an application is accepted, processed, and finalized.]</p>
      </section>

      <section>
        <h2>Course enrollment conditions</h2>
        <p>[Placeholder: conditions for enrollment, attendance requirements, and completion criteria.]</p>
      </section>

      <section>
        <h2>Payment and refund policy</h2>
        <p>[Placeholder: payment terms, timelines, and refund conditions.]</p>
      </section>

      <section>
        <h2>PSIRA registration fee</h2>
        <p>[Placeholder: whether the PSIRA registration fee is refundable, non-refundable, or conditional. Client/legal to confirm.]</p>
      </section>

      <section>
        <h2>Governing law</h2>
        <p>[Placeholder: governing jurisdiction and law.]</p>
      </section>
    </main>
  );
}
