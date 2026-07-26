'use client';

import Link from 'next/link';
import styles from './PopiaConsentCheckbox.module.css';

interface PopiaConsentCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/**
 * TAD §11.5: explicit, unchecked by default, links to /privacy, required
 * before submit is enabled. Submitted as consentGiven: true in the payload;
 * consentGivenAt is set server-side at request time, never client-supplied
 * (confirmed in application.model.js / application.controller.js).
 *
 * One label, no stacked helper/hint text repeating the same thing, per the
 * project's copy rules.
 */
export function PopiaConsentCheckbox({ checked, onChange }: PopiaConsentCheckboxProps) {
  return (
    <label className={styles.row}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} required />
      <span>
        I consent to Liko Security Training collecting and processing my personal information as described in the{' '}
        <Link href="/privacy">Privacy Policy</Link>.
      </span>
    </label>
  );
}
