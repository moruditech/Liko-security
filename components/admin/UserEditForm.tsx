'use client';

import { useEffect, useState } from 'react';
import type { Role, StaffUser } from '@/types/api';
import styles from './UserEditForm.module.css';

interface UserEditFormProps {
  user: StaffUser | null;
  roles: Role[];
  open: boolean;
  onSave: (input: { name: string; email: string; role: string }, id?: string) => Promise<void>;
  onClose: () => void;
}

export function UserEditForm({ user, roles, open, onSave, onClose }: UserEditFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(user?.name ?? '');
    setEmail(user?.email ?? '');
    setRole(user?.role ?? roles[0]?.name ?? '');
  }, [user, open, roles]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ name, email, role }, user?.id);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" onClick={onClose}>
      <form className={styles.dialog} onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h2>{user ? 'Edit staff member' : 'New staff member'}</h2>

        <label htmlFor="userName">Name</label>
        <input id="userName" required value={name} onChange={(e) => setName(e.target.value)} />

        <label htmlFor="userEmail">Email</label>
        <input id="userEmail" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor="userRole">Role</label>
        <select id="userRole" required value={role} onChange={(e) => setRole(e.target.value)}>
          {roles.map((r) => (
            <option key={r.id} value={r.name}>
              {r.name}
            </option>
          ))}
        </select>

        <div className={styles.actions}>
          <button type="button" onClick={onClose} className={styles.cancel}>
            Cancel
          </button>
          <button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
