import type { ReactNode } from 'react';
import styles from './ChartPanel.module.css';

interface ChartPanelProps {
  title: string;
  subtitle?: string;
  loading?: boolean;
  empty?: boolean;
  emptyMessage?: string;
  children: ReactNode;
}

export function ChartPanel({ title, subtitle, loading, empty, emptyMessage = 'No data for this period.', children }: ChartPanelProps) {
  return (
    <section className={styles.panel}>
      <h2>{title}</h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      {loading ? (
        <div className={styles.empty}>Loading...</div>
      ) : empty ? (
        <div className={styles.empty}>{emptyMessage}</div>
      ) : (
        <div className={styles.chartWrap}>{children}</div>
      )}
    </section>
  );
}
