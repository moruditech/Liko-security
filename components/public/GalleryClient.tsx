'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CategoryFilter } from './CategoryFilter';
import { GalleryGrid } from './GalleryGrid';
import { Lightbox } from './Lightbox';
import type { GalleryItem } from '@/types/api';

export function GalleryClient({ items }: { items: GalleryItem[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category');
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  const categories = useMemo(() => Array.from(new Set(items.map((i) => i.category))), [items]);

  const filtered = activeCategory ? items.filter((i) => i.category === activeCategory) : items;

  function handleCategoryChange(category: string | null) {
    // Reflected in the URL (not just component state) so each category is a
    // real, linkable, sitemap-able page (TAD §9: "sitemap.ts covers all
    // public routes and gallery categories") rather than invisible client
    // state a search engine or a shared link could never reach.
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    router.replace(`/gallery${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false });
  }

  return (
    <>
      <CategoryFilter categories={categories} active={activeCategory} onChange={handleCategoryChange} />
      <GalleryGrid items={filtered} onSelect={setSelected} />
      {selected && <Lightbox item={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
