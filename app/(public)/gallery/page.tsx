import type { Metadata } from 'next';
import { Suspense } from 'react';
import { galleryApi } from '@/lib/api/gallery';
import { GalleryClient } from '@/components/public/GalleryClient';
import styles from './page.module.css';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Gallery | Liko Security Training',
  description: 'Photos from Liko Security Training courses, campus, and graduations in Mount Frere.',
};

export default async function GalleryPage() {
  // Same reasoning as the home/courses pages: this runs at BUILD time (SSG).
  const items = await galleryApi.listPublic().catch(() => []);

  return (
    <main className={styles.main}>
      <h1>Gallery</h1>
      <Suspense fallback={null}>
        <GalleryClient items={items} />
      </Suspense>
    </main>
  );
}
