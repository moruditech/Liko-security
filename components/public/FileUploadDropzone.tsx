'use client';

import { useRef, useState } from 'react';
import styles from './FileUploadDropzone.module.css';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // matches upload.middleware.js MAX_FILE_SIZE_BYTES
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf']; // matches ALLOWED_MIME_TYPES

interface FileUploadDropzoneProps {
  file: File | null;
  onChange: (file: File | null) => void;
}

export function FileUploadDropzone({ file, onChange }: FileUploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  // This is a courtesy pre-check only. The server validates by magic bytes,
  // not file extension or the client-reported MIME type, both of which are
  // spoofable (upload.middleware.js's validateFileContent), the server is
  // authoritative regardless of what this accepts.
  function validate(candidate: File): string | null {
    if (!ALLOWED_MIME_TYPES.includes(candidate.type)) {
      return 'Please upload a JPEG, PNG, or PDF file.';
    }
    if (candidate.size > MAX_FILE_SIZE_BYTES) {
      return 'File must be 10MB or smaller.';
    }
    return null;
  }

  function handleFile(candidate: File | undefined) {
    if (!candidate) return;
    const validationError = validate(candidate);
    if (validationError) {
      setError(validationError);
      onChange(null);
      return;
    }
    setError(null);
    onChange(candidate);
  }

  return (
    <div className={styles.field}>
      <label htmlFor="idDocument">ID document (JPEG, PNG, or PDF, up to 10MB)</label>
      <div
        className={styles.dropzone}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files[0]);
        }}
      >
        {file ? <span>{file.name}</span> : <span>Click or drag a file here</span>}
      </div>
      <input
        ref={inputRef}
        id="idDocument"
        type="file"
        accept="image/jpeg,image/png,application/pdf"
        onChange={(e) => handleFile(e.target.files?.[0])}
        hidden
      />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
