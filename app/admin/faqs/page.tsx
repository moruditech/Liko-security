'use client';

import { useEffect, useState } from 'react';
import { faqsApi } from '@/lib/api/faqs';
import { FaqManagementList } from '@/components/admin/FaqManagementList';
import { FaqEditForm } from '@/components/admin/FaqEditForm';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/lib/context/ToastContext';
import { ApiClientError, ApiNetworkError } from '@/lib/fetcher';
import type { Faq } from '@/types/api';
import pageStyles from '../courses/page.module.css';

export default function FaqsAdminPage() {
  const { showToast } = useToast();
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleting, setDeleting] = useState<Faq | null>(null);

  function load() {
    faqsApi
      .listAdmin()
      .then(setFaqs)
      .catch((err) => {
        if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
      });
  }

  useEffect(load, []);

  async function handleSave(input: { question: string; answer: string }, id?: string) {
    try {
      if (id) {
        await faqsApi.update(id, input);
      } else {
        await faqsApi.create({ ...input, order: faqs.length, active: true });
      }
      showToast('FAQ saved.', 'success');
      load();
    } catch (err) {
      if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
      throw err;
    }
  }

  async function handleToggleActive(faq: Faq) {
    try {
      await faqsApi.update(faq.id, { active: !faq.active });
      load();
    } catch (err) {
      if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
    }
  }

  async function handleMove(faq: Faq, direction: 'up' | 'down') {
    const sorted = [...faqs].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((f) => f.id === faq.id);
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    const swapFaq = sorted[swapIndex];
    if (!swapFaq) return;

    try {
      await Promise.all([faqsApi.reorder(faq.id, swapFaq.order), faqsApi.reorder(swapFaq.id, faq.order)]);
      load();
    } catch (err) {
      if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    try {
      await faqsApi.remove(deleting.id);
      showToast('FAQ deleted.', 'success');
      load();
    } catch (err) {
      if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div>
      <h1>FAQs</h1>
      <button
        type="button"
        className={pageStyles.newButton}
        onClick={() => {
          setEditing(null);
          setModalOpen(true);
        }}
      >
        New FAQ
      </button>
      <FaqManagementList
        faqs={faqs}
        onMove={handleMove}
        onEdit={(faq) => {
          setEditing(faq);
          setModalOpen(true);
        }}
        onToggleActive={handleToggleActive}
        onDelete={setDeleting}
      />

      <FaqEditForm faq={editing} open={modalOpen} onSave={handleSave} onClose={() => setModalOpen(false)} />

      <ConfirmDialog
        open={deleting !== null}
        title="Delete this FAQ?"
        description="This cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
