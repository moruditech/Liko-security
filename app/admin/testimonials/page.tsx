'use client';

import { useEffect, useState } from 'react';
import { testimonialsApi } from '@/lib/api/testimonials';
import { TestimonialManagementList } from '@/components/admin/TestimonialManagementList';
import { TestimonialEditForm } from '@/components/admin/TestimonialEditForm';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/lib/context/ToastContext';
import { ApiClientError, ApiNetworkError } from '@/lib/fetcher';
import type { Testimonial } from '@/types/api';
import pageStyles from '../courses/page.module.css';

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

  async function handleSave(input: Omit<Testimonial, 'id'>, id?: string) {
    try {
      // Full-field form maps cleanly to a full replace (PUT) for edits.
      // PATCH remains available in testimonialsApi.update for partial edits
      // elsewhere (e.g. a quick featured-toggle action), not used by this form.
      if (id) {
        await testimonialsApi.replace(id, input);
      } else {
        await testimonialsApi.create(input);
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
      await testimonialsApi.remove(deleting.id);
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
      <h1>Testimonials</h1>
      <button
        type="button"
        className={pageStyles.newButton}
        onClick={() => {
          setEditing(null);
          setModalOpen(true);
        }}
      >
        New testimonial
      </button>
      <TestimonialManagementList
        testimonials={testimonials}
        onEdit={(t) => {
          setEditing(t);
          setModalOpen(true);
        }}
        onDelete={setDeleting}
      />

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
