'use client';

import { useEffect, useState } from 'react';
import { applicationsApi } from '@/lib/api/applications';
import { coursesApi } from '@/lib/api/courses';
import { ApplicationFilterBar, type ApplicationFilters } from '@/components/admin/ApplicationFilterBar';
import { ApplicationsStatsRow } from '@/components/admin/ApplicationsStatsRow';
import { ApplicationsTable } from '@/components/admin/ApplicationsTable';
import { Pagination } from '@/components/admin/Pagination';
import { useToast } from '@/lib/context/ToastContext';
import { ApiClientError, ApiNetworkError } from '@/lib/fetcher';
import type { Application, Course, Intake } from '@/types/api';
import styles from './page.module.css';

const PAGE_SIZE = 20;

export default function ApplicationsListPage() {
  const { showToast } = useToast();
  const [filters, setFilters] = useState<ApplicationFilters>({});
  const [page, setPage] = useState(1);
  const [applications, setApplications] = useState<Application[]>([]);
  const [total, setTotal] = useState(0);
  const [courses, setCourses] = useState<Course[]>([]);
  const [intakes, setIntakes] = useState<Intake[]>([]);

  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [newCount, setNewCount] = useState<number | null>(null);
  const [underReviewCount, setUnderReviewCount] = useState<number | null>(null);
  const [enrolledCount, setEnrolledCount] = useState<number | null>(null);

  // Filter sources, per TAD §12.2
  useEffect(() => {
    Promise.all([coursesApi.listAdmin(), coursesApi.listIntakesAdmin()])
      .then(([c, i]) => {
        setCourses(c);
        setIntakes(i);
      })
      .catch((err) => {
        if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled = false;
    applicationsApi
      .list({ ...filters, page, limit: PAGE_SIZE })
      .then((result) => {
        if (cancelled) return;
        setApplications(result.items);
        setTotal(result.total);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page]);

  // Stats row counts: fetched via the same list endpoint, each with limit:1
  // just to read back `total`, same technique CourseStatsRow uses for
  // totalEnrollments — no dedicated stats endpoint exists on the backend.
  useEffect(() => {
    applicationsApi
      .list({ page: 1, limit: 1 })
      .then((r) => setTotalCount(r.total))
      .catch(() => setTotalCount(null));
    applicationsApi
      .list({ status: 'new', page: 1, limit: 1 })
      .then((r) => setNewCount(r.total))
      .catch(() => setNewCount(null));
    applicationsApi
      .list({ status: 'under_review', page: 1, limit: 1 })
      .then((r) => setUnderReviewCount(r.total))
      .catch(() => setUnderReviewCount(null));
    applicationsApi
      .list({ status: 'enrolled', page: 1, limit: 1 })
      .then((r) => setEnrolledCount(r.total))
      .catch(() => setEnrolledCount(null));
  }, []);

  function handleFiltersChange(next: ApplicationFilters) {
    setFilters(next);
    setPage(1); // reset to first page whenever filters change
  }

  return (
    <div>
      <div className={styles.header}>
        <h1>Applications</h1>
        <p className={styles.subtitle}>Review, process and track training applications.</p>
      </div>

      <ApplicationsStatsRow
        total={totalCount}
        newCount={newCount}
        underReviewCount={underReviewCount}
        enrolledCount={enrolledCount}
      />

      <div className={styles.filterRow}>
        <ApplicationFilterBar filters={filters} onChange={handleFiltersChange} courses={courses} intakes={intakes} />
      </div>

      <ApplicationsTable applications={applications} />
      <Pagination page={page} totalPages={Math.max(1, Math.ceil(total / PAGE_SIZE))} onChange={setPage} />
    </div>
  );
}
