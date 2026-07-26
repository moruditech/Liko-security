import { fetcher } from '@/lib/fetcher';
import type { Settings } from '@/types/api';

export const settingsApi = {
  get: () => fetcher.get<Settings>('/settings'),
  update: (input: Partial<Settings>) => fetcher.patch<Settings>('/admin/settings', input),
};
