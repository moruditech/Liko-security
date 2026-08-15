import type { Testimonial } from '@/types/api';
import styles from './TestimonialsStatsRow.module.css';

export function TestimonialsStatsRow({ testimonials }: { testimonials: Testimonial[] }) {
  const featuredCount = testimonials.filter((t) => t.featured).length;
  const gradeCount = new Set(testimonials.map((t) => t.grade)).size;

  const stats = [
    { key: 'total', icon: <QuoteIcon />, accent: styles.icon_navy, label: 'Total testimonials', value: testimonials.length },
    { key: 'featured', icon: <StarIcon />, accent: styles.icon_gold, label: 'Featured', value: featuredCount },
    { key: 'notFeatured', icon: <StarOffIcon />, accent: styles.icon_mixed, label: 'Not featured', value: testimonials.length - featuredCount },
    { key: 'grades', icon: <GraduationIcon />, accent: styles.icon_success, label: 'Grades represented', value: gradeCount },
  ];

  return (
    <div className={styles.grid}>
      {stats.map((stat) => (
        <div key={stat.key} className={styles.card}>
          <div className={styles.iconRow}>
            <span className={`${styles.icon} ${stat.accent}`}>{stat.icon}</span>
            <span className={styles.label}>{stat.label}</span>
          </div>
          <div className={styles.value}>{stat.value.toLocaleString('en-ZA')}</div>
        </div>
      ))}
    </div>
  );
}

function QuoteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M7 8a3 3 0 00-3 3v5h5v-5H6a3 3 0 011-2.2M17 8a3 3 0 00-3 3v5h5v-5h-3a3 3 0 011-2.2" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 2l3.1 6.3 7 1-5 4.9 1.2 7-6.3-3.3-6.3 3.3 1.2-7-5-4.9 7-1L12 2z" />
    </svg>
  );
}

function StarOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 2l3.1 6.3 7 1-5 4.9 1.2 7-6.3-3.3-6.3 3.3 1.2-7-5-4.9 7-1L12 2z" />
      <path d="M2 2l20 20" />
    </svg>
  );
}

function GraduationIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M22 10L12 5 2 10l10 5 10-5z" />
      <path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
    </svg>
  );
}
