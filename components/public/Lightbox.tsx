'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import type { GalleryItem } from '@/types/api';
import styles from './Lightbox.module.css';

export function Lightbox({ item, onClose }: { item: GalleryItem; onClose: () => void }) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        {item.mediaType === 'video' ? (
          <video src={item.mediaUrl} controls autoPlay style={{ width: '100%', height: 'auto' }} />
        ) : (
          <Image src={item.mediaUrl} alt={item.title} width={1200} height={900} style={{ width: '100%', height: 'auto' }} />
        )}
        {item.title && <p>{item.title}</p>}
        <button type="button" onClick={onClose} className={styles.close} aria-label="Close">
          Close
        </button>
      </div>
    </div>
  );
}
