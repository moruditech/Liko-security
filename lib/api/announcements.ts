import { fetcher } from '@/lib/fetcher';
import type { Announcement } from '@/types/api';

export const announcementsApi = {
  // Public: only currently-live announcements
  listPublic: () => fetcher.get<Announcement[]>('/announcements'),

  // Admin: ALL announcements including scheduled-future and expired,   // a distinct endpoint from the public one, not a query-param variant.
  listAdmin: () => fetcher.get<Announcement[]>('/admin/announcements'),
  getAdmin: (id: string) => fetcher.get<Announcement>(`/admin/announcements/${id}`),
  create: (input: Omit<Announcement, 'id'>) => fetcher.post<Announcement>('/admin/announcements', input),
  replace: (id: string, input: Omit<Announcement, 'id'>) =>
    fetcher.put<Announcement>(`/admin/announcements/${id}`, input),
  update: (id: string, input: Partial<Announcement>) =>
    fetcher.patch<Announcement>(`/admin/announcements/${id}`, input),
  remove: (id: string) => fetcher.delete<void>(`/admin/announcements/${id}`),
};
