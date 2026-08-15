import type { ReactNode } from 'react';
import styles from './SectionCard.module.css';

type SectionAccent = 'navy' | 'gold' | 'success' | 'mixed';

interface SectionCardProps {
  icon: ReactNode;
  accent: SectionAccent;
  title: string;
  action?: ReactNode;
  children: ReactNode;
}

/**
 * Shared card chrome for the application detail page's sections (applicant
 * details, invoices, status history), mirroring the icon-badge language
 * already established by CourseStatsRow/CourseManagementTable on the
 * courses admin page, so the two admin pages read as one system.
 */
export function SectionCard({ icon, accent, title, action, children }: SectionCardProps) {
  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={`${styles.icon} ${styles[`icon_${accent}`]}`}>{icon}</span>
          <h2 className={styles.title}>{title}</h2>
        </div>
        {action}
      </div>
      <div className={styles.body}>{children}</div>
    </section>
  );
}
