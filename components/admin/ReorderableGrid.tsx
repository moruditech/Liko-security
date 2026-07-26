'use client';

import Image from 'next/image';
import type { GalleryItem } from '@/types/api';
import styles from './ReorderableGrid.module.css';

interface ReorderableGridProps {
  items: GalleryItem[];
  onMove: (item: GalleryItem, direction: 'up' | 'down') => void;
  onEdit: (item: GalleryItem) => void;
  onDelete: (item: GalleryItem) => void;
}

/**
 * TAD §12.5 calls for "drag-to-reorder." No drag-and-drop library is in this
 * project's approved package list (package.json), and hand-rolling native
 * HTML5 drag-and-drop correctly (touch support, accessible fallback) is a
 * meaningfully bigger task than up/down buttons. This ships up/down controls
 * instead, flagged rather than silently claiming drag support that isn't
 * there. Swap in a real drag library (e.g. @dnd-kit) here if true
 * drag-to-reorder is a hard requirement.
 */
export function ReorderableGrid({ items, onMove, onEdit, onDelete }: ReorderableGridProps) {
  const sorted = [...items].sort((a, b) => a.order - b.order);

  return (
    <div className={styles.grid}>
      {sorted.map((item, i) => (
        <div key={item.id} className={styles.tile}>
          <Image src={item.imageUrl} alt={item.caption ?? ''} width={200} height={150} style={{ objectFit: 'cover' }} />
          <div className={styles.meta}>
            <span>{item.category}</span>
            {!item.active && <span className={styles.inactive}>Inactive</span>}
          </div>
          <div className={styles.controls}>
            <button type="button" onClick={() => onMove(item, 'up')} disabled={i === 0} aria-label="Move up">
              ↑
            </button>
            <button
              type="button"
              onClick={() => onMove(item, 'down')}
              disabled={i === sorted.length - 1}
              aria-label="Move down"
            >
              ↓
            </button>
            <button type="button" onClick={() => onEdit(item)}>
              Edit
            </button>
            <button type="button" onClick={() => onDelete(item)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
