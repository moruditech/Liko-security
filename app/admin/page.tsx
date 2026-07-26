'use client';

import { useEffect, useState } from 'react';
import { applicationsApi } from '@/lib/api/applications';
import { inquiriesApi } from '@/lib/api/inquiries';
import { StatCard } from '@/components/admin/StatCard';
import { RecentApplicationsList } from '@/components/admin/RecentApplicationsList';
import { RecentInquiriesList } from '@/components/admin/RecentInquiriesList';
import { PermissionGate } from '@/components/admin/PermissionGate';
import { useToast } from '@/lib/context/ToastContext';
import { ApiClientError, ApiNetworkError } from '@/lib/fetcher';
import type { Application, ApplicationStatus, Inquiry } from '@/types/api';
import styles from './page.module.css';

const STATUS_VALUES: ApplicationStatus[] = ['new', 'under_review', 'payment_verified', 'enrolled'];

export default function AdminDashboardPage() {
  const { showToast } = useToast();
  const [statCounts, setStatCounts] = useState<Record<string, number | null>>({});
  const [openInquiryCount, setOpenInquiryCount] = useState<number | null>(null);
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        // TAD §12.1: no dedicated stats endpoint. Counts are derived from
        // `total` on paginated list endpoints, one call per status value
        // with limit=1, confirmed against application.controller.js's list
        // response shape.
        const statResults = await Promise.all(
          STATUS_VALUES.map((status) => applicationsApi.list({ status, page: 1, limit: 1 }))
        );
        if (cancelled) return;
        const counts: Record<string, number> = {};
        STATUS_VALUES.forEach((status, i) => {
          counts[status] = statResults[i]?.total ?? 0;
        });
        setStatCounts(counts);

        const openInquiries = await inquiriesApi.list('open');
        if (cancelled) return;
        setOpenInquiryCount(openInquiries.length);

        const [latestApplications, latestInquiries] = await Promise.all([
          applicationsApi.list({ page: 1, limit: 5 }),
          inquiriesApi.list(),
        ]);
        if (cancelled) return;
        setRecentApplications(latestApplications.items);
        setRecentInquiries(latestInquiries.slice(0, 5));
      } catch (err) {
        if (err instanceof ApiClientError || err instanceof ApiNetworkError) {
          showToast(err.message, 'error');
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [showToast]);

  return (
    <div className={styles.page}>
      <h1>Dashboard</h1>

      <div className={styles.stats}>
        <StatCard label="New" value={statCounts.new ?? null} />
        <StatCard label="Under Review" value={statCounts.under_review ?? null} />
        <PermissionGate permission="invoices:issue">
          <StatCard label="Payment Verified" value={statCounts.payment_verified ?? null} />
        </PermissionGate>
        <StatCard label="Enrolled" value={statCounts.enrolled ?? null} />
        <PermissionGate permission="inquiries:manage">
          <StatCard label="Open Inquiries" value={openInquiryCount} />
        </PermissionGate>
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
