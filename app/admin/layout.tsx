'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthProvider';
import { PermissionGate } from '@/components/admin/PermissionGate';
import styles from './layout.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { status, user, logout } = useAuth();
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
      <aside className={styles.sidebar}>
        <nav className={styles.nav}>
          {/* Dashboard: any authenticated session, per TAD §12.1 */}
          {/* next/link, not a plain <a>: a plain anchor forces a full page
              reload, which remounts AuthProvider from scratch and throws away
              the in-memory access token, forcing a fresh POST /auth/refresh
              (relying on a cross-domain cookie) on every single nav click.
              Link keeps this a client-side transition within the same React
              tree, so the already-authenticated in-memory session persists. */}
          <Link href="/admin">Dashboard</Link>

          <PermissionGate permission="applications:read">
            <Link href="/admin/applications">Applications</Link>
          </PermissionGate>
          <PermissionGate permission="courses:manage">
            <Link href="/admin/courses">Courses &amp; Intakes</Link>
          </PermissionGate>
          <PermissionGate permission="gallery:manage">
            <Link href="/admin/gallery">Gallery</Link>
          </PermissionGate>
          <PermissionGate permission="testimonials:manage">
            <Link href="/admin/testimonials">Testimonials</Link>
          </PermissionGate>
          <PermissionGate permission="faqs:manage">
            <Link href="/admin/faqs">FAQs</Link>
          </PermissionGate>
          <PermissionGate permission="inquiries:manage">
            <Link href="/admin/inquiries">Inquiries</Link>
          </PermissionGate>
          <PermissionGate permission="content:manage">
            <Link href="/admin/announcements">Announcements</Link>
          </PermissionGate>
          {/* Settings, audit logs, users, roles all gate on users:manage (Super Admin), per TAD §12.10-12.13 */}
          <PermissionGate permission="users:manage">
            <>
              <Link href="/admin/settings">Settings</Link>
              <Link href="/admin/audit-logs">Audit Logs</Link>
              <Link href="/admin/users">Users</Link>
              <Link href="/admin/roles">Roles</Link>
            </>
          </PermissionGate>
        </nav>
        <div className={styles.userBlock}>
          <span>{user?.name}</span>
          <button type="button" onClick={() => logout()}>
            Sign out
          </button>
        </div>
      </aside>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
