import Link from 'next/link';
import type { Course } from '@/types/api';
import styles from './CoursePreviewGrid.module.css';

/**
 * FLAG: the Course model has no image or description field (confirmed,
 * neither exists in the backend). The approved homepage design shows a
 * photo and a description per card, so these are generic per-grade
 * fallbacks, not real per-course content from the backend. Unknown grade
 * letters fall back to a generic shield icon and description. If the
 * backend later adds real `imageUrl`/`description` fields to Course, this
 * component should switch to using those instead of this static map.
 */
const GRADE_CONTENT: Record<string, { icon: React.ReactNode; description: string }> = {
  E: {
    icon: <ShieldIcon />,
    description: 'The foundation for a career in security. Learn the essential skills and responsibilities.',
  },
  D: {
    icon: <MedicalIcon />,
    description: 'Build on Grade E with expanded knowledge and practical application.',
  },
  C: {
    icon: <FirearmIcon />,
    description: 'Advance your skills and take the next step in your security career.',
  },
  B: {
    icon: <GraduationCapIcon />,
    description: 'Higher level training for those seeking greater responsibility and opportunities.',
  },
};

const DEFAULT_CONTENT = {
  icon: <ShieldIcon />,
  description: 'PSIRA-accredited training designed to build real, job-ready skills.',
};

export function CoursePreviewGrid({ courses }: { courses: Course[] }) {
  const preview = courses.slice(0, 4);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Our Courses</p>
        <h2>PSIRA Security Training Courses</h2>
        <div className={styles.underline} />
        <p className={styles.subtitle}>
          Practical, relevant and accredited training designed to prepare you for a successful career in the
          security industry.
        </p>
      </div>

      {preview.length === 0 ? (
        <div className={styles.empty}>
          <p>Course listings are being finalised. Contact us directly for current grades, fees, and intake dates.</p>
          <Link href="/contact">Contact us</Link>
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            {preview.map((course) => {
              const content = GRADE_CONTENT[course.grade.toUpperCase()] ?? DEFAULT_CONTENT;
              return (
                <div key={course.id} className={styles.card}>
                  <div className={styles.photo}>
                    Photo placeholder
                    <br />
                    <code>course-grade-{course.grade.toLowerCase()}.jpg</code>
                  </div>
                  <div className={styles.iconWrap}>
                    <span className={styles.iconBadge}>{content.icon}</span>
                  </div>
                  <h3>PSIRA Grade {course.grade}</h3>
                  <div className={styles.duration}>
                    <ClockIcon />
                    {course.duration}
                  </div>
                  <p className={styles.desc}>{content.description}</p>
                  <Link href="/courses" className={styles.viewDetails}>
                    View Details <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              );
            })}
          </div>

          <div className={styles.viewAllWrap}>
            <Link href="/courses" className={styles.viewAllBtn}>
              View All Courses <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </>
      )}
    </section>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 2l7 3v6c0 5-3 9.2-7 10-4-.8-7-5-7-10V5z" />
    </svg>
  );
}

function MedicalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="4" y="10" width="16" height="8" rx="2" />
      <path d="M9 10V7a3 3 0 016 0v3M12 13v2" />
    </svg>
  );
}

function FirearmIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M7 9h6M7 13h10" />
    </svg>
  );
}

function GraduationCapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M22 10L12 5 2 10l10 5 10-5zM6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}
