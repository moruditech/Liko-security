import { fetcher } from '@/lib/fetcher';
import type { StaffUser } from '@/types/api';

export const usersApi = {
  list: () => fetcher.get<StaffUser[]>('/users'),
  get: (id: string) => fetcher.get<StaffUser>(`/users/${id}`),
  // password required on create — createUser's Joi schema (user.validation.js)
  // has no default and no separate invite/set-password flow exists.
  create: (input: { name: string; email: string; role: string; password: string }) =>
    fetcher.post<StaffUser>('/users', input),
  // updateUser's schema has no password field at all — never sent on edit.
  update: (id: string, input: Partial<{ name: string; email: string; role: string }>) =>
    fetcher.patch<StaffUser>(`/users/${id}`, input),
  // No DELETE /users/:id route exists in the backend, deactivate is the only removal path.
  deactivate: (id: string) => fetcher.patch<StaffUser>(`/users/${id}/deactivate`, {}),
  reactivate: (id: string) => fetcher.patch<StaffUser>(`/users/${id}/reactivate`, {}),
};
