'use client';

import { useEffect, useRef } from 'react';
import { settingsApi } from '@/lib/api/settings';
import { useState } from 'react';
import type { BankAccount } from '@/types/api';
import styles from './ApplicationSuccessScreen.module.css';

interface ApplicationSuccessScreenProps {
  referenceCode: string;
  onClose: () => void;
}

/**
 * Modal popup shown immediately after a successful application submission.
 * Banking details are fetched fresh from GET /settings rather than reusing
 * the page's SSR snapshot — bank details could change between page load and
 * a long form-fill session.
 *
 * Closes on backdrop click or Escape key. Focus is trapped inside the modal
 * for accessibility.
 */
export function ApplicationSuccessScreen({ referenceCode, onClose }: ApplicationSuccessScreenProps) {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[] | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    settingsApi
      .get()
      .then((s) => setBankAccounts(s.bankAccounts))
      .catch(() => setBankAccounts([]));
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Prevent background scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Focus the modal on mount
  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick} role="dialog" aria-modal="true" aria-labelledby="success-title">
      <div className={styles.modal} ref={modalRef} tabIndex={-1}>

        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">&#x2715;</button>

        <ShieldWatermark />

        <h2 id="success-title" className={styles.title}>Application received!</h2>

        <p className={styles.intro}>
          Your application has been successfully submitted. Check your email — we have sent you a confirmation and your invoice.
        </p>

        <div className={styles.referenceBox}>
          <p className={styles.referenceLabel}>Your reference number</p>
          <p className={`${styles.referenceCode} mono`}>{referenceCode}</p>
          <p className={styles.referenceHint}>Quote this in any correspondence with our office.</p>
        </div>

        {bankAccounts && bankAccounts.length > 0 && (
          <div className={styles.banking}>
            <h3 className={styles.bankingTitle}>Payment details</h3>
            <p className={styles.bankingIntro}>Use EFT to pay — use your reference number above.</p>
            {bankAccounts.map((account) => (
              <dl key={account.accountNumber} className={styles.account}>
                <div><dt>Bank</dt><dd>{account.bankName}</dd></div>
                {account.accountName && <div><dt>Account name</dt><dd>{account.accountName}</dd></div>}
                <div><dt>Account number</dt><dd className="mono">{account.accountNumber}</dd></div>
                <div><dt>Branch code</dt><dd className="mono">{account.branchCode}</dd></div>
              </dl>
            ))}
          </div>
        )}

        <button className={styles.doneBtn} onClick={onClose}>Done</button>

      </div>
    </div>
  );
}

function ShieldWatermark() {
  return (
    <svg width="56" height="64" viewBox="0 0 28 32" fill="none" aria-hidden="true" className={styles.shield}>
      <path
        d="M14 1 L26 6 V15 C26 23 20 28 14 31 C8 28 2 23 2 15 V6 Z"
        stroke="var(--liko-navy)"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}
