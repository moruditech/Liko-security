import { InquiryForm } from './InquiryForm';
import styles from './ContactFormCard.module.css';

export function ContactFormCard() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.icon}>
          <MailIcon />
        </span>
        <div>
          <h2>Send Us a Message</h2>
          <p>Fill in the form below and we&apos;ll get back to you as soon as possible.</p>
        </div>
      </div>

      <InquiryForm />
    </div>
  );
}

function MailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--liko-navy)" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}
