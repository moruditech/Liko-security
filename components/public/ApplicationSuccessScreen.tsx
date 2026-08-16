'use client';

import { useEffect, useState } from 'react';
import { settingsApi } from '@/lib/api/settings';
import type { BankAccount } from '@/types/api';
import styles from './ApplicationSuccessScreen.module.css';

interface ApplicationSuccessScreenProps {
  referenceCode: string;
  onClose: () => void;
}

/**
 * TAD §11.5: POST /applications only returns {referenceCode, applicationId}
 * (confirmed in application.controller.js), no total amount, no applicant
 * data. Banking details come from a separate GET /settings call, fetched
 * fresh here rather than reusing the page's initial SSR settings fetch,
 * since bank details could theoretically change between page load and a
 * long-running form fill.
 *
 * Rendered as an overlay on top of the (reset) form rather than replacing
 * it, so closing it leaves a blank form ready for a second submission
 * instead of a dead end.
 */
export function ApplicationSuccessScreen({ referenceCode, onClose }: ApplicationSuccessScreenProps) {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[] | null>(null);

  useEffect(() => {
    settingsApi
      .get()
      .then((s) => setBankAccounts(s.bankAccounts))
      .catch(() => setBankAccounts([]));
  }, []);

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" onClick={onClose}>
      <div className={styles.wrapper} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close">
          <CloseIcon />
        </button>

        <ShieldWatermark />
      <h1>Application received</h1>
      <p>Your reference code is:</p>
      <p className={`${styles.reference} mono`}>{referenceCode}</p>
      <p>Keep this code. You&apos;ll need it for any follow-up with our office.</p>

      {bankAccounts && bankAccounts.length > 0 && (
        <div className={styles.banking}>
          <h2>Payment details</h2>
          {bankAccounts.map((account) => (
            <dl key={account.accountNumber} className={styles.account}>
              <div>
                <dt>Bank</dt>
                <dd>{account.bankName}</dd>
              </div>
              <div>
                <dt>Account name</dt>
                <dd>{account.accountName}</dd>
              </div>
              <div>
                <dt>Account number</dt>
                <dd className="mono">{account.accountNumber}</dd>
              </div>
              <div>
                <dt>Branch code</dt>
                <dd className="mono">{account.branchCode}</dd>
              </div>
            </dl>
          ))}
          <p>Use your reference code above as the payment reference.</p>
        </div>
      )}
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

// DESIGN.md §9: the shield mark reused as a watermark on the confirmation screen.
function ShieldWatermark() {
  return (
    <svg width="80" height="92" viewBox="0 0 28 32" fill="none" aria-hidden="true" className={styles.watermark}>
      <path
        d="M14 1 L26 6 V15 C26 23 20 28 14 31 C8 28 2 23 2 15 V6 Z"
        stroke="var(--liko-navy)"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}
