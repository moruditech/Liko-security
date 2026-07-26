import type { MetadataRoute } from 'next';
import { galleryApi } from '@/lib/api/gallery';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://liko-security-training.example';

const STATIC_ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '/', changeFrequency: 'weekly' },
  { path: '/about', changeFrequency: 'monthly' },
  { path: '/courses', changeFrequency: 'daily' },
  { path: '/gallery', changeFrequency: 'weekly' },
  { path: '/apply', changeFrequency: 'monthly' },
  { path: '/contact', changeFrequency: 'monthly' },
  { path: '/terms', changeFrequency: 'yearly' },
  { path: '/privacy', changeFrequency: 'yearly' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    changeFrequency: route.changeFrequency,
    lastModified: new Date(),
  }));

  // TAD §9: "sitemap.ts covers all public routes and gallery categories",   // categories are real URLs since GalleryClient reflects the selected
  // category in ?category=, not invisible client-only state.
  const galleryEntries: MetadataRoute.Sitemap = await galleryApi
    .listPublic()
    .then((items) => {
      const categories = Array.from(new Set(items.map((item) => item.category)));
      return categories.map((category) => ({
        url: `${SITE_URL}/gallery?category=${encodeURIComponent(category)}`,
        changeFrequency: 'weekly' as const,
        lastModified: new Date(),
      }));
    })
    .catch(() => []); // sitemap generation shouldn't fail the build if the backend is briefly unreachable

  return [...staticEntries, ...galleryEntries];
}
