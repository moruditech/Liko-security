import type { Course, Intake } from '@/types/api';
import styles from './CourseTable.module.css';

interface CourseTableProps {
  courses: Course[];
  intakes: Intake[];
}

export function CourseTable({ courses, intakes }: CourseTableProps) {
  function nextIntakeFor(courseId: string) {
    const forCourse = intakes
      .filter((i) => i.courseId === courseId)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    return forCourse[0];
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Grade</th>
          <th>Duration</th>
          <th>Fee</th>
          <th>Next intake</th>
        </tr>
      </thead>
      <tbody>
        {courses.map((course, i) => {
          const next = nextIntakeFor(course.id);
          return (
            <tr key={course.id} className={i % 2 === 1 ? styles.altRow : undefined}>
              <td>
                Grade {course.grade}: {course.title}
              </td>
              <td>{course.duration}</td>
              <td className="mono">R{course.fee.toLocaleString('en-ZA')}</td>
              <td>{next ? new Date(next.startDate).toLocaleDateString('en-ZA') : 'To be announced'}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
