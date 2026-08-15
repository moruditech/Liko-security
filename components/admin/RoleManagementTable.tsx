import type { Role } from '@/types/api';
import styles from './RoleManagementTable.module.css';

interface RoleManagementTableProps {
  roles: Role[];
  onEdit: (role: Role) => void;
}

export function RoleManagementTable({ roles, onEdit }: RoleManagementTableProps) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Role</th>
          <th>Permissions</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {roles.map((role) => (
          <tr key={role.id}>
            <td>{role.name}</td>
            <td className="mono">{role.permissions.length}</td>
            <td>
              <button type="button" onClick={() => onEdit(role)}>
                Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
