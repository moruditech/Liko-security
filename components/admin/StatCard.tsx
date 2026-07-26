import styles from './StatCard.module.css';

interface StatCardProps {
  label: string;
  value: number | null;
}

/**
 * DESIGN.md §5.4/§8: plain stat presentation, explicitly NOT the "hero
 * metric" pattern (big number + gradient accent line) the research doc
 * flags as appearing in ~90% of AI-generated dashboards.
 */
export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className={styles.card}>
      <span className={styles.label}>{label}</span>
      <span className={`${styles.value} mono`}>{value === null ? '...' : value}</span>
    </div>
  );
}
