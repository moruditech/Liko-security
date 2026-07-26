'use client';

import { useEffect, useState } from 'react';
import { applicationsApi } from '@/lib/api/applications';
import { coursesApi } from '@/lib/api/courses';
import { ApplicationFilterBar, type ApplicationFilters } from '@/components/admin/ApplicationFilterBar';
import { ApplicationsTable } from '@/components/admin/ApplicationsTable';
import { Pagination } from '@/components/admin/Pagination';
import { useToast } from '@/lib/context/ToastContext';
import { ApiClientError, ApiNetworkError } from '@/lib/fetcher';
import type { Application, Course, Intake } from '@/types/api';

const PAGE_SIZE = 20;

export default function ApplicationsListPage() {
  const { showToast } = useToast();
  const [filters, setFilters] = useState<ApplicationFilters>({});
  const [page, setPage] = useState(1);
  const [applications, setApplications] = useState<Application[]>([]);
  const [total, setTotal] = useState(0);
  const [courses, setCourses] = useState<Course[]>([]);
  const [intakes, setIntakes] = useState<Intake[]>([]);

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

  function handleFiltersChange(next: ApplicationFilters) {
    setFilters(next);
    setPage(1); // reset to first page whenever filters change
  }

  return (
    <div>
      <h1>Applications</h1>
      <ApplicationFilterBar filters={filters} onChange={handleFiltersChange} courses={courses} intakes={intakes} />
      <ApplicationsTable applications={applications} />
      <Pagination page={page} totalPages={Math.max(1, Math.ceil(total / PAGE_SIZE))} onChange={setPage} />
    </div>
  );
}
