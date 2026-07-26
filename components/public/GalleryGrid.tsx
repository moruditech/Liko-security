'use client';

import Image from 'next/image';
import type { GalleryItem } from '@/types/api';
import styles from './GalleryGrid.module.css';

interface GalleryGridProps {
  items: GalleryItem[];
  onSelect: (item: GalleryItem) => void;
}

export function GalleryGrid({ items, onSelect }: GalleryGridProps) {
  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <button key={item.id} type="button" className={styles.tile} onClick={() => onSelect(item)}>
          <Image
            src={item.imageUrl}
            alt={item.caption ?? ''}
            width={400}
            height={300}
            style={{ objectFit: 'cover' }}
          />
        </button>
      ))}
    </div>
  );
}
