'use client';

import { useEffect, useState } from 'react';
import { testimonialsApi } from '@/lib/api/testimonials';
import { TestimonialsStatsRow } from '@/components/admin/TestimonialsStatsRow';
import { TestimonialManagementList } from '@/components/admin/TestimonialManagementList';
import { TestimonialEditForm } from '@/components/admin/TestimonialEditForm';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/lib/context/ToastContext';
import { ApiClientError, ApiNetworkError } from '@/lib/fetcher';
import type { Testimonial } from '@/types/api';
import pageStyles from '../courses/page.module.css';
import styles from './page.module.css';

export default function TestimonialsAdminPage() {
  const { showToast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleting, setDeleting] = useState<Testimonial | null>(null);

  function load() {
    testimonialsApi
      .listPublic()
      .then(setTestimonials)
      .catch((err) => {
        if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
      });
  }

  useEffect(load, []);

  async function handleSave(form: FormData, id?: string) {
    try {
      // Full-field form maps cleanly to a full replace (PUT) for edits.
      // PATCH remains available in testimonialsApi.update for partial edits
      // elsewhere (e.g. a quick featured-toggle action), not used by this form.
      if (id) {
        await testimonialsApi.replace(id, form);
      } else {
        await testimonialsApi.create(form);
      }
      showToast('Testimonial saved.', 'success');
      load();
    } catch (err) {
      if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
      throw err;
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    try {
      await testimonialsApi.remove(deleting._id);
      showToast('Testimonial deleted.', 'success');
      load();
    } catch (err) {
      if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div>
      <div className={styles.headerRow}>
        <div>
          <h1>Testimonials</h1>
          <p className={styles.subtitle}>Manage learner testimonials shown on the public site.</p>
        </div>
        <button
          type="button"
          className={pageStyles.newButton}
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          <PlusIcon /> New testimonial
        </button>
      </div>

      <TestimonialsStatsRow testimonials={testimonials} />

      <div className={styles.listRow}>
        <TestimonialManagementList
          testimonials={testimonials}
          onEdit={(t) => {
            setEditing(t);
            setModalOpen(true);
          }}
          onDelete={setDeleting}
        />
      </div>

      <TestimonialEditForm testimonial={editing} open={modalOpen} onSave={handleSave} onClose={() => setModalOpen(false)} />

      <ConfirmDialog
        open={deleting !== null}
        title="Delete this testimonial?"
        description="This cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
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
