'use client';

import { useEffect, useState } from 'react';
import { PermissionCheckboxGrid } from './PermissionCheckboxGrid';
import type { Permission, Role } from '@/types/api';
import modalStyles from '../ui/modal.module.css';
import styles from './RoleEditForm.module.css';

interface RoleEditFormProps {
  role: Role | null; // null means "create new"
  open: boolean;
  onSave: (input: { name: string; permissions: Permission[] }, id?: string) => Promise<void>;
  onClose: () => void;
}

export function RoleEditForm({ role, open, onSave, onClose }: RoleEditFormProps) {
  const [name, setName] = useState('');
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(role?.name ?? '');
    setPermissions(role?.permissions ?? []);
  }, [role, open]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ name, permissions }, role?.id);
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

        <h2>{role ? 'Edit role' : 'New role'}</h2>

        <div className={modalStyles.fieldGroup}>
          <label htmlFor="roleName">Role name</label>
          <input
            id="roleName"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={role !== null} // renaming an existing role isn't a route TAD/backend exposes; only permissions are editable
          />
          {role !== null && <p className={modalStyles.hint}>Role names can&apos;t be changed after creation.</p>}
        </div>

        <div className={modalStyles.fieldGroup}>
          <label>Permissions</label>
          <PermissionCheckboxGrid selected={permissions} onChange={setPermissions} />
        </div>

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
