'use client';

import { useState } from 'react';
import { BankAccountRepeater } from './BankAccountRepeater';
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
      <label htmlFor="psiraFee">PSIRA registration fee (ZAR)</label>
      <input
        id="psiraFee"
        type="number"
        min={0}
        required
        value={form.psiraFee}
        onChange={(e) => setForm({ ...form, psiraFee: Number(e.target.value) })}
      />

      <label htmlFor="whatsappNumber">WhatsApp number</label>
      <input
        id="whatsappNumber"
        value={form.whatsappNumber}
        onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
      />

      <label htmlFor="contactPhone">Contact phone</label>
      <input
        id="contactPhone"
        value={form.contactPhone}
        onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
      />

      <h2>Bank accounts</h2>
      <BankAccountRepeater
        accounts={form.bankAccounts}
        onChange={(accounts) => setForm({ ...form, bankAccounts: accounts })}
      />

      <button type="submit" disabled={saving} className={styles.save}>
        {saving ? 'Saving...' : 'Save settings'}
      </button>
    </form>
  );
}
