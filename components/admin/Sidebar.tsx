'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthProvider';
import { PermissionGate } from '@/components/admin/PermissionGate';
import { COMPANY } from '@/lib/constants/company';
import type { Permission } from '@/types/api';
import styles from './Sidebar.module.css';

const COLLAPSE_STORAGE_KEY = 'liko-admin-sidebar-collapsed';
// 767px — matches the mock's "COLLAPSED (≤767px)" breakpoint label exactly.
const MOBILE_QUERY = '(max-width: 47.9375rem)';

interface NavItemDef {
  href: string;
  label: string;
  icon: React.ReactNode;
  permission?: Permission;
}

const NAV_ITEMS: NavItemDef[] = [
  { href: '/admin', label: 'Dashboard', icon: <HomeIcon /> },
  { href: '/admin/applications', label: 'Applications', icon: <FileTextIcon />, permission: 'applications:read' },
  { href: '/admin/courses', label: 'Courses & Intakes', icon: <GraduationCapIcon />, permission: 'courses:manage' },
  { href: '/admin/gallery', label: 'Gallery', icon: <GalleryIcon />, permission: 'gallery:manage' },
  { href: '/admin/testimonials', label: 'Testimonials', icon: <QuoteIcon />, permission: 'testimonials:manage' },
  { href: '/admin/faqs', label: 'FAQs', icon: <HelpCircleIcon />, permission: 'faqs:manage' },
  { href: '/admin/inquiries', label: 'Inquiries', icon: <MailIcon />, permission: 'inquiries:manage' },
  { href: '/admin/announcements', label: 'Announcements', icon: <MegaphoneIcon />, permission: 'content:manage' },
  // Settings, audit logs, users, roles all gate on users:manage (Super Admin), per TAD §12.10-12.13
  { href: '/admin/settings', label: 'Settings', icon: <SettingsIcon />, permission: 'users:manage' },
  { href: '/admin/audit-logs', label: 'Audit Logs', icon: <ShieldCheckIcon />, permission: 'users:manage' },
  { href: '/admin/users', label: 'Users', icon: <UsersIcon />, permission: 'users:manage' },
  { href: '/admin/roles', label: 'Roles', icon: <IdCardIcon />, permission: 'users:manage' },
];

function isActivePath(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === '/admin') return pathname === '/admin';
  return pathname === href || pathname.startsWith(`${href}/`);
}

// "Liko Super Admin" -> "LS": first letter of the first two words. Falls
// back to the first two characters for a single-word name.
function getInitials(name: string): string {
  const [first, second] = name.trim().split(/\s+/).filter(Boolean);
  if (!first) return '';
  if (!second) return first.slice(0, 2).toUpperCase();
  return (first.charAt(0) + second.charAt(0)).toUpperCase();
}

