import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { settingsApi } from '@/lib/api/settings';
import { LocationMap } from '@/components/public/LocationMap';
import { COMPANY } from '@/lib/constants/company';
import styles from './page.module.css';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'About | Liko Security Training',
  description: 'PSIRA-accredited security training in Mount Frere. Our accreditation, campus, and facilities.',
};

export default async function AboutPage() {
  const settings = await settingsApi.get().catch(() => null);

  return (
    <main className={styles.main}>
      {/* ---- Hero ---- */}
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>About {COMPANY.name}</p>
          <h1>About Us</h1>
          <hr className={styles.rule} />
          <p className={styles.lead}>
            {COMPANY.name} is a professional security training provider committed to equipping individuals with the
            skills, knowledge and confidence to protect people, property and communities.
          </p>
          <p className={styles.lead}>
            Our training is practical, relevant and aligned with industry standards&mdash;preparing you for
            real-world challenges and career opportunities.
          </p>

          <div className={styles.featureRow}>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>
                <ShieldCheckIcon />
              </span>
              <span>
                <strong>Accredited Training</strong>
                <br />
                PSIRA Accredited
              </span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>
                <PeopleIcon />
              </span>
              <span>
                <strong>Career Focused</strong>
                <br />
                Skills for real opportunities
              </span>
            </div>
          </div>
        </div>

        <div className={styles.heroImageWrap}>
          <Image
            src="/images/about/hero-officer.png"
            alt="Liko Security Training officer on duty"
            width={800}
            height={600}
            className={styles.heroImage}
          />
        </div>
      </section>

      {/* ---- Mission & Vision ---- */}
      <section className={`${styles.section} ${styles.altBg}`}>
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>Our Purpose</p>
          <h2>Our Mission &amp; Vision</h2>
          <hr className={`${styles.rule} ${styles.center}`} />
        </div>

        <div className={styles.mvGrid}>
          <div className={styles.mvCard}>
            <span className={styles.mvIcon}>
              <TargetIcon />
            </span>
            <div>
              <h3>Our Mission</h3>
              <p>
                To deliver high-quality, accredited security training that empowers individuals to perform with
                professionalism, integrity and confidence.
              </p>
            </div>
          </div>
          <div className={styles.mvCard}>
            <span className={styles.mvIcon}>
              <EyeIcon />
            </span>
            <div>
              <h3>Our Vision</h3>
              <p>
                To be a leading security training provider recognised for excellence, innovation and our
                contribution to safer communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/*
        ---- Accreditation & campus ----
        Kept from the previous version of this page: real PSIRA/centre numbers,
        address, and the map embed. The reference design (mission/vision/values/
        impact/instructors) didn't include this, but it's real compliance data
        that was on the live page before, so it's folded in here rather than
        dropped in favour of the new marketing sections.
      */}
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>Accreditation &amp; Compliance</p>
          <h2>Our Campus</h2>
          <hr className={`${styles.rule} ${styles.center}`} />
        </div>

        <dl className={styles.facts}>
          <div>
            <dt>PSIRA registration number</dt>
            <dd className="mono">{COMPANY.psiraNumber}</dd>
          </div>
          <div>
            <dt>Training centre number</dt>
            <dd className="mono">{COMPANY.centreNumber}</dd>
          </div>
          <div>
            <dt>Address</dt>
            <dd>
              {COMPANY.address.line1}, {COMPANY.address.city}
            </dd>
          </div>
          {settings?.contactPhone && (
            <div>
              <dt>Phone</dt>
              <dd>{settings.contactPhone}</dd>
            </div>
          )}
        </dl>

        <LocationMap />
      </section>

      {/* ---- Core values ---- */}
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>Our Core Values</p>
          <h2>The Principles That Guide Us</h2>
          <hr className={`${styles.rule} ${styles.center}`} />
        </div>

        <div className={styles.valuesGrid}>
          <div className={styles.valueItem}>
            <span className={styles.valueIcon}>
              <ShieldCheckIcon />
            </span>
            <h4>Integrity</h4>
            <p>We do the right thing, always.</p>
          </div>
          <div className={styles.valueItem}>
            <span className={styles.valueIcon}>
              <PersonIcon />
            </span>
            <h4>Professionalism</h4>
            <p>We uphold the highest standards in everything we do.</p>
          </div>
          <div className={styles.valueItem}>
            <span className={styles.valueIcon}>
              <CapIcon />
            </span>
            <h4>Excellence</h4>
            <p>We are committed to quality and continuous improvement.</p>
          </div>
          <div className={styles.valueItem}>
            <span className={styles.valueIcon}>
              <PeopleIcon />
            </span>
            <h4>Respect</h4>
            <p>We treat everyone with dignity and fairness.</p>
          </div>
          <div className={styles.valueItem}>
            <span className={styles.valueIcon}>
              <HandShieldIcon />
            </span>
            <h4>Responsibility</h4>
            <p>We take ownership of our actions and their impact.</p>
          </div>
        </div>
      </section>

      {/*
        ---- Impact stats ----
        FLAG: these four numbers (1,000+ / 98% / 15+ / 50+) and the "Building a
        Safer Future" framing come straight from the reference image, not from
        any field in Settings or elsewhere in the codebase. There's no CMS/API
        source backing them, so they're hardcoded copy here, verify they're
        accurate before this ships, and wire them to real data later if they
        need to change without a redeploy.
      */}
      <section className={`${styles.section} ${styles.impact}`}>
        <p className={styles.eyebrow}>Our Impact</p>
        <h2 className={styles.impactHeading}>Building a Safer Future</h2>
        <hr className={styles.rule} />

        <div className={styles.impactGrid}>
          <div className={styles.impactItem}>
            <CapIcon stroke="var(--liko-gold)" />
            <div className={styles.impactNumber}>1,000+</div>
            <div className={styles.impactLabel}>Students Trained</div>
            <p className={styles.impactDesc}>Empowering individuals for successful careers.</p>
          </div>
          <div className={styles.impactItem}>
            <ShieldCheckIcon stroke="var(--liko-gold)" />
            <div className={styles.impactNumber}>98%</div>
            <div className={styles.impactLabel}>Pass Rate</div>
            <p className={styles.impactDesc}>High success rate across all our programs.</p>
          </div>
          <div className={styles.impactItem}>
            <MedalIcon />
            <div className={styles.impactNumber}>15+</div>
            <div className={styles.impactLabel}>Years Experience</div>
            <p className={styles.impactDesc}>Delivering trusted training with proven results.</p>
          </div>
          <div className={styles.impactItem}>
            <BuildingIcon />
            <div className={styles.impactNumber}>50+</div>
            <div className={styles.impactLabel}>Partner Companies</div>
            <p className={styles.impactDesc}>Building strong relationships across industries.</p>
          </div>
        </div>
      </section>

      {/* ---- Instructors ---- */}
      <section className={styles.instructors}>
        <div>
          <p className={styles.eyebrow}>Experienced. Qualified. Dedicated.</p>
          <h2>Our Instructors</h2>
          <hr className={styles.rule} />
          <p className={styles.lead}>
            Our team of experienced instructors brings real-world knowledge and practical insights to every training
            session&mdash;ensuring you learn from the best.
          </p>

          <ul className={styles.checkList}>
            <li>
              <CheckCircleIcon />
              Industry experienced professionals
            </li>
            <li>
              <CheckCircleIcon />
              Practical, hands-on training approach
            </li>
            <li>
              <CheckCircleIcon />
              Supportive learning environment
            </li>
          </ul>

          <Link href="/courses" className={styles.applyBtn}>
            Explore Our Courses <ArrowIcon />
          </Link>
        </div>

        <Image
          src="/images/about/instructors-classroom.png"
          alt="Instructor teaching a class of security trainees"
          width={800}
          height={900}
          className={styles.instructorsImage}
        />
      </section>
    </main>
  );
}

