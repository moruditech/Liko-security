import type { Intake } from '@/types/api';
import styles from './IntakeManagementTable.module.css';

interface IntakeManagementTableProps {
  intakes: Intake[];
  onEdit: (intake: Intake) => void;
  onDelete: (intake: Intake) => void;
}

// Intakes reference grades (applicableGrades: string[]), not a specific
// course (intake.model.js has no course field at all) — there was never a
// "course" to look up here, which is why this column always rendered
// "Unknown course" regardless of what was picked in the edit form.
export function IntakeManagementTable({ intakes, onEdit, onDelete }: IntakeManagementTableProps) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Title</th>
          <th>Applicable grades</th>
          <th>Start date</th>
          <th>Capacity</th>
          <th>Active</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {intakes.map((intake) => (
          <tr key={intake.id}>
            <td>{intake.title}</td>
            <td>{intake.applicableGrades.join(', ')}</td>
            <td>{new Date(intake.startDate).toLocaleDateString('en-ZA')}</td>
            <td>{intake.capacity ?? '—'}</td>
            <td>{intake.isActive ? 'Yes' : 'No'}</td>
            <td>
              <button type="button" onClick={() => onEdit(intake)}>
                Edit
              </button>
              <button type="button" onClick={() => onDelete(intake)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
