import Link from 'next/link';
import { COMPANY } from '@/lib/constants/company';
import styles from './SiteHeader.module.css';

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand}>
        <ShieldMark />
        <span>{COMPANY.name}</span>
      </Link>

      <nav className={styles.nav} aria-label="Primary">
        <Link href="/about">About</Link>
        <Link href="/courses">Courses</Link>
        <Link href="/gallery">Gallery</Link>
        <Link href="/contact">Contact</Link>
      </nav>

      <Link href="/apply" className={styles.cta}>
        Apply Now
      </Link>
    </header>
  );
}

/**
 * DESIGN.md §9: the shield mark from the flyer, reused as the site's
 * signature element. This is a simplified vector standing in for the real
 * traced mark, swap for an SVG traced directly from the flyer asset before
 * this ships; a from-scratch shield here is a placeholder, not the final
 * brand mark.
 */
function ShieldMark() {
  return (
    <svg width="28" height="32" viewBox="0 0 28 32" fill="none" aria-hidden="true">
      <path
        d="M14 1 L26 6 V15 C26 23 20 28 14 31 C8 28 2 23 2 15 V6 Z"
        stroke="var(--liko-gold)"
        strokeWidth="2"
        fill="var(--liko-navy)"
      />
    </svg>
  );
}
