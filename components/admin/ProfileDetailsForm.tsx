'use client';

import { useState } from 'react';
import type { StaffUser } from '@/types/api';
import styles from './ProfileDetailsForm.module.css';

interface ProfileDetailsFormProps {
  profile: StaffUser;
  onSave: (input: { name: string; phone: string; email: string }) => Promise<void>;
}

export function ProfileDetailsForm({ profile, onSave }: ProfileDetailsFormProps) {
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone ?? '');
  const [email, setEmail] = useState(profile.email);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ name, phone, email });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.fieldGrid}>
        <div className={styles.field}>
          <label htmlFor="profileName">Name</label>
          <input id="profileName" required value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className={styles.field}>
          <label htmlFor="profilePhone">Phone</label>
          <input id="profilePhone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>

        <div className={styles.field}>
          <label htmlFor="profileEmail">Email</label>
          <input id="profileEmail" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </div>

      <button type="submit" disabled={saving} className={styles.save}>
        {saving ? 'Saving...' : 'Save changes'}
      </button>
    </form>
  );
}
