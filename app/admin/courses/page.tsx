'use client';

import { useEffect, useState } from 'react';
import { coursesApi } from '@/lib/api/courses';
import { CourseManagementTable } from '@/components/admin/CourseManagementTable';
import { CourseEditModal } from '@/components/admin/CourseEditModal';
import { IntakeManagementTable } from '@/components/admin/IntakeManagementTable';
import { IntakeEditModal } from '@/components/admin/IntakeEditModal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/lib/context/ToastContext';
import { ApiClientError, ApiNetworkError } from '@/lib/fetcher';
import type { Course, Intake } from '@/types/api';
import styles from './page.module.css';

type Tab = 'courses' | 'intakes';

export default function CoursesAdminPage() {
  const { showToast } = useToast();
  const [tab, setTab] = useState<Tab>('courses');
  const [courses, setCourses] = useState<Course[]>([]);
  const [intakes, setIntakes] = useState<Intake[]>([]);

  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseModalOpen, setCourseModalOpen] = useState(false);

  const [editingIntake, setEditingIntake] = useState<Intake | null>(null);
  const [intakeModalOpen, setIntakeModalOpen] = useState(false);
  const [deletingIntake, setDeletingIntake] = useState<Intake | null>(null);

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
      <h1>Courses &amp; Intakes</h1>

      <div className={styles.tabs} role="tablist">
        <button type="button" className={tab === 'courses' ? styles.active : undefined} onClick={() => setTab('courses')}>
          Courses
        </button>
        <button type="button" className={tab === 'intakes' ? styles.active : undefined} onClick={() => setTab('intakes')}>
          Intakes
        </button>
      </div>

      {tab === 'courses' && (
        <>
          <button
            type="button"
            className={styles.newButton}
            onClick={() => {
              setEditingCourse(null);
              setCourseModalOpen(true);
            }}
          >
            New course
          </button>
          <CourseManagementTable
            courses={courses}
            onEdit={(course) => {
              setEditingCourse(course);
              setCourseModalOpen(true);
            }}
          />
        </>
      )}

      {tab === 'intakes' && (
        <>
          <button
            type="button"
            className={styles.newButton}
            onClick={() => {
              setEditingIntake(null);
              setIntakeModalOpen(true);
            }}
          >
            New intake
          </button>
          <IntakeManagementTable
            intakes={intakes}
            courses={courses}
            onEdit={(intake) => {
              setEditingIntake(intake);
              setIntakeModalOpen(true);
            }}
            onDelete={setDeletingIntake}
          />
        </>
      )}

      <CourseEditModal
        course={editingCourse}
        open={courseModalOpen}
        onSave={handleSaveCourse}
        onClose={() => setCourseModalOpen(false)}
      />

      <IntakeEditModal
        intake={editingIntake}
        courses={courses}
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
