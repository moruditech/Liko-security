import type { Course, Intake } from '@/types/api';
import styles from './IntakeManagementTable.module.css';

interface IntakeManagementTableProps {
  intakes: Intake[];
  courses: Course[];
  onEdit: (intake: Intake) => void;
  onDelete: (intake: Intake) => void;
}

export function IntakeManagementTable({ intakes, courses, onEdit, onDelete }: IntakeManagementTableProps) {
  function courseTitle(courseId: string) {
    const course = courses.find((c) => c.id === courseId);
    return course ? `Grade ${course.grade}: ${course.title}` : 'Unknown course';
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Course</th>
          <th>Start date</th>
          <th>Capacity</th>
          <th>Active</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {intakes.map((intake) => (
          <tr key={intake.id}>
            <td>{courseTitle(intake.courseId)}</td>
            <td>{new Date(intake.startDate).toLocaleDateString('en-ZA')}</td>
            <td>{intake.capacity}</td>
            <td>{intake.active ? 'Yes' : 'No'}</td>
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
