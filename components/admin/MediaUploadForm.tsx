'use client';

import { useState } from 'react';
import type { GalleryCategory } from '@/types/api';
import styles from './MediaUploadForm.module.css';

const CATEGORIES: GalleryCategory[] = ['Practical Drills', 'Graduations', 'Campus Life'];

interface MediaUploadFormProps {
  onUpload: (form: FormData) => Promise<void>;
}

export function MediaUploadForm({ onUpload }: MediaUploadFormProps) {
  const [category, setCategory] = useState<GalleryCategory>('Practical Drills');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('category', category);
      form.append('mediaType', mediaType); // required by gallery.validation.js on create
      if (title) form.append('title', title);
      form.append('media', file);
      await onUpload(form);
      setTitle('');
      setFile(null);
    } finally {
      setUploading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="mediaCategory">Category</label>
        <div className={styles.selectWrap}>
          <select id="mediaCategory" required value={category} onChange={(e) => setCategory(e.target.value as GalleryCategory)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <ChevronIcon />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="mediaType">Type</label>
        <div className={styles.selectWrap}>
          <select id="mediaType" required value={mediaType} onChange={(e) => setMediaType(e.target.value as 'image' | 'video')}>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
          <ChevronIcon />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="mediaTitle">Title (optional)</label>
        <input id="mediaTitle" placeholder="e.g. Grade C intake, August 2026" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div className={styles.fieldFile}>
        <label htmlFor="mediaFile">File</label>
        {/*
          GALLERY_ALLOWED_MIME_TYPES (upload.middleware.js): jpeg/png for
          images, mp4/quicktime/webm for video — confirmed against the actual
          middleware, unlike the ID-document upload's accept attribute
          (still separately unverified, per the earlier flag on that form).
          Narrowed by the selected media type so people aren't offered a
          video picker while "Image" is selected.
        */}
        <input
          id="mediaFile"
          type="file"
          accept={mediaType === 'video' ? 'video/mp4,video/quicktime,video/webm' : 'image/jpeg,image/png'}
          required
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        {file && <span className={styles.fileName}>{file.name}</span>}
      </div>

      <button type="submit" className={styles.submit} disabled={uploading}>
        <UploadIcon />
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 16V4M7 9l5-5 5 5" />
      <path d="M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3" />
    </svg>
  );
}
