import type { GalleryItem } from '@/types/api';
import styles from './GalleryStatsRow.module.css';

export function GalleryStatsRow({ items }: { items: GalleryItem[] }) {
  const categoryCount = new Set(items.map((i) => i.category)).size;
  const activeCount = items.filter((i) => i.active).length;
  const inactiveCount = items.length - activeCount;

  const stats = [
    {
      key: 'total',
      icon: <ImageIcon />,
      accent: styles.icon_navy,
      label: 'Total items',
      value: items.length,
      caption: 'All uploaded media',
    },
    {
      key: 'categories',
      icon: <TagIcon />,
      accent: styles.icon_gold,
      label: 'Categories',
      value: categoryCount,
      caption: 'Distinct categories',
    },
    {
      key: 'active',
      icon: <EyeIcon />,
      accent: styles.icon_success,
      label: 'Active',
      value: activeCount,
      caption: 'Visible on the public site',
    },
    {
      key: 'inactive',
      icon: <EyeOffIcon />,
      accent: styles.icon_mixed,
      label: 'Inactive',
      value: inactiveCount,
      caption: 'Hidden from the public site',
    },
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
          <div className={styles.caption}>{stat.caption}</div>
        </div>
      ))}
    </div>
  );
}

function ImageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5-11 11" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M20.6 12.9L12.9 20.6a2 2 0 01-2.8 0L3 13.5V4h9.5l7.1 7.1a2 2 0 010 2.8z" />
      <circle cx="7.5" cy="7.5" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M17.9 17.9A10.4 10.4 0 0112 19c-6.5 0-10-7-10-7a18.6 18.6 0 015.1-5.6M9.9 4.2A9.7 9.7 0 0112 4c6.5 0 10 7 10 7a18.4 18.4 0 01-2.2 3.2M14.1 14.1a3 3 0 10-4.2-4.2" />
      <path d="M2 2l20 20" />
    </svg>
  );
}
