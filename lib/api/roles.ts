import { fetcher } from '@/lib/fetcher';
import type { Permission, Role } from '@/types/api';

export const rolesApi = {
  list: () => fetcher.get<Role[]>('/roles'),
  get: (id: string) => fetcher.get<Role>(`/roles/${id}`),
  create: (input: { name: string; permissions: Permission[] }) => fetcher.post<Role>('/roles', input),
  // No DELETE /roles/:id route exists in the backend, confirmed, no delete UI should be built.
  update: (id: string, input: { permissions: Permission[] }) => fetcher.patch<Role>(`/roles/${id}`, input),
};
