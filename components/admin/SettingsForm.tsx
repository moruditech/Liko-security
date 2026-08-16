'use client';

import { useState } from 'react';
import { BankAccountRepeater } from './BankAccountRepeater';
import { SectionCard } from './SectionCard';
import type { Settings } from '@/types/api';
import styles from './SettingsForm.module.css';

interface SettingsFormProps {
  settings: Settings;
  onSave: (input: Settings) => Promise<void>;
}

export function SettingsForm({ settings, onSave }: SettingsFormProps) {
  const [form, setForm] = useState<Settings>(settings);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <SectionCard icon={<CoinIcon />} accent="navy" title="General">
        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label htmlFor="psiraFee">PSIRA registration fee (ZAR)</label>
            <input
              id="psiraFee"
              type="number"
              min={0}
              required
              value={form.psiraRegistrationFee}
              onChange={(e) => setForm({ ...form, psiraRegistrationFee: Number(e.target.value) })}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="whatsappNumber">WhatsApp number</label>
            <input
              id="whatsappNumber"
              value={form.whatsappNumber}
              onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="contactPhone">Contact phone</label>
            <input
              id="contactPhone"
              value={form.contactPhone}
              onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard icon={<BankIcon />} accent="gold" title="Bank accounts">
        <BankAccountRepeater
          accounts={form.bankAccounts}
          onChange={(accounts) => setForm({ ...form, bankAccounts: accounts })}
        />
      </SectionCard>

      <button type="submit" disabled={saving} className={styles.save}>
        {saving ? 'Saving...' : 'Save settings'}
      </button>
    </form>
  );
}

function CoinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 015 0c0 1.4-1.1 2-2.5 2.5S9.5 12.6 9.5 14a2.5 2.5 0 005 0M12 7v10" />
    </svg>
  );
}

function BankIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 10l9-6 9 6M4 10v9M20 10v9M8 10v9M16 10v9M2 21h20" />
    </svg>
  );
}
