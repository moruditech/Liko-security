'use client';

import { useState } from 'react';
import { inquiriesApi } from '@/lib/api/inquiries';
import { ApiClientError, ApiNetworkError } from '@/lib/fetcher';
import styles from './InquiryForm.module.css';

export function InquiryForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError(null);
    setSubmitting(true);
    try {
      await inquiriesApi.submit({ name, email, phone: phone || undefined, message });
      setSubmitted(true);
    } catch (err) {
      if (err instanceof ApiNetworkError) {
        setGeneralError(err.message);
      } else if (err instanceof ApiClientError) {
        if (err.errors.length > 0) {
          const byField: Record<string, string> = {};
          for (const fieldError of err.errors) byField[fieldError.field] = fieldError.message;
          setFieldErrors(byField);
        }
        // Also covers the public-submission rate limiter on POST /inquiries
        // (rateLimiter.middleware.js), same backend-message-verbatim path,
        // no status-code branching.
        setGeneralError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return <p>Thanks for reaching out. We&apos;ll get back to you soon.</p>;
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label htmlFor="contactName">Name</label>
      <input
        id="contactName"
        required
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {fieldErrors.name && <p className={styles.error}>{fieldErrors.name}</p>}

      <label htmlFor="contactEmail">Email</label>
      <input
        id="contactEmail"
        type="email"
        required
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {fieldErrors.email && <p className={styles.error}>{fieldErrors.email}</p>}

      <label htmlFor="contactPhone">Phone (optional)</label>
      <input
        id="contactPhone"
        type="tel"
        placeholder="Your phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <label htmlFor="contactMessage">Message</label>
      <textarea
        id="contactMessage"
        required
        rows={5}
        placeholder="Type your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      {fieldErrors.message && <p className={styles.error}>{fieldErrors.message}</p>}

      {generalError && (
        <p className={styles.error} role="alert">
          {generalError}
        </p>
      )}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Sending...' : 'Send Message'}
        <ArrowIcon />
      </button>
    </form>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
