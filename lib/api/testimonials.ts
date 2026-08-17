import { fetcher } from '@/lib/fetcher';
import type { Testimonial } from '@/types/api';

export const testimonialsApi = {
  listPublic: () => fetcher.get<Testimonial[]>('/testimonials'),

  getAdmin: (id: string) => fetcher.get<Testimonial>(`/admin/testimonials/${id}`),
  // POST/PUT are multipart (uploadSingle('photo') on both routes, testimonial.routes.js)
  create: (form: FormData) => fetcher.post<Testimonial>('/admin/testimonials', form),
  replace: (id: string, form: FormData) => fetcher.put<Testimonial>(`/admin/testimonials/${id}`, form),
  // PATCH has no upload middleware at all (testimonial.routes.js) — JSON only, no photo swap.
  update: (id: string, input: Partial<Pick<Testimonial, 'studentName' | 'courseGrade' | 'quote' | 'isFeatured'>>) =>
    fetcher.patch<Testimonial>(`/admin/testimonials/${id}`, input),
  remove: (id: string) => fetcher.delete<void>(`/admin/testimonials/${id}`),
};
