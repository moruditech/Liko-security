'use client';

import { useState } from 'react';
import { authApi } from '@/lib/api/auth';
import { ApiClientError } from '@/lib/fetcher';
import styles from '../page.module.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await authApi.forgotPassword(email);
      // TAD §11.7: identical generic confirmation regardless of match, the
      // backend deliberately gives the same response either way, so we show
      // the same confirmation UI either way too, not a message that reveals
      // whether the address exists.
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Couldn't connect. Check your internet connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <main className={styles.wrapper}>
        <div className={styles.form}>
          <h1>Check your email</h1>
          <p>If an account exists for that address, we&apos;ve sent a link to reset your password.</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1>Reset your password</h1>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
        />

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Sending...' : 'Send reset link'}
        </button>
      </form>
    </main>
  );
}
