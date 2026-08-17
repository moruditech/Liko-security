import type { StaffUser } from '@/types/api';
import styles from './UserManagementTable.module.css';

interface UserManagementTableProps {
  users: StaffUser[];
  onEdit: (user: StaffUser) => void;
  onDeactivate: (user: StaffUser) => void;
  onReactivate: (user: StaffUser) => void;
}

export function UserManagementTable({ users, onEdit, onDeactivate, onReactivate }: UserManagementTableProps) {
  if (users.length === 0) {
    return (
      <div className={styles.card}>
        <p className={styles.empty}>No staff members yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th className={styles.actionsHeader} />
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className={styles.nameCell}>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <span className={styles.roleTag}>{user.role.name}</span>
              </td>
              <td>
                <span className={`${styles.statusPill} ${user.active ? styles.active : styles.inactive}`}>
                  {user.active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className={styles.actionsCell}>
                <button type="button" className={styles.textButton} onClick={() => onEdit(user)}>
                  Edit
                </button>
                {user.active ? (
                  <button type="button" className={styles.deactivateButton} onClick={() => onDeactivate(user)}>
                    Deactivate
                  </button>
                ) : (
                  <button type="button" className={styles.textButton} onClick={() => onReactivate(user)}>
                    Reactivate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
