import Link from 'next/link';
import styles from './BottomCta.module.css';

export function BottomCta() {
  return (
    <div className={styles.band}>
      <div className={styles.left}>
        <span className={styles.phoneIcon}>
          <PhoneIcon />
        </span>
        <div>
          <h2>Ready to Start Your Career in Security?</h2>
          <p>Take the first step towards a safer future.</p>
        </div>
      </div>
      <Link href="/apply" className={styles.button}>
        Apply Now <span aria-hidden="true">&rarr;</span>
      </Link>
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.7A2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.7a2 2 0 01-.4 2.1L8 9.9a16 16 0 006 6l1.4-1.3a2 2 0 012.1-.4c.9.3 1.8.5 2.7.6a2 2 0 011.8 2.1z" />
    </svg>
  );
}
