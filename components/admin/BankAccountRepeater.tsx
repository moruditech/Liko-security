'use client';

import type { BankAccount } from '@/types/api';
import styles from './BankAccountRepeater.module.css';

interface BankAccountRepeaterProps {
  accounts: BankAccount[];
  onChange: (accounts: BankAccount[]) => void;
}

const EMPTY_ACCOUNT: BankAccount = { bankName: '', accountName: '', accountNumber: '', branchCode: '' };

export function BankAccountRepeater({ accounts, onChange }: BankAccountRepeaterProps) {
  function update(index: number, field: keyof BankAccount, value: string) {
    const next = [...accounts];
    const existing = next[index];
    if (!existing) return;
    next[index] = { ...existing, [field]: value };
    onChange(next);
  }

  function remove(index: number) {
    onChange(accounts.filter((_, i) => i !== index));
  }

  return (
    <div className={styles.repeater}>
      {accounts.length === 0 && <p className={styles.empty}>No bank accounts added yet.</p>}

      {accounts.map((account, i) => (
        <div key={i} className={styles.row}>
          <div className={styles.field}>
            <label htmlFor={`bankName-${i}`}>Bank name</label>
            <input id={`bankName-${i}`} value={account.bankName} onChange={(e) => update(i, 'bankName', e.target.value)} />
          </div>
          <div className={styles.field}>
            <label htmlFor={`accountName-${i}`}>Account name</label>
            <input
              id={`accountName-${i}`}
              value={account.accountName}
              onChange={(e) => update(i, 'accountName', e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor={`accountNumber-${i}`}>Account number</label>
            <input
              id={`accountNumber-${i}`}
              className="mono"
              value={account.accountNumber}
              onChange={(e) => update(i, 'accountNumber', e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor={`branchCode-${i}`}>Branch code</label>
            <input
              id={`branchCode-${i}`}
              className="mono"
              value={account.branchCode}
              onChange={(e) => update(i, 'branchCode', e.target.value)}
            />
          </div>
          <button type="button" className={styles.removeButton} onClick={() => remove(i)} aria-label="Remove bank account">
            <TrashIcon />
          </button>
        </div>
      ))}

      <button type="button" onClick={() => onChange([...accounts, EMPTY_ACCOUNT])} className={styles.addButton}>
        <PlusIcon /> Add bank account
      </button>
    </div>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 7h16M9 7V4h6v3M6 7l1 13a2 2 0 002 2h6a2 2 0 002-2l1-13" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
