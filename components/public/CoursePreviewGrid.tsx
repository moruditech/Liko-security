import Link from 'next/link';
import type { Course } from '@/types/api';
import styles from './CoursePreviewGrid.module.css';

export function CoursePreviewGrid({ courses }: { courses: Course[] }) {
  const preview = courses.slice(0, 4);

  return (
    <section className={styles.section}>
      <h2>Courses</h2>
      <div className={styles.grid}>
        {preview.map((course) => (
          <Link key={course.id} href="/courses" className={styles.card}>
            <div className={styles.titleRow}>
              <span className={styles.badge}>{course.grade}</span>
              <h3>{course.title}</h3>
            </div>
            <p>{course.duration}</p>
            <p className="mono">R{course.fee.toLocaleString('en-ZA')}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
