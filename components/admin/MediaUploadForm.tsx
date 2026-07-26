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
      <input placeholder="Category" required value={category} onChange={(e) => setCategory(e.target.value)} />
      <input placeholder="Caption (optional)" value={caption} onChange={(e) => setCaption(e.target.value)} />
      {/*
        FLAG: unlike FileUploadDropzone's ID-document pre-check (verified
        against upload.middleware.js's exact 10MB/jpeg/png/pdf constants),
        the gallery upload route's actual size/type limits weren't
        separately confirmed here, it may use a different multer config.
        Verify against the real gallery upload middleware before relying on
        this accept attribute as authoritative.
      */}
      <input type="file" accept="image/jpeg,image/png" required onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <button type="submit" disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  );
}
