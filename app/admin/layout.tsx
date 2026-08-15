'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthProvider';
import { Sidebar } from '@/components/admin/Sidebar';
import styles from './layout.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  // Backstop only. middleware.ts (TAD §10) is the actual gate that stops an
  // anonymous visitor with no refresh cookie from ever reaching this shell.
  // This handles the narrower case where a cookie was present at the
  // middleware check but has since expired/been revoked, so AuthProvider's
  // own refresh call fails after the shell has already started mounting.
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  if (status === 'verifying') {
    return (
      <div className={styles.verifying} role="status" aria-live="polite">
        Checking your session...
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className={styles.shell}>
      <Sidebar />
      <main className={styles.content}>{children}</main>
    </div>
  );
}
