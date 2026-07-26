import { fetcher } from '@/lib/fetcher';
import type { StaffUser } from '@/types/api';

export const usersApi = {
  list: () => fetcher.get<StaffUser[]>('/users'),
  get: (id: string) => fetcher.get<StaffUser>(`/users/${id}`),
  create: (input: { name: string; email: string; role: string }) => fetcher.post<StaffUser>('/users', input),
  update: (id: string, input: Partial<Pick<StaffUser, 'name' | 'email' | 'role'>>) =>
    fetcher.patch<StaffUser>(`/users/${id}`, input),
  // No DELETE /users/:id route exists in the backend, deactivate is the only removal path.
  deactivate: (id: string) => fetcher.patch<StaffUser>(`/users/${id}/deactivate`, {}),
};
