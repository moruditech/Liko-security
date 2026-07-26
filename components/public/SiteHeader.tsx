'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { settingsApi } from '@/lib/api/settings';
import { COMPANY } from '@/lib/constants/company';
import styles from './SiteHeader.module.css';

const NAV_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/courses', label: 'Courses' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState<string | undefined>(undefined);

  // Fetched client-side, self-contained, just for the WhatsApp social icon,
  // rather than threading a prop through the layout for one field.
  useEffect(() => {
    settingsApi
      .get()
      .then((s) => setWhatsappNumber(s.whatsappNumber))
      .catch(() => setWhatsappNumber(undefined));
  }, []);

  // Close on Escape, and close whenever the route actually changes (a link
  // was followed), rather than leaving the drawer open behind the new page.
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}` : undefined;

  return (
    <header className={styles.header}>
      <nav className={styles.navbar} aria-label="Primary">
        <Link href="/" className={styles.brand}>
          <ShieldMark />
          <div className={styles.brandText}>
            <span className={styles.brandName}>{COMPANY.name}</span>
            <span className={styles.tagline}>{COMPANY.tagline}</span>
          </div>
        </Link>

        <div className={styles.navLinks}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? styles.navLinkActive : styles.navLink}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className={styles.rightSide}>
          <span className={styles.divider} aria-hidden="true" />
          <Link href="/apply" className={styles.applyBtn}>
            Apply Now <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        <button
          type="button"
          className={styles.hamburger}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-panel"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <div id="mobile-nav-panel" className={`${styles.mobilePanel} ${menuOpen ? styles.mobilePanelOpen : ''}`}>
        <div className={styles.mobileMenuList}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? styles.mobileMenuItemActive : styles.mobileMenuItem}
            >
              <NavIcon label={link.label} />
              {link.label}
            </Link>
          ))}
        </div>

        <div className={styles.mobileApplyWrap}>
          <Link href="/apply" className={styles.mobileApplyBtn}>
            Apply Now <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {(COMPANY.socialLinks.facebook || COMPANY.socialLinks.instagram || COMPANY.socialLinks.linkedin || whatsappHref) && (
          <div className={styles.socialRow}>
            {COMPANY.socialLinks.facebook && (
              <a href={COMPANY.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className={styles.socialCircle} aria-label="Facebook">
                <FacebookIcon />
              </a>
            )}
            {COMPANY.socialLinks.instagram && (
              <a href={COMPANY.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className={styles.socialCircle} aria-label="Instagram">
                <InstagramIcon />
              </a>
            )}
            {COMPANY.socialLinks.linkedin && (
              <a href={COMPANY.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialCircle} aria-label="LinkedIn">
                <LinkedinIcon />
              </a>
            )}
            {whatsappHref && (
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={styles.socialCircle} aria-label="WhatsApp">
                <WhatsAppIcon />
              </a>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

/**
 * DESIGN.md §9 signature element, the shield mark, redrawn from the design
 * provided (rounder silhouette than the earlier placeholder). Still a
 * stand-in for a version traced directly from the real flyer asset.
 */
function ShieldMark() {
  return (
    <svg className={styles.shieldIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2L4 5v6c0 5.25 3.4 9.7 8 11 4.6-1.3 8-5.75 8-11V5l-8-3z"
        fill="var(--liko-navy)"
        stroke="var(--liko-gold)"
        strokeWidth="1"
      />
    </svg>
  );
}

function NavIcon({ label }: { label: string }) {
  switch (label) {
    case 'About':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--liko-navy)" strokeWidth="2" aria-hidden="true">
          <path d="M3 12l9-9 9 9M5 10v10h14V10" />
        </svg>
      );
    case 'Courses':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--liko-navy)" strokeWidth="2" aria-hidden="true">
          <path d="M12 3L2 8l10 5 10-5-10-5zM6 10.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5" />
        </svg>
      );
    case 'Gallery':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--liko-navy)" strokeWidth="2" aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="9" cy="10" r="1.5" />
          <path d="M21 16l-6-5-4 4-2-2-6 5" />
        </svg>
      );
    case 'Contact':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--liko-navy)" strokeWidth="2" aria-hidden="true">
          <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.7A2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.7a2 2 0 01-.4 2.1L8 9.9a16 16 0 006 6l1.4-1.3a2 2 0 012.1-.4c.9.3 1.8.5 2.7.6a2 2 0 011.8 2.1z" />
        </svg>
      );
    default:
      return null;
  }
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13 22v-9h3l.5-4H13V6.5c0-1.2.3-2 2-2h2V1c-.3 0-1.4-.1-2.7-.1-2.7 0-4.3 1.5-4.3 4.4V9H7v4h3v9z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5C4.98 4.9 3.9 6 2.5 6S0 4.9 0 3.5 1.1 1 2.5 1s2.48 1.1 2.48 2.5zM.2 8.4h4.6V23H.2V8.4zM8.4 8.4H12.8v2h.06c.6-1.1 2.1-2.3 4.3-2.3 4.6 0 5.4 3 5.4 6.9V23h-4.6v-6.7c0-1.6 0-3.7-2.3-3.7s-2.6 1.8-2.6 3.6V23H8.4V8.4z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 00-8.5 15.2L2 22l4.9-1.5A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-2.9.9.9-2.8-.2-.3A8 8 0 1112 20zm4.4-6c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.7.9-.3.1-.5 0a6.6 6.6 0 01-2-1.2 7.3 7.3 0 01-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.4.2-.4v-.4c-.1-.1-.5-1.3-.7-1.7s-.4-.4-.5-.4h-.5a.9.9 0 00-.7.3 2.9 2.9 0 00-.9 2.1 5 5 0 001 2.6 11.5 11.5 0 004.5 4c.6.3 1.1.4 1.5.6a3.6 3.6 0 001.6.1 2.7 2.7 0 001.7-1.2 2.1 2.1 0 00.1-1.2c-.1-.1-.2-.2-.5-.3z" />
    </svg>
  );
}
