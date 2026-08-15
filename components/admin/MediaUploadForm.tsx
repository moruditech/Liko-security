'use client';

import { useState } from 'react';
import styles from './MediaUploadForm.module.css';

interface MediaUploadFormProps {
  onUpload: (form: FormData) => Promise<void>;
}

export function MediaUploadForm({ onUpload }: MediaUploadFormProps) {
  const [category, setCategory] = useState('');
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('category', category);
      if (caption) form.append('caption', caption);
      form.append('media', file);
      await onUpload(form);
      setCategory('');
      setCaption('');
      setFile(null);
    } finally {
      setUploading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="mediaCategory">Category</label>
        <input
          id="mediaCategory"
          placeholder="e.g. Training, Facilities"
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="mediaCaption">Caption (optional)</label>
        <input id="mediaCaption" placeholder="e.g. Grade C intake, August 2026" value={caption} onChange={(e) => setCaption(e.target.value)} />
      </div>

      <div className={styles.fieldFile}>
        <label htmlFor="mediaFile">Image</label>
        {/*
          FLAG: unlike FileUploadDropzone's ID-document pre-check (verified
          against upload.middleware.js's exact 10MB/jpeg/png/pdf constants),
          the gallery upload route's actual size/type limits weren't
          separately confirmed here, it may use a different multer config.
          Verify against the real gallery upload middleware before relying on
          this accept attribute as authoritative.
        */}
        <input
          id="mediaFile"
          type="file"
          accept="image/jpeg,image/png"
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

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 16V4M7 9l5-5 5 5" />
      <path d="M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3" />
    </svg>
  );
}
