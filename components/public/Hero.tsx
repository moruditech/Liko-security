import Link from 'next/link';
import Image from 'next/image';
import { FeeCalculator } from './FeeCalculator';
import { COMPANY } from '@/lib/constants/company';
import type { Course } from '@/types/api';
import styles from './Hero.module.css';

interface HeroProps {
  courses: Course[];
  psiraFee: number;
}

export function Hero({ courses, psiraFee }: HeroProps) {
  return (
    <>
      <section className={styles.hero}>
        {/* Mobile-only background scrim + badge (components/public/Hero.module.css's max-width: 64rem block). Hidden on desktop, which uses the badge inside .imageWrap instead. */}
        <span className={styles.heroScrim} aria-hidden="true" />
        <div className={styles.mobileImageBadge} aria-hidden="true">
          <ShieldMark />
          <span>
            Liko
            <br />
            Security
            <br />
            Training
          </span>
        </div>

        <div className={`${styles.left} ${styles.heroContent}`}>
          <p className={styles.eyebrow}>
            <BadgeIcon />
            PSIRA-Accredited
          </p>
          <h1>
            PSIRA-accredited
            <br />
            security training
            <br />
            <span className={styles.accent}>in {COMPANY.address.city}</span>
          </h1>
          <p className={styles.lead}>
            Professional security training that equips you with the skills, knowledge and confidence to protect
            what matters most.
          </p>

          <div className={styles.factsRow}>
            <div className={styles.factItem}>
              <span className={styles.factIcon}>
                <ShieldCheckIcon />
              </span>
              <div>
                <p className={styles.factLabel}>PSIRA No.</p>
                <p className={`${styles.factValue} mono`}>{COMPANY.psiraNumber}</p>
              </div>
            </div>
            <div className={styles.factItem}>
              <span className={styles.factIcon}>
                <BuildingIcon />
              </span>
              <div>
                <p className={styles.factLabel}>Centre No.</p>
                <p className={`${styles.factValue} mono`}>{COMPANY.centreNumber}</p>
              </div>
            </div>
            <div className={styles.factItem}>
              <span className={styles.factIcon}>
                <PinIcon />
              </span>
              <div>
                <p className={styles.factLabel}>Address</p>
                <p className={styles.factValue}>
                  {COMPANY.address.line1}, {COMPANY.address.city}
                </p>
              </div>
            </div>
          </div>

          <div className={styles.buttonRow}>
            <Link href="/courses" className={styles.btnPrimary}>
              Explore Courses
              <ArrowIcon />
            </Link>
            {/* Anchors to the existing "Why choose Liko" section further down app/(public)/page.tsx */}
            <Link href="#why-choose" className={styles.btnOutline}>
              <PlayIcon />
              Why Choose Liko
            </Link>
          </div>
        </div>

        {/* Desktop-only image column; hidden below 64rem in favor of .hero's own background-image. */}
        <div className={styles.imageCol}>
          <div className={styles.imageWrap}>
            <span className={styles.imageBacker} aria-hidden="true" />
            {/* Replace public/images/home/hero-officer.jpg with a real photo */}
            <Image
              src="/images/home/hero-image.png"
              alt="Liko Security Training officer on duty"
              width={700}
              height={860}
              className={styles.heroImage}
              priority
            />
            <span className={styles.dotPattern} aria-hidden="true">
              <DotPattern />
            </span>
            <div className={styles.imageBadge} aria-hidden="true">
              <ShieldMark />
              <span>
                Liko
                <br />
                Security
                <br />
                Training
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Desktop-only fee calculator; hidden below 64rem per the mobile hero redesign. */}
      <div className={styles.calculatorWrap}>
        <FeeCalculator courses={courses} psiraFee={psiraFee} />
      </div>

      {/*
        FLAG: static copy straight from the reference image, same caveat as
        the About/Contact pages, no CMS field backs these four blurbs.
        Desktop-only; hidden below 64rem per the mobile hero redesign.
      */}
      <div className={styles.trustBand}>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>
            <ShieldCheckIcon />
          </span>
          <div>
            <strong>PSIRA Accredited</strong>
            <p>Approved and accredited training provider.</p>
          </div>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>
            <CapIcon />
          </span>
          <div>
            <strong>Experienced Instructors</strong>
            <p>Industry professionals with real-world experience.</p>
          </div>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>
            <BookIcon />
          </span>
          <div>
            <strong>Practical Learning</strong>
            <p>Hands-on training that builds real skills.</p>
          </div>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>
            <PersonIcon />
          </span>
          <div>
            <strong>Career Focused</strong>
            <p>Training that opens doors to opportunities.</p>
          </div>
        </div>
      </div>
    </>
  );
}

function BadgeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--liko-gold)" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="9" r="6" />
      <path d="M8.5 14.2L7 22l5-2.6 5 2.6-1.5-7.8" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--liko-navy)" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8.5l6 3.5-6 3.5v-7z" fill="var(--liko-navy)" stroke="none" />
    </svg>
  );
}

/**
 * Small watermark-style badge overlaid on the hero photo (approved hero
 * redesign reference). Own compact shield mark rather than importing
 * SiteHeader's, since that one isn't exported and is tuned for a navy/gold
 * fill against a paper background, not legibility over a variable photo.
 */
function ShieldMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2L4 5v6c0 5.25 3.4 9.7 8 11 4.6-1.3 8-5.75 8-11V5l-8-3z" stroke="var(--liko-paper)" strokeWidth="1.5" />
      <path d="M9 12l2 2 4-4" stroke="var(--liko-paper)" strokeWidth="1.5" />
    </svg>
  );
}

/** Decorative dot grid tiled behind the hero photo's lower corner. */
function DotPattern() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden="true">
      <pattern id="hero-dot-pattern" width="12" height="12" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.5" fill="var(--liko-gold)" fillOpacity="0.35" />
      </pattern>
      <rect width="96" height="96" fill="url(#hero-dot-pattern)" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--liko-navy)" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 2l8 3v6c0 5.2-3.4 9.6-8 11-4.6-1.4-8-5.8-8-11V5z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--liko-navy)" strokeWidth="1.8" aria-hidden="true">
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M8 7h1M15 7h1M8 11h1M15 11h1M8 15h1M15 15h1" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--liko-navy)" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}

function CapIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--liko-navy)" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 3L2 8l10 5 10-5-10-5zM6 10.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--liko-navy)" strokeWidth="1.8" aria-hidden="true">
      <path d="M4 19V6a2 2 0 012-2h5v16H6a2 2 0 01-2-2z" />
      <path d="M20 19V6a2 2 0 00-2-2h-5v16h5a2 2 0 002-2z" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--liko-navy)" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M5 21c0-4 3-6.5 7-6.5s7 2.5 7 6.5" />
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
