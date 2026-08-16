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
        <button key={item._id} type="button" className={styles.tile} onClick={() => onSelect(item)}>
          {item.mediaType === 'video' ? (
            <video src={item.mediaUrl} className={styles.media} muted playsInline />
          ) : (
            <Image src={item.mediaUrl} alt={item.title} width={400} height={300} style={{ objectFit: 'cover' }} />
          )}
        </button>
      ))}
    </div>
  );
}
