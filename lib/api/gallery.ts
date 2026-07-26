import { fetcher } from '@/lib/fetcher';
import type { GalleryItem } from '@/types/api';

export const galleryApi = {
  listPublic: (category?: string) =>
    fetcher.get<GalleryItem[]>(`/gallery${category ? `?category=${encodeURIComponent(category)}` : ''}`),

  // Admin, includes inactive items
  listAdmin: (category?: string) =>
    fetcher.get<GalleryItem[]>(`/admin/gallery${category ? `?category=${encodeURIComponent(category)}` : ''}`),
  getAdmin: (id: string) => fetcher.get<GalleryItem>(`/admin/gallery/${id}`),
  create: (form: FormData) => fetcher.post<GalleryItem>('/admin/gallery', form),
  update: (id: string, form: FormData) => fetcher.put<GalleryItem>(`/admin/gallery/${id}`, form),
  reorder: (id: string, order: number) => fetcher.patch<GalleryItem>(`/admin/gallery/${id}/reorder`, { order }),
  remove: (id: string) => fetcher.delete<void>(`/admin/gallery/${id}`),
};
