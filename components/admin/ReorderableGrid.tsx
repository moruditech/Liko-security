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
        <div key={item._id} className={styles.tile}>
          <div className={styles.imageWrap}>
            {item.mediaType === 'video' ? (
              <video src={item.mediaUrl} className={styles.media} muted playsInline />
            ) : (
              <Image src={item.mediaUrl} alt={item.title} fill sizes="(max-width: 768px) 50vw, 220px" style={{ objectFit: 'cover' }} />
            )}
            <span className={`${styles.statusPill} ${item.isActive ? styles.active : styles.inactive}`}>
              {item.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          <div className={styles.meta}>
            <span className={styles.category}>{item.category}</span>
            {item.title && <span className={styles.caption}>{item.title}</span>}
          </div>

          <div className={styles.controls}>
            <button type="button" className={styles.iconButton} onClick={() => onMove(item, 'up')} disabled={i === 0} aria-label="Move up">
              <ArrowUpIcon />
            </button>
            <button
              type="button"
              className={styles.iconButton}
              onClick={() => onMove(item, 'down')}
              disabled={i === sorted.length - 1}
              aria-label="Move down"
            >
              <ArrowDownIcon />
            </button>
            <button type="button" className={styles.textButton} onClick={() => onEdit(item)}>
              Edit
            </button>
            <button type="button" className={styles.deleteButton} onClick={() => onDelete(item)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

function ArrowDownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 5v14M19 12l-7 7-7-7" />
    </svg>
  );
}
