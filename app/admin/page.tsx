'use client';

import { useEffect, useState } from 'react';
import { analyticsApi } from '@/lib/api/analytics';
import { applicationsApi } from '@/lib/api/applications';
import { inquiriesApi } from '@/lib/api/inquiries';
import { DashboardMetricsRow } from '@/components/admin/DashboardMetricsRow';
import { CapacityAlertsPanel } from '@/components/admin/CapacityAlertsPanel';
import { ApplicationsTrendChart } from '@/components/admin/ApplicationsTrendChart';
import { RevenueTrendChart } from '@/components/admin/RevenueTrendChart';
import { ApplicationsByStatusChart } from '@/components/admin/ApplicationsByStatusChart';
import { ApplicationsByGradeChart } from '@/components/admin/ApplicationsByGradeChart';
import { GradeStatusMatrixChart } from '@/components/admin/GradeStatusMatrixChart';
import { HorizontalBarChartPanel } from '@/components/admin/HorizontalBarChartPanel';
import { TrendLineChartPanel } from '@/components/admin/TrendLineChartPanel';
import { RecentApplicationsList } from '@/components/admin/RecentApplicationsList';
import { RecentInquiriesList } from '@/components/admin/RecentInquiriesList';
import { PermissionGate } from '@/components/admin/PermissionGate';
import { useToast } from '@/lib/context/ToastContext';
import { ApiClientError, ApiNetworkError } from '@/lib/fetcher';
import type { AnalyticsDashboard, AnalyticsPeriod, Application, CapacityAlert, Inquiry } from '@/types/api';
import styles from './page.module.css';

const PERIODS: { value: AnalyticsPeriod; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

export default function AdminDashboardPage() {
  const { showToast } = useToast();
  const [period, setPeriod] = useState<AnalyticsPeriod>('monthly');
  const [dashboard, setDashboard] = useState<AnalyticsDashboard | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [alerts, setAlerts] = useState<CapacityAlert[]>([]);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    let cancelled = false;
    setDashboardLoading(true);
    analyticsApi
      .getDashboard(period)
      .then((data) => {
        if (!cancelled) setDashboard(data);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
      })
      .finally(() => {
        if (!cancelled) setDashboardLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  useEffect(() => {
    let cancelled = false;
    analyticsApi
      .getCapacityAlerts()
      .then((data) => {
        if (!cancelled) setAlerts(data);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
      })
      .finally(() => {
        if (!cancelled) setAlertsLoading(false);
      });

    Promise.all([applicationsApi.list({ page: 1, limit: 5 }), inquiriesApi.list()])
      .then(([latestApplications, latestInquiries]) => {
        if (cancelled) return;
        setRecentApplications(latestApplications.items);
        setRecentInquiries(latestInquiries.items.slice(0, 5));
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applicationsByProvince = (dashboard?.pies.applicationsByProvince ?? []).map((p) => ({ name: p.province, count: p.count }));
  const auditByCategory = (dashboard?.pies.auditByCategory ?? []).map((c) => ({ name: c.category, count: c.count }));
  const inquiryResponseData = (dashboard?.lines.inquiryResponseTimeTrend ?? []).map((p) => ({ date: p.date, avgHours: p.avgHours }));
  const failedLoginsData = (dashboard?.lines.failedLogins ?? []).map((p) => ({ date: p.date, count: p.count }));

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerRow}>
          <div>
            <h1>Dashboard</h1>
            <p className={styles.subtitle}>Overview of applications, enrollments and system activity.</p>
          </div>
          <div className={styles.periodSwitch} role="tablist" aria-label="Chart time period">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                type="button"
                className={p.value === period ? styles.active : undefined}
                onClick={() => setPeriod(p.value)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <DashboardMetricsRow metrics={dashboard?.metrics ?? null} />

      <CapacityAlertsPanel alerts={alerts} loading={alertsLoading} />

      <div className={styles.row2}>
        <ApplicationsTrendChart
          applications={dashboard?.lines.applications ?? []}
          enrollments={dashboard?.lines.enrollments ?? []}
          loading={dashboardLoading}
        />
        <RevenueTrendChart revenue={dashboard?.lines.revenue ?? []} loading={dashboardLoading} />
      </div>

      <div className={styles.row2}>
        <ApplicationsByStatusChart data={dashboard?.pies.applicationsByStatus ?? []} loading={dashboardLoading} />
        <ApplicationsByGradeChart data={dashboard?.pies.applicationsByGrade ?? []} loading={dashboardLoading} />
      </div>

      <GradeStatusMatrixChart matrix={dashboard?.gradeStatusMatrix ?? {}} loading={dashboardLoading} />

      <div className={styles.row2}>
        <HorizontalBarChartPanel
          title="Applications by province"
          subtitle="Applicant address province, where captured"
          data={applicationsByProvince}
          loading={dashboardLoading}
        />
        <HorizontalBarChartPanel
          title="Audit activity by category"
          subtitle="System actions logged, grouped by area"
          data={auditByCategory}
          loading={dashboardLoading}
        />
      </div>

      <div className={styles.row2}>
        <TrendLineChartPanel
          title="Inquiry response time"
          subtitle="Average hours to first reply"
          data={inquiryResponseData}
          dataKey="avgHours"
          color="var(--liko-gold)"
          valueFormatter={(v) => `${v}h`}
          loading={dashboardLoading}
        />
        <TrendLineChartPanel
          title="Failed logins"
          subtitle="Failed authentication attempts, over time"
          data={failedLoginsData}
          dataKey="count"
          color="var(--liko-error)"
          loading={dashboardLoading}
        />
      </div>

      <div className={styles.recent}>
        <PermissionGate permission="applications:read">
          <section>
            <h2>Recent applications</h2>
            <RecentApplicationsList applications={recentApplications} />
          </section>
        </PermissionGate>
        <PermissionGate permission="inquiries:manage">
          <section>
            <h2>Recent inquiries</h2>
            <RecentInquiriesList inquiries={recentInquiries} />
          </section>
        </PermissionGate>
      </div>
    </div>
  );
}
