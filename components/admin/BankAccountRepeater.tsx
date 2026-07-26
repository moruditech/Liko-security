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
      {accounts.map((account, i) => (
        <div key={i} className={styles.row}>
          <input placeholder="Bank name" value={account.bankName} onChange={(e) => update(i, 'bankName', e.target.value)} />
          <input
            placeholder="Account name"
            value={account.accountName}
            onChange={(e) => update(i, 'accountName', e.target.value)}
          />
          <input
            placeholder="Account number"
            value={account.accountNumber}
            onChange={(e) => update(i, 'accountNumber', e.target.value)}
          />
          <input
            placeholder="Branch code"
            value={account.branchCode}
            onChange={(e) => update(i, 'branchCode', e.target.value)}
          />
          <button type="button" onClick={() => remove(i)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...accounts, EMPTY_ACCOUNT])} className={styles.addButton}>
        Add bank account
      </button>
    </div>
  );
}
