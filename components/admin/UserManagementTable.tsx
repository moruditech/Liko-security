import type { StaffUser } from '@/types/api';
import styles from './CourseManagementTable.module.css';

interface UserManagementTableProps {
  users: StaffUser[];
  onEdit: (user: StaffUser) => void;
  onDeactivate: (user: StaffUser) => void;
}

export function UserManagementTable({ users, onEdit, onDeactivate }: UserManagementTableProps) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Active</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>{user.active ? 'Yes' : 'No'}</td>
            <td>
              <button type="button" onClick={() => onEdit(user)}>
                Edit
              </button>
              {user.active && (
                <button type="button" onClick={() => onDeactivate(user)}>
                  Deactivate
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
