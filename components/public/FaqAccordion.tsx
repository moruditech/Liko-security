import type { Faq } from '@/types/api';
import styles from './FaqAccordion.module.css';

export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) return null;

  return (
    <section className={styles.section}>
      <h2>Frequently asked questions</h2>
      <div className={styles.list}>
        {faqs.map((faq) => (
          <details key={faq.id} className={styles.item}>
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
