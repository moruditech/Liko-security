'use client';

import { useEffect, useMemo, useState } from 'react';
import { coursesApi } from '@/lib/api/courses';
import { applicationsApi } from '@/lib/api/applications';
import { CourseManagementTable } from '@/components/admin/CourseManagementTable';
import { CourseEditModal } from '@/components/admin/CourseEditModal';
import { CourseStatsRow } from '@/components/admin/CourseStatsRow';
import { CourseFilterBar, type StatusFilter } from '@/components/admin/CourseFilterBar';
import { IntakeManagementTable } from '@/components/admin/IntakeManagementTable';
import { IntakeEditModal } from '@/components/admin/IntakeEditModal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/lib/context/ToastContext';
import { usePermission } from '@/lib/auth/usePermission';
import { ApiClientError, ApiNetworkError } from '@/lib/fetcher';
import type { Course, Intake } from '@/types/api';
import styles from './page.module.css';

type Tab = 'courses' | 'intakes';

const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

export default function CoursesAdminPage() {
  const { showToast } = useToast();
  // Total enrollments needs a separate applications:read permission from
  // the courses:manage permission that gates this whole page, so it's
  // fetched only when the session actually has it (see CourseStatsRow's
  // "—" fallback for sessions that don't).
  const canReadApplications = usePermission('applications:read');

  const [tab, setTab] = useState<Tab>('courses');
  const [courses, setCourses] = useState<Course[]>([]);
  const [intakes, setIntakes] = useState<Intake[]>([]);
  const [totalEnrollments, setTotalEnrollments] = useState<number | null>(null);

  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseModalOpen, setCourseModalOpen] = useState(false);

  const [editingIntake, setEditingIntake] = useState<Intake | null>(null);
  const [intakeModalOpen, setIntakeModalOpen] = useState(false);
  const [deletingIntake, setDeletingIntake] = useState<Intake | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [gradeFilter, setGradeFilter] = useState('all');

  function load() {
    coursesApi
      .listAdmin()
      .then(setCourses)
      .catch((err) => {
        if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
      });
    coursesApi
      .listIntakesAdmin()
      .then(setIntakes)
      .catch((err) => {
        if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
      });
  }

  useEffect(load, []);

  useEffect(() => {
    if (!canReadApplications) return;
    applicationsApi
      .list({ status: 'enrolled', page: 1, limit: 1 })
      .then((res) => setTotalEnrollments(res.total))
      .catch(() => setTotalEnrollments(null));
  }, [canReadApplications]);

  const gradeOptions = useMemo(() => Array.from(new Set(courses.map((c) => c.grade))).sort(), [courses]);

  const filteredCourses = useMemo(() => {
    const q = search.trim().toLowerCase();
    return courses.filter((course) => {
      if (statusFilter === 'active' && !course.isActive) return false;
      if (statusFilter === 'inactive' && course.isActive) return false;
      if (gradeFilter !== 'all' && course.grade !== gradeFilter) return false;
      if (q && !course.title.toLowerCase().includes(q) && !course.grade.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [courses, search, statusFilter, gradeFilter]);

  const activeCoursesCount = useMemo(() => courses.filter((c) => c.isActive).length, [courses]);

  const upcomingIntakesCount = useMemo(() => {
    const now = Date.now();
    return intakes.filter((intake) => {
      const start = new Date(intake.startDate).getTime();
      return start >= now && start <= now + NINETY_DAYS_MS;
    }).length;
  }, [intakes]);

  const hasActiveFilters = search.trim() !== '' || statusFilter !== 'all' || gradeFilter !== 'all';

  function clearFilters() {
    setSearch('');
    setStatusFilter('all');
    setGradeFilter('all');
  }

  async function handleSaveCourse(input: Omit<Course, 'id'>, id?: string) {
    try {
      if (id) {
        await coursesApi.update(id, input);
      } else {
        await coursesApi.create(input);
      }
      showToast('Course saved.', 'success');
      load();
    } catch (err) {
      if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
      throw err;
    }
  }

  async function handleToggleCourseActive(course: Course) {
    try {
      await coursesApi.update(course.id, { isActive: !course.isActive });
      showToast(course.isActive ? 'Course marked inactive.' : 'Course marked active.', 'success');
      load();
    } catch (err) {
      if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
    }
  }

  async function handleDuplicateCourse(course: Course) {
    try {
      await coursesApi.create({
        grade: course.grade,
        title: `${course.title} (Copy)`,
        duration: course.duration,
        fee: course.fee,
        isActive: false,
      });
      showToast('Course duplicated.', 'success');
      load();
    } catch (err) {
      if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
    }
  }

  async function handleSaveIntake(input: Omit<Intake, 'id'>, id?: string) {
    try {
      if (id) {
        await coursesApi.updateIntake(id, input);
      } else {
        await coursesApi.createIntake(input);
      }
      showToast('Intake saved.', 'success');
      load();
    } catch (err) {
      if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
      throw err;
    }
  }

  async function handleDeleteIntake() {
    if (!deletingIntake) return;
    try {
      await coursesApi.deleteIntake(deletingIntake.id);
      showToast('Intake deleted.', 'success');
      load();
    } catch (err) {
      // TAD §12.4: 409 on server-side conflict if applications reference it,
      // surfaced directly, the backend's own message (e.g. naming how many
      // applications reference it) is shown verbatim, never a raw 409 code.
      if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
    } finally {
      setDeletingIntake(null);
    }
  }

  return (
    <div>
      <div className={styles.header}>
        <h1>Courses &amp; Intakes</h1>
        <p className={styles.subtitle}>Manage courses, intakes and training offerings.</p>
      </div>

      <div className={styles.tabsRow}>
        <div className={styles.tabs} role="tablist">
          <button type="button" className={tab === 'courses' ? styles.active : undefined} onClick={() => setTab('courses')}>
            Courses
          </button>
          <button type="button" className={tab === 'intakes' ? styles.active : undefined} onClick={() => setTab('intakes')}>
            Intakes
          </button>
        </div>

        {tab === 'courses' ? (
          <button
            type="button"
            className={styles.newButton}
            onClick={() => {
              setEditingCourse(null);
              setCourseModalOpen(true);
            }}
          >
            <PlusIcon /> New Course
          </button>
        ) : (
          <button
            type="button"
            className={styles.newButton}
            onClick={() => {
              setEditingIntake(null);
              setIntakeModalOpen(true);
            }}
          >
            <PlusIcon /> New Intake
          </button>
        )}
      </div>

      {tab === 'courses' && (
        <>
          <CourseStatsRow
            totalCourses={courses.length}
            activeCourses={activeCoursesCount}
            upcomingIntakes={upcomingIntakesCount}
            totalEnrollments={canReadApplications ? totalEnrollments : null}
          />

          <CourseFilterBar
            search={search}
            onSearchChange={setSearch}
            status={statusFilter}
            onStatusChange={setStatusFilter}
            grade={gradeFilter}
            onGradeChange={setGradeFilter}
            gradeOptions={gradeOptions}
            onClear={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />

          <CourseManagementTable
            courses={filteredCourses}
            onEdit={(course) => {
              setEditingCourse(course);
              setCourseModalOpen(true);
            }}
            onToggleActive={handleToggleCourseActive}
            onDuplicate={handleDuplicateCourse}
          />
        </>
      )}

      {tab === 'intakes' && (
        <IntakeManagementTable
          intakes={intakes}
          onEdit={(intake) => {
            setEditingIntake(intake);
            setIntakeModalOpen(true);
          }}
          onDelete={setDeletingIntake}
        />
      )}

      <CourseEditModal
        course={editingCourse}
        open={courseModalOpen}
        onSave={handleSaveCourse}
        onClose={() => setCourseModalOpen(false)}
      />

      <IntakeEditModal
        intake={editingIntake}
        open={intakeModalOpen}
        onSave={handleSaveIntake}
        onClose={() => setIntakeModalOpen(false)}
      />

      <ConfirmDialog
        open={deletingIntake !== null}
        title="Delete this intake?"
        description="This cannot be undone. If applications already reference this intake, the deletion will be rejected."
        confirmLabel="Delete"
        onConfirm={handleDeleteIntake}
        onCancel={() => setDeletingIntake(null)}
      />
    </div>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