function ShieldCheckIcon({ stroke = 'var(--liko-navy)' }: { stroke?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" aria-hidden="true">
      <path d="M12 2l8 3v6c0 5.2-3.4 9.6-8 11-4.6-1.4-8-5.8-8-11V5z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function PeopleIcon({ stroke = 'var(--liko-navy)' }: { stroke?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" aria-hidden="true">
      <circle cx="8" cy="9" r="3" />
      <circle cx="16" cy="9" r="3" />
      <path d="M2 20c0-3 2.7-5 6-5s6 2 6 5M14 15c3.3 0 6 2 6 5" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--liko-navy)" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.4" fill="var(--liko-gold)" stroke="none" />
      <path d="M18 6l3-3" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--liko-navy)" strokeWidth="1.6" aria-hidden="true">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3.2" fill="var(--liko-gold)" stroke="none" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--liko-navy)" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M5 21c0-4 3-6.5 7-6.5s7 2.5 7 6.5" />
      <circle cx="18" cy="6" r="1" fill="var(--liko-gold)" stroke="none" />
    </svg>
  );
}

function CapIcon({ stroke = 'var(--liko-navy)' }: { stroke?: string }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" aria-hidden="true">
      <path d="M12 3L2 8l10 5 10-5-10-5zM6 10.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5" />
    </svg>
  );
}

function HandShieldIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--liko-navy)" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 2l7 3v5c0 4.5-3 8.3-7 9.5-4-1.2-7-5-7-9.5V5z" />
      <path d="M9 11l2 2 4-4" />
      <path d="M4 20c1.5-1.5 3-2 4-2" />
    </svg>
  );
}

function MedalIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--liko-gold)" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="9" r="5" />
      <path d="M9 13.5L7.5 21 12 18.5 16.5 21 15 13.5" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--liko-gold)" strokeWidth="1.6" aria-hidden="true">
      <rect x="5" y="3" width="14" height="18" rx="1" />
      <path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--liko-gold)" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12l2.5 2.5L16 9" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