export function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Resolve the real collapsed state after mount: an explicit stored
  // preference wins, otherwise default to collapsed only below the mock's
  // 767px breakpoint. Deliberately not read synchronously in useState's
  // initializer — this component can be part of the server-rendered HTML,
  // and window/localStorage aren't available there.
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(COLLAPSE_STORAGE_KEY);
    } catch {
      stored = null;
    }
    if (stored === 'true' || stored === 'false') {
      setCollapsed(stored === 'true');
    } else {
      setCollapsed(window.matchMedia(MOBILE_QUERY).matches);
    }
  }, []);

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Close the mobile drawer after following a link. Transient UI state only
  // (plain setCollapsed, not the persisting toggle below) — it shouldn't
  // overwrite a manually-set desktop preference.
  useEffect(() => {
    if (isMobile) setCollapsed(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Escape closes the mobile drawer, matching SiteHeader's mobile panel.
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && isMobile && !collapsed) {
        setCollapsed(true);
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isMobile, collapsed]);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(COLLAPSE_STORAGE_KEY, String(next));
      } catch {
        // Private browsing / storage disabled — collapse still works this session.
      }
      return next;
    });
  }

  const [brandFirst, ...brandRest] = COMPANY.name.toUpperCase().split(' ');

  return (
    <>
      {isMobile && !collapsed && (
        <button
          type="button"
          className={styles.scrim}
          aria-label="Close menu"
          onClick={() => setCollapsed(true)}
        />
      )}

      <aside className={styles.sidebar} data-collapsed={collapsed}>
        <div className={styles.header}>
          <Link href="/admin" className={styles.brand}>
            <ShieldMark />
            <span className={styles.brandText}>
              <span className={styles.brandName}>{brandFirst}</span>
              <span className={styles.brandSub}>{brandRest.join(' ')}</span>
            </span>
          </Link>
          <button
            type="button"
            className={styles.collapseToggle}
            onClick={toggleCollapsed}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
          >
            {collapsed ? <ChevronsRightIcon /> : <ChevronsLeftIcon />}
          </button>
        </div>

        <nav className={styles.nav} aria-label="Admin">
          {NAV_ITEMS.map((item) => {
            const link = (
              <NavLink key={item.href} item={item} active={isActivePath(pathname, item.href)} collapsed={collapsed} />
            );
            return item.permission ? (
              <PermissionGate key={item.href} permission={item.permission}>
                {link}
              </PermissionGate>
            ) : (
              link
            );
          })}
        </nav>

        <div className={styles.footer}>
          <Link href="/admin/profile" className={styles.userBlock}>
            <span className={styles.avatar} aria-hidden="true">
              {user ? getInitials(user.name) : ''}
            </span>
            <span className={styles.userText}>
              <span className={styles.userName}>{user?.name}</span>
              <span className={styles.userRole}>{user?.role}</span>
            </span>
            <ChevronDownIcon className={styles.userChevron} />
          </Link>
          <button type="button" className={styles.signOutBtn} onClick={() => logout()}>
            <LogOutIcon />
            <span className={styles.signOutLabel}>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

function NavLink({ item, active, collapsed }: { item: NavItemDef; active: boolean; collapsed: boolean }) {
  return (
    <Link
      href={item.href}
      className={`${styles.navItem} ${active ? styles.navItemActive : ''}`}
      aria-current={active ? 'page' : undefined}
      title={collapsed ? item.label : undefined}
    >
      <span className={styles.navIcon}>{item.icon}</span>
      <span className={styles.navLabel}>{item.label}</span>
    </Link>
  );
}

/**
 * Dark-sidebar variant of SiteHeader's shield mark (same silhouette, same
 * DESIGN.md §9 signature element) — gold fill with a navy star reads as a
 * badge against the navy sidebar, where the header's navy-fill version
 * would disappear.
 */
function ShieldMark() {
  return (
    <svg className={styles.shieldIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2L4 5v6c0 5.25 3.4 9.7 8 11 4.6-1.3 8-5.75 8-11V5l-8-3z" fill="var(--liko-gold)" />
      <path
        d="M12 5.8L13 8.63L16 8.7L13.62 10.53L14.47 13.4L12 11.7L9.53 13.4L10.38 10.53L8 8.7L11 8.63Z"
        fill="var(--liko-navy)"
      />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12l9-9 9 9M5 10v10h14V10" />
    </svg>
  );
}

function FileTextIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </svg>
  );
}

function GraduationCapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3L2 8l10 5 10-5-10-5zM6 10.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5" />
    </svg>
  );
}

function GalleryIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="M21 16l-6-5-4 4-2-2-6 5" />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="7" cy="8" r="2.2" fill="currentColor" stroke="none" />
      <path d="M7 10.2c0 3-1.5 4.7-3.3 5.6" />
      <circle cx="16" cy="8" r="2.2" fill="currentColor" stroke="none" />
      <path d="M16 10.2c0 3-1.5 4.7-3.3 5.6" />
    </svg>
  );
}

function HelpCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.2a2.5 2.5 0 014.8.8c0 1.7-2.3 2-2.3 3.5" />
      <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 6h16v12H4z" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  );
}

function MegaphoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 10v4h3l7 4V6l-7 4H3z" />
      <path d="M13 9a4 4 0 010 6" />
      <path d="M16.5 7a7.5 7.5 0 010 10" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3.2" />
      <path d="M18.5 12L21 12M16.6 7.4L18.4 5.6M12 5.5L12 3M7.4 7.4L5.6 5.6M5.5 12L3 12M7.4 16.6L5.6 18.4M12 18.5L12 21M16.6 16.6L18.4 18.4" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="8.5" cy="8" r="3" />
      <path d="M2.5 19.5a6 6 0 0112 0" />
      <circle cx="16.5" cy="8.5" r="2.5" />
      <path d="M14.8 13a5.5 5.5 0 016.7 5.4" />
    </svg>
  );
}

function IdCardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="11" r="2" />
      <path d="M6 16c0-1.8 1.3-3 3-3s3 1.2 3 3" />
      <path d="M14.5 10h4M14.5 13h3" />
    </svg>
  );
}

function LogOutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <path d="M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function ChevronsLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
    </svg>
  );
}

function ChevronsRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
    </svg>
  );
}
