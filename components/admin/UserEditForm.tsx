'use client';

import { useEffect, useState } from 'react';
import type { Role, StaffUser } from '@/types/api';
import modalStyles from '../ui/modal.module.css';
import styles from './UserEditForm.module.css';

interface UserEditFormProps {
  user: StaffUser | null;
  roles: Role[];
  open: boolean;
  onSave: (input: { name: string; email: string; role: string; password?: string }, id?: string) => Promise<void>;
  onClose: () => void;
}

export function UserEditForm({ user, roles, open, onSave, onClose }: UserEditFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(user?.name ?? '');
    setEmail(user?.email ?? '');
    setRole(user?.role.id ?? roles[0]?.id ?? '');
    setPassword('');
  }, [user, open, roles]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      // updateUser's Joi schema (user.validation.js) has no password field at
      // all — only sent on create, never on edit.
      await onSave(user ? { name, email, role } : { name, email, role, password }, user?.id);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" onClick={onClose}>
      <form className={styles.dialog} onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <button type="button" className={modalStyles.closeButton} onClick={onClose} aria-label="Close">
          <CloseIcon />
        </button>

        <h2>{user ? 'Edit staff member' : 'New staff member'}</h2>

        <div className={modalStyles.fieldGroup}>
          <label htmlFor="userName">Name</label>
          <input id="userName" required value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className={modalStyles.fieldGroup}>
          <label htmlFor="userEmail">Email</label>
          <input id="userEmail" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className={modalStyles.fieldGroup}>
          <label htmlFor="userRole">Role</label>
          <select id="userRole" required value={role} onChange={(e) => setRole(e.target.value)}>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        {!user && (
          <div className={modalStyles.fieldGroup}>
            <label htmlFor="userPassword">Password</label>
            <input
              id="userPassword"
              type="password"
              required
              minLength={10}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className={modalStyles.hint}>At least 10 characters. They can change it after signing in.</p>
          </div>
        )}

        <div className={modalStyles.actions}>
          <button type="button" onClick={onClose} className={modalStyles.cancel}>
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

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
