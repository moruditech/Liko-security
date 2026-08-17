import { fetcher } from '@/lib/fetcher';
import type { Faq } from '@/types/api';

export const faqsApi = {
  listPublic: () => fetcher.get<Faq[]>('/faqs'),

  listAdmin: () => fetcher.get<Faq[]>('/admin/faqs'), // includes inactive
  getAdmin: (id: string) => fetcher.get<Faq>(`/admin/faqs/${id}`),
  create: (input: { question: string; answer: string }) => fetcher.post<Faq>('/admin/faqs', input),
  replace: (id: string, input: Omit<Faq, '_id'>) => fetcher.put<Faq>(`/admin/faqs/${id}`, input),
  update: (id: string, input: Partial<Pick<Faq, 'question' | 'answer' | 'isActive'>>) =>
    fetcher.patch<Faq>(`/admin/faqs/${id}`, input),
  reorder: (id: string, order: number) => fetcher.patch<Faq>(`/admin/faqs/${id}/reorder`, { order }),
  remove: (id: string) => fetcher.delete<void>(`/admin/faqs/${id}`),
};
