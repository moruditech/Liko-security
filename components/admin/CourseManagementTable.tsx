import type { Course } from '@/types/api';
import styles from './CourseManagementTable.module.css';

interface CourseManagementTableProps {
  courses: Course[];
  onEdit: (course: Course) => void;
}

export function CourseManagementTable({ courses, onEdit }: CourseManagementTableProps) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Grade</th>
          <th>Title</th>
          <th>Duration</th>
          <th>Fee</th>
          <th>Active</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {courses.map((course) => (
          <tr key={course.id}>
            <td>{course.grade}</td>
            <td>{course.title}</td>
            <td>{course.duration}</td>
            <td className="mono">R{course.fee.toLocaleString('en-ZA')}</td>
            <td>{course.active ? 'Yes' : 'No'}</td>
            <td>
              <button type="button" onClick={() => onEdit(course)}>
                Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
