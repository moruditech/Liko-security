import type { Role } from '@/types/api';
import styles from './RoleManagementTable.module.css';

interface RoleManagementTableProps {
  roles: Role[];
  onEdit: (role: Role) => void;
}

export function RoleManagementTable({ roles, onEdit }: RoleManagementTableProps) {
  if (roles.length === 0) {
    return (
      <div className={styles.card}>
        <p className={styles.empty}>No roles yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Role</th>
            <th>Permissions</th>
            <th className={styles.actionsHeader} />
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td className={styles.nameCell}>{role.name}</td>
              <td>
                <div className={styles.tags}>
                  {role.permissions.length === 0 ? (
                    <span className={styles.noneTag}>No permissions</span>
                  ) : (
                    role.permissions.map((p) => (
                      <span key={p} className={`mono ${styles.tag}`}>
                        {p}
                      </span>
                    ))
                  )}
                </div>
              </td>
              <td className={styles.actionsCell}>
                <button type="button" className={styles.textButton} onClick={() => onEdit(role)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
