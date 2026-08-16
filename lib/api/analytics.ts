import { fetcher } from '@/lib/fetcher';
import type { AnalyticsDashboard, AnalyticsPeriod, CapacityAlert } from '@/types/api';

export const analyticsApi = {
  // GET /admin/analytics?period=daily|weekly|monthly, requires applications:read
  // (analytics.routes.js).
  getDashboard: (period: AnalyticsPeriod = 'monthly') =>
    fetcher.get<AnalyticsDashboard>(`/admin/analytics?${new URLSearchParams({ period })}`),

  // GET /admin/analytics/capacity, same permission.
  getCapacityAlerts: () => fetcher.get<CapacityAlert[]>('/admin/analytics/capacity'),
};
