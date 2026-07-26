'use client';

import { useEffect, useState } from 'react';
import { rolesApi } from '@/lib/api/roles';
import { RoleManagementTable } from '@/components/admin/RoleManagementTable';
import { RoleEditForm } from '@/components/admin/RoleEditForm';
import { useToast } from '@/lib/context/ToastContext';
import { ApiClientError, ApiNetworkError } from '@/lib/fetcher';
import type { Permission, Role } from '@/types/api';
import pageStyles from '../courses/page.module.css';

export default function RolesAdminPage() {
  const { showToast } = useToast();
  const [roles, setRoles] = useState<Role[]>([]);
  const [editing, setEditing] = useState<Role | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  function load() {
    rolesApi
      .list()
      .then(setRoles)
      .catch((err) => {
        if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
      });
  }

  useEffect(load, []);

  async function handleSave(input: { name: string; permissions: Permission[] }, id?: string) {
    try {
      if (id) {
        // updateRolePermissions validation (role.validation.js) only accepts
        // `permissions`, confirmed, name changes aren't a route the backend exposes.
        await rolesApi.update(id, { permissions: input.permissions });
      } else {
        await rolesApi.create(input);
      }
      showToast('Role saved.', 'success');
      load();
    } catch (err) {
      if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
      throw err;
    }
  }

  return (
    <div>
      <h1>Roles</h1>
      <button
        type="button"
        className={pageStyles.newButton}
        onClick={() => {
          setEditing(null);
          setModalOpen(true);
        }}
      >
        New role
      </button>
      {/* No delete UI anywhere on this page, confirmed, no such backend route exists (TAD §12.13). */}
      <RoleManagementTable roles={roles} onEdit={(r) => { setEditing(r); setModalOpen(true); }} />

      <RoleEditForm role={editing} open={modalOpen} onSave={handleSave} onClose={() => setModalOpen(false)} />
    </div>
  );
}
