'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthProvider';
import { ApiClientError } from '@/lib/fetcher';
import styles from '../page.module.css';

export default function MfaPage() {
  const router = useRouter();
  const { pendingMfaToken, verifyMfa } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // TAD §11.7: /login/mfa is unreachable without a pending mfaToken in
  // context. A hard reload here loses the in-memory token by design (it was
  // never meant to survive a reload), send the person back to start over.
  useEffect(() => {
    if (!pendingMfaToken) {
      router.replace('/login');
    }
  }, [pendingMfaToken, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await verifyMfa(code);
      router.push('/admin');
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Couldn't connect. Check your internet connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!pendingMfaToken) return null;

  return (
    <main className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1>Enter your code</h1>
        <p>Enter the 6-digit code from your authenticator app.</p>

        <label htmlFor="code">Code</label>
        <input
          id="code"
          type="text"
          inputMode="numeric"
          pattern="[0-9]{6}"
          maxLength={6}
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
          autoComplete="one-time-code"
        />

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Verifying...' : 'Verify'}
        </button>
      </form>
    </main>
  );
}
