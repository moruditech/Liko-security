import type { Course, Intake } from '@/types/api';
import styles from './CourseTable.module.css';

interface CourseTableProps {
  courses: Course[];
  intakes: Intake[];
}

export function CourseTable({ courses, intakes }: CourseTableProps) {
  function nextIntakeFor(grade: string) {
    const forGrade = intakes
      .filter((i) => i.applicableGrades.includes(grade))
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    return forGrade[0];
  }

  return (
    <>
      {/* Desktop table */}
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
            const next = nextIntakeFor(course.grade);
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

      {/* Mobile cards */}
      <div className={styles.cardList}>
        {courses.map((course) => {
          const next = nextIntakeFor(course.grade);
          return (
            <div key={course.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.gradeBadge}>{course.grade}</span>
                <span className={styles.cardTitle}>{course.title}</span>
              </div>
              <hr className={styles.divider} />
              <div className={styles.cardMeta}>
                <div className={styles.metaItem}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.metaIcon} aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span className={styles.metaLabel}>Duration</span>
                  <span className={styles.metaValue}>{course.duration}</span>
                </div>
                <div className={styles.metaItem}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.metaIcon} aria-hidden="true">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                    <line x1="7" y1="7" x2="7.01" y2="7" />
                  </svg>
                  <span className={styles.metaLabel}>Fee</span>
                  <span className={styles.metaValue}>R{course.fee.toLocaleString('en-ZA')}</span>
                </div>
                <div className={styles.metaItem}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.metaIcon} aria-hidden="true">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span className={styles.metaLabel}>Next intake</span>
                  <span className={styles.metaValue}>
                    {next ? new Date(next.startDate).toLocaleDateString('en-ZA') : 'To be announced'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
