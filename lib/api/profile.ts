import { fetcher } from '@/lib/fetcher';
import type { StaffUser } from '@/types/api';

export const profileApi = {
  get: () => fetcher.get<StaffUser>('/profile'),
  // profile.validation.js's updateProfile deliberately has no `role` key —
  // self-service can never change your own role.
  update: (input: Partial<{ name: string; phone: string; email: string }>) =>
    fetcher.patch<StaffUser>('/profile', input),
  changePassword: (currentPassword: string, newPassword: string) =>
    fetcher.patch<void>('/profile/password', { currentPassword, newPassword }),
};
