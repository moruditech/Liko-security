'use client';

import { useEffect, useState } from 'react';
import { galleryApi } from '@/lib/api/gallery';
import { MediaUploadForm } from '@/components/admin/MediaUploadForm';
import { GalleryManagementGrid } from '@/components/admin/GalleryManagementGrid';
import { GalleryEditModal } from '@/components/admin/GalleryEditModal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/lib/context/ToastContext';
import { ApiClientError, ApiNetworkError } from '@/lib/fetcher';
import type { GalleryItem } from '@/types/api';

export default function GalleryAdminPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<GalleryItem | null>(null);

  function load() {
    galleryApi
      .listAdmin()
      .then(setItems)
      .catch((err) => {
        if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
      });
  }

  useEffect(load, []);

  async function handleUpload(form: FormData) {
    try {
      await galleryApi.create(form);
      showToast('Uploaded.', 'success');
      load();
    } catch (err) {
      if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
    }
  }

  async function handleMove(item: GalleryItem, direction: 'up' | 'down') {
    const sorted = [...items].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((i) => i.id === item.id);
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    const swapItem = sorted[swapIndex];
    if (!swapItem) return;

    try {
      await Promise.all([galleryApi.reorder(item.id, swapItem.order), galleryApi.reorder(swapItem.id, item.order)]);
      load();
    } catch (err) {
      if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
    }
  }

  async function handleSaveEdit(id: string, form: FormData) {
    try {
      await galleryApi.update(id, form);
      showToast('Saved.', 'success');
      load();
    } catch (err) {
      if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
    }
  }

  async function handleDelete() {
    if (!deletingItem) return;
    try {
      await galleryApi.remove(deletingItem.id);
      showToast('Deleted.', 'success');
      load();
    } catch (err) {
      if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
    } finally {
      setDeletingItem(null);
    }
  }

  return (
    <div>
      <h1>Gallery</h1>
      <MediaUploadForm onUpload={handleUpload} />
      <GalleryManagementGrid
        items={items}
        onMove={handleMove}
        onEdit={(item) => {
          setEditingItem(item);
          setEditModalOpen(true);
        }}
        onDelete={setDeletingItem}
      />

      <GalleryEditModal
        item={editingItem}
        open={editModalOpen}
        onSave={handleSaveEdit}
        onClose={() => setEditModalOpen(false)}
      />

      <ConfirmDialog
        open={deletingItem !== null}
        title="Delete this gallery item?"
        description="This cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeletingItem(null)}
      />
    </div>
  );
}
