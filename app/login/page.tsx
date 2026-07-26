'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthProvider';
import { ApiClientError } from '@/lib/fetcher';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = await login(email, password);
      router.push(result.mfaRequired ? '/login/mfa' : '/admin');
    } catch (err) {
      // TAD §11.7 (FR-AUTH-01): generic failure message. The backend's
      // auth.controller.js returns the same message for bad email vs bad
      // password on purpose, so we show it verbatim, per the project's
      // error-message rule, without adding our own wording on top.
      setError(err instanceof ApiClientError ? err.message : "Couldn't connect. Check your internet connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1>Staff sign in</h1>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>

        <a href="/login/forgot-password" className={styles.link}>
          Forgot password?
        </a>
      </form>
    </main>
  );
}
