import React from 'react';
import Link from 'next/link';
import styles from './SiteFooter.module.css';

export default function SiteFooter() {
  return (
    <footer className={styles.siteFooter}>
      <div className={styles.footerTop}>
        
        {/* Column 1: Brand & Socials */}
        <div className={`${styles.footerCol} ${styles.brandCol}`}>
          <div className={styles.brandLogo}>
            <i className="fa-solid fa-shield-halved"></i>
            <div className={styles.brandText}>
              <h2>Liko</h2>
              <span>Security Training</span>
            </div>
          </div>
          <p className={styles.brandTagline}>
            Empowering professionals.<br />Building safer communities.
          </p>
          <div className={styles.brandSeparator}></div>
          <div className={styles.socialLinks}>
            <Link href="#" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></Link>
            <Link href="#" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></Link>
            <Link href="#" aria-label="LinkedIn"><i className="fa-brands fa-linkedin-in"></i></Link>
            <Link href="#" aria-label="WhatsApp"><i className="fa-brands fa-whatsapp"></i></Link>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className={styles.footerCol}>
          <h3>QUICK LINKS</h3>
          <ul className={styles.linkList}>
            <li><Link href="/about"><i className="fa-solid fa-chevron-right"></i> About Us</Link></li>
            <li><Link href="/courses"><i className="fa-solid fa-chevron-right"></i> Courses</Link></li>
            <li><Link href="/gallery"><i className="fa-solid fa-chevron-right"></i> Gallery</Link></li>
            <li><Link href="/apply"><i className="fa-solid fa-chevron-right"></i> Apply Now</Link></li>
            <li><Link href="/contact"><i className="fa-solid fa-chevron-right"></i> Contact</Link></li>
          </ul>
        </div>

        {/* Column 3: Courses */}
        <div className={styles.footerCol}>
          <h3>COURSES</h3>
          <ul className={styles.linkList}>
            <li><Link href="/courses"><i className="fa-solid fa-chevron-right"></i> PSIRA Grades</Link></li>
            <li><Link href="/courses"><i className="fa-solid fa-chevron-right"></i> Specialized Training</Link></li>
            <li><Link href="/courses"><i className="fa-solid fa-chevron-right"></i> Refresher Training</Link></li>
            <li><Link href="/courses"><i className="fa-solid fa-chevron-right"></i> First Aid</Link></li>
            <li><Link href="/courses"><i className="fa-solid fa-chevron-right"></i> Firearm Training</Link></li>
          </ul>
        </div>

        {/* Column 4: Contact Info */}
        <div className={`${styles.footerCol} ${styles.contactCol}`}>
          <h3>CONTACT</h3>
          <ul className={styles.contactList}>
            <li>
              <i className="fa-solid fa-location-dot"></i>
              <span>KwaMajova, opp. Cashbuild,<br />Mount Frere</span>
            </li>
            <li>
              <i className="fa-solid fa-phone"></i>
              <span>043 645 1234</span>
            </li>
            <li>
              <i className="fa-regular fa-envelope"></i>
              <span>info@likosecurity.co.za</span>
            </li>
            <li>
              <i className="fa-regular fa-clock"></i>
              <span>Mon – Fri: 08:00 – 17:00<br />Sat: 08:00 – 13:00</span>
            </li>
          </ul>
        </div>

        {/* Column 5: Promise Area */}
        <div className={`${styles.footerCol} ${styles.promiseCol}`}>
          <div className={styles.promiseSeparator}>
            <svg width="40" height="100%" preserveAspectRatio="none">
              <path d="M40,0 L10,120 L40,300" fill="none" stroke="#dca842" strokeWidth="1" opacity="0.6"/>
            </svg>
          </div>
          <div className={styles.promiseContent}>
            <div className={styles.promiseIcon}>
              <i className="fa-solid fa-shield"></i>
            </div>
            <p>Safety is not<br />just our training.</p>
            <p className={styles.cursive}>It&apos;s our promise.</p>
          </div>
        </div>

      </div>

      {/* Footer Bottom area with Shield Dip */}
      <div className={styles.footerBottom}>
        <div className={styles.bottomDividerWrapper}>
          <div className={styles.line}></div>
          <div className={styles.dipCenter}>
            <svg className={styles.dipSvg} viewBox="0 0 80 35" preserveAspectRatio="none">
              <path d="M0,0 L20,30 L60,30 L80,0" fill="none" stroke="#dca842" strokeWidth="1.5" />
            </svg>
            <i className={`fa-solid fa-shield ${styles.dipIcon}`}></i>
          </div>
          <div className={styles.line}></div>
        </div>

        <div className={styles.bottomInfo}>
          <p>&copy; {new Date().getFullYear()} Liko Security Training. All rights reserved.</p>
          <div className={styles.legalLinks}>
            <Link href="/terms">Terms & Conditions</Link> <span>|</span> <Link href="/privacy">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
