import { fetcher } from '@/lib/fetcher';
import type { Course, Intake } from '@/types/api';

export const coursesApi = {
  listPublic: () => fetcher.get<Course[]>('/courses'),
  listIntakesPublic: () => fetcher.get<Intake[]>('/intakes'),

  // Admin, courses. NOTE: there is no DELETE /admin/courses/:id route in the
  // backend (confirmed in course.routes.js); only create/update exist.
  listAdmin: () => fetcher.get<Course[]>('/admin/courses'),
  getAdmin: (id: string) => fetcher.get<Course>(`/admin/courses/${id}`),
  create: (input: Omit<Course, 'id'>) => fetcher.post<Course>('/admin/courses', input),
  update: (id: string, input: Partial<Course>) => fetcher.patch<Course>(`/admin/courses/${id}`, input),

  // Admin, intakes. Delete exists and returns 409 if applications reference it.
  listIntakesAdmin: () => fetcher.get<Intake[]>('/admin/intakes'),
  getIntakeAdmin: (id: string) => fetcher.get<Intake>(`/admin/intakes/${id}`),
  createIntake: (input: Omit<Intake, 'id'>) => fetcher.post<Intake>('/admin/intakes', input),
  updateIntake: (id: string, input: Partial<Intake>) => fetcher.patch<Intake>(`/admin/intakes/${id}`, input),
  deleteIntake: (id: string) => fetcher.delete<void>(`/admin/intakes/${id}`),
};
