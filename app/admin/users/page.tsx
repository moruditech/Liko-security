'use client';

import { useEffect, useState } from 'react';
import { usersApi } from '@/lib/api/users';
import { rolesApi } from '@/lib/api/roles';
import { UserManagementTable } from '@/components/admin/UserManagementTable';
import { UserEditForm } from '@/components/admin/UserEditForm';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/lib/context/ToastContext';
import { ApiClientError, ApiNetworkError } from '@/lib/fetcher';
import type { Role, StaffUser } from '@/types/api';
import pageStyles from '../courses/page.module.css';

export default function UsersAdminPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [editing, setEditing] = useState<StaffUser | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deactivating, setDeactivating] = useState<StaffUser | null>(null);

  function load() {
    usersApi
      .list()
      .then(setUsers)
      .catch((err) => {
        if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
      });
  }

  useEffect(() => {
    load();
    rolesApi.list().then(setRoles).catch(() => setRoles([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSave(input: { name: string; email: string; role: string }, id?: string) {
    try {
      if (id) {
        await usersApi.update(id, input);
      } else {
        await usersApi.create(input);
      }
      showToast('Staff member saved.', 'success');
      load();
    } catch (err) {
      if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
      throw err;
    }
  }

  async function handleDeactivate() {
    if (!deactivating) return;
    try {
      // No hard delete route exists for users, confirmed, deactivate is the
      // only removal path (TAD §12.12).
      await usersApi.deactivate(deactivating.id);
      showToast('Staff member deactivated.', 'success');
      load();
    } catch (err) {
      if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
    } finally {
      setDeactivating(null);
    }
  }

  return (
    <div>
      <h1>Users</h1>
      <button
        type="button"
        className={pageStyles.newButton}
        onClick={() => {
          setEditing(null);
          setModalOpen(true);
        }}
      >
        New staff member
      </button>
      <UserManagementTable users={users} onEdit={(u) => { setEditing(u); setModalOpen(true); }} onDeactivate={setDeactivating} />

      <UserEditForm user={editing} roles={roles} open={modalOpen} onSave={handleSave} onClose={() => setModalOpen(false)} />

      <ConfirmDialog
        open={deactivating !== null}
        title="Deactivate this staff member?"
        description="They will no longer be able to sign in. This does not delete their account or history."
        confirmLabel="Deactivate"
        onConfirm={handleDeactivate}
        onCancel={() => setDeactivating(null)}
      />
    </div>
  );
}
