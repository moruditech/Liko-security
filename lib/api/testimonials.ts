import { fetcher } from '@/lib/fetcher';
import type { Testimonial } from '@/types/api';

export const testimonialsApi = {
  listPublic: () => fetcher.get<Testimonial[]>('/testimonials'),

  getAdmin: (id: string) => fetcher.get<Testimonial>(`/admin/testimonials/${id}`),
  create: (input: Omit<Testimonial, 'id'>) => fetcher.post<Testimonial>('/admin/testimonials', input),
  replace: (id: string, input: Omit<Testimonial, 'id'>) => fetcher.put<Testimonial>(`/admin/testimonials/${id}`, input),
  update: (id: string, input: Partial<Testimonial>) => fetcher.patch<Testimonial>(`/admin/testimonials/${id}`, input),
  remove: (id: string) => fetcher.delete<void>(`/admin/testimonials/${id}`),
};
