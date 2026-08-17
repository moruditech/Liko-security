'use client';

import { useEffect, useState } from 'react';
import { faqsApi } from '@/lib/api/faqs';
import { FaqsStatsRow } from '@/components/admin/FaqsStatsRow';
import { FaqManagementList } from '@/components/admin/FaqManagementList';
import { FaqEditForm } from '@/components/admin/FaqEditForm';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/lib/context/ToastContext';
import { ApiClientError, ApiNetworkError } from '@/lib/fetcher';
import type { Faq } from '@/types/api';
import pageStyles from '../courses/page.module.css';
import styles from './page.module.css';

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
        // createFaq's Joi schema (faq.validation.js) only accepts
        // question/answer — no order/isActive field exists on create at all.
        await faqsApi.create(input);
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
      await faqsApi.update(faq._id, { isActive: !faq.isActive });
      load();
    } catch (err) {
      if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
    }
  }

  async function handleMove(faq: Faq, direction: 'up' | 'down') {
    const sorted = [...faqs].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((f) => f._id === faq._id);
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    const swapFaq = sorted[swapIndex];
    if (!swapFaq) return;

    try {
      await Promise.all([faqsApi.reorder(faq._id, swapFaq.order), faqsApi.reorder(swapFaq._id, faq.order)]);
      load();
    } catch (err) {
      if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    try {
      await faqsApi.remove(deleting._id);
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
      <div className={styles.headerRow}>
        <div>
          <h1>FAQs</h1>
          <p className={styles.subtitle}>Manage frequently asked questions shown on the public site.</p>
        </div>
        <button
          type="button"
          className={pageStyles.newButton}
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          <PlusIcon /> New FAQ
        </button>
      </div>

      <FaqsStatsRow faqs={faqs} />

      <div className={styles.listRow}>
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
      </div>

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

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
