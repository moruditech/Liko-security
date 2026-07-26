'use client';

import styles from './CategoryFilter.module.css';

interface CategoryFilterProps {
  categories: string[];
  active: string | null;
  onChange: (category: string | null) => void;
}

export function CategoryFilter({ categories, active, onChange }: CategoryFilterProps) {
  return (
    <div className={styles.tabs} role="tablist">
      <button type="button" className={active === null ? styles.active : undefined} onClick={() => onChange(null)}>
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={active === category ? styles.active : undefined}
          onClick={() => onChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
