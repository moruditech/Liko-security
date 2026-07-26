'use client';

import { useMemo, useState } from 'react';
import { CategoryFilter } from '@/components/public/CategoryFilter';
import { ReorderableGrid } from './ReorderableGrid';
import type { GalleryItem } from '@/types/api';
import styles from './GalleryManagementGrid.module.css';

interface GalleryManagementGridProps {
  items: GalleryItem[];
  onMove: (item: GalleryItem, direction: 'up' | 'down') => void;
  onEdit: (item: GalleryItem) => void;
  onDelete: (item: GalleryItem) => void;
}

export function GalleryManagementGrid({ items, onMove, onEdit, onDelete }: GalleryManagementGridProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const categories = useMemo(() => Array.from(new Set(items.map((i) => i.category))), [items]);
  const filtered = activeCategory ? items.filter((i) => i.category === activeCategory) : items;

  return (
    <div className={styles.wrapper}>
      <CategoryFilter categories={categories} active={activeCategory} onChange={setActiveCategory} />
      <ReorderableGrid items={filtered} onMove={onMove} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}
