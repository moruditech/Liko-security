'use client';

import { useEffect, useState } from 'react';
import { announcementsApi } from '@/lib/api/announcements';
import { AnnouncementsStatsRow } from '@/components/admin/AnnouncementsStatsRow';
import { AnnouncementList } from '@/components/admin/AnnouncementList';
import { AnnouncementEditForm } from '@/components/admin/AnnouncementEditForm';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/lib/context/ToastContext';
import { ApiClientError, ApiNetworkError } from '@/lib/fetcher';
import type { Announcement } from '@/types/api';
import pageStyles from '../courses/page.module.css';
import styles from './page.module.css';

export default function AnnouncementsAdminPage() {
  const { showToast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleting, setDeleting] = useState<Announcement | null>(null);

  function load() {
    // TAD §12.9: GET /admin/announcements returns ALL announcements incl.
    // scheduled-future and expired, a distinct endpoint from the public one.
    announcementsApi
      .listAdmin()
      .then(setAnnouncements)
      .catch((err) => {
        if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
      });
  }

  useEffect(load, []);

  async function handleSave(input: Omit<Announcement, 'id'>, id?: string) {
    try {
      if (id) {
        await announcementsApi.replace(id, input);
      } else {
        await announcementsApi.create(input);
      }
      showToast('Announcement saved.', 'success');
      load();
    } catch (err) {
      if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
      throw err;
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    try {
      await announcementsApi.remove(deleting.id);
      showToast('Announcement deleted.', 'success');
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
          <h1>Announcements</h1>
          <p className={styles.subtitle}>Manage site-wide announcements and their publish windows.</p>
        </div>
        <button
          type="button"
          className={pageStyles.newButton}
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          <PlusIcon /> New announcement
        </button>
      </div>

      <AnnouncementsStatsRow announcements={announcements} />

      <div className={styles.listRow}>
        <AnnouncementList
          announcements={announcements}
          onEdit={(a) => {
            setEditing(a);
            setModalOpen(true);
          }}
          onDelete={setDeleting}
        />
      </div>

      <AnnouncementEditForm
        announcement={editing}
        open={modalOpen}
        onSave={handleSave}
        onClose={() => setModalOpen(false)}
      />

      <ConfirmDialog
        open={deleting !== null}
        title="Delete this announcement?"
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
