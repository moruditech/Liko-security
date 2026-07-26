'use client';

import { useEffect } from 'react';
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
          <a href="/admin">Dashboard</a>

          <PermissionGate permission="applications:read">
            <a href="/admin/applications">Applications</a>
          </PermissionGate>
          <PermissionGate permission="courses:manage">
            <a href="/admin/courses">Courses &amp; Intakes</a>
          </PermissionGate>
          <PermissionGate permission="gallery:manage">
            <a href="/admin/gallery">Gallery</a>
          </PermissionGate>
          <PermissionGate permission="testimonials:manage">
            <a href="/admin/testimonials">Testimonials</a>
          </PermissionGate>
          <PermissionGate permission="faqs:manage">
            <a href="/admin/faqs">FAQs</a>
          </PermissionGate>
          <PermissionGate permission="inquiries:manage">
            <a href="/admin/inquiries">Inquiries</a>
          </PermissionGate>
          <PermissionGate permission="content:manage">
            <a href="/admin/announcements">Announcements</a>
          </PermissionGate>
          {/* Settings, audit logs, users, roles all gate on users:manage (Super Admin), per TAD §12.10-12.13 */}
          <PermissionGate permission="users:manage">
            <>
              <a href="/admin/settings">Settings</a>
              <a href="/admin/audit-logs">Audit Logs</a>
              <a href="/admin/users">Users</a>
              <a href="/admin/roles">Roles</a>
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
