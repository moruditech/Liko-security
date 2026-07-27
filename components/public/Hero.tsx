import Image from 'next/image';
import { COMPANY } from '@/lib/constants/company';
import styles from './Hero.module.css';

/**
 * No real photo exists yet: place a licensed photo at public/hero-photo.jpg
 * and flip HAS_HERO_PHOTO to true. Do not use unlicensed stock photography
 * here in production, consider a real photo of Liko's own campus/instructors
 * per Liko_Frontend_Design_Research-1.md's trust-signal guidance.
 */
const HAS_HERO_PHOTO = false;

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>Professional Security Training</p>
        <h1>
          Empowering Professionals.
          <br />
          <span className={styles.accent}>Building Safer Communities.</span>
        </h1>
        <div className={styles.underline} />
        <p className={styles.lede}>
          Accredited security training that equips you with the skills, knowledge, and confidence to protect what
          matters most.
        </p>

        <div className={styles.actions}>
          <a href="/courses" className={styles.btnPrimary}>
            Explore Courses <span aria-hidden="true">&rarr;</span>
          </a>
          {COMPANY.heroVideoUrl && (
            <a href={COMPANY.heroVideoUrl} target="_blank" rel="noopener noreferrer" className={styles.btnSecondary}>
              <span aria-hidden="true">&#9658;</span> Watch Video
            </a>
          )}
        </div>

        <div className={styles.trustRow}>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>
              <ShieldCheckIcon />
            </span>
            <span>PSIRA Accredited</span>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>
              <PeopleIcon />
            </span>
            <span>Experienced Instructors</span>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>
              <ClipboardIcon />
            </span>
            <span>Practical Learning</span>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>
              <BriefcaseIcon />
            </span>
            <span>Career Focused</span>
          </div>
        </div>
      </div>

      <div className={styles.visual}>
        <svg className={styles.shieldWatermark} viewBox="0 0 200 230" fill="none" aria-hidden="true">
          <path
            d="M100 8L188 45V110C188 165 150 205 100 222C50 205 12 165 12 110V45L100 8Z"
            stroke="var(--liko-gold)"
            strokeWidth="6"
            fill="none"
            opacity="0.35"
          />
        </svg>

        <div className={styles.photoFrame}>
          {HAS_HERO_PHOTO ? (
            <Image src="/hero-photo.jpg" alt="Liko Security Training guard on duty" fill style={{ objectFit: 'cover' }} priority />
          ) : (
            <div className={styles.photoPlaceholder}>
              Photo placeholder
              <br />
              add a licensed image at
              <br />
              <code>public/hero-photo.jpg</code>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ShieldCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 2l7 3v6c0 5-3 9.2-7 10-4-.8-7-5-7-10V5z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="9" cy="8" r="3" />
      <path d="M2 20c0-3.3 3-6 7-6s7 2.7 7 6" />
      <circle cx="17" cy="9" r="2.3" />
      <path d="M22 20c0-2.5-1.8-4.6-4.3-5.4" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M7 9h6M7 13h10" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  );
}
