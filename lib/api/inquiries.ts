import { fetcher } from '@/lib/fetcher';
import type { Inquiry } from '@/types/api';

export const inquiriesApi = {
  submit: (input: { name: string; email: string; phone?: string; message: string }) =>
    fetcher.post<{ id: string }>('/inquiries', input),

  // Admin
  list: (status?: 'open' | 'replied') => fetcher.get<Inquiry[]>(`/admin/inquiries${status ? `?status=${status}` : ''}`),
  get: (id: string) => fetcher.get<Inquiry>(`/admin/inquiries/${id}`),
  // Status auto-flips to 'replied' server-side on reply, per TAD §12.8.
  reply: (id: string, body: string) => fetcher.post<Inquiry>(`/admin/inquiries/${id}/reply`, { body }),
};
