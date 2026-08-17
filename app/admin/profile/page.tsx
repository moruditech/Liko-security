'use client';

import { useEffect, useState } from 'react';
import { profileApi } from '@/lib/api/profile';
import { SectionCard } from '@/components/admin/SectionCard';
import { ProfileDetailsForm } from '@/components/admin/ProfileDetailsForm';
import { ChangePasswordForm } from '@/components/admin/ChangePasswordForm';
import { useToast } from '@/lib/context/ToastContext';
import { ApiClientError, ApiNetworkError } from '@/lib/fetcher';
import type { StaffUser } from '@/types/api';
import styles from './page.module.css';

export default function ProfilePage() {
  const { showToast } = useToast();
  const [profile, setProfile] = useState<StaffUser | null>(null);

  function load() {
    profileApi
      .get()
      .then(setProfile)
      .catch((err) => {
        if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
      });
  }

  useEffect(load, []);

  async function handleSaveDetails(input: { name: string; phone: string; email: string }) {
    try {
      const updated = await profileApi.update(input);
      setProfile(updated);
      showToast('Profile updated.', 'success');
    } catch (err) {
      if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
    }
  }

  async function handleChangePassword(currentPassword: string, newPassword: string) {
    try {
      await profileApi.changePassword(currentPassword, newPassword);
      // Every other session's refresh token is revoked server-side on a
      // successful change (profile.service.js) — this session's own access
      // token stays valid until it naturally expires, same as a deactivate.
      showToast('Password changed. You have been signed out of your other sessions.', 'success');
    } catch (err) {
      if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
    }
  }

  return (
    <div>
      <div className={styles.header}>
        <h1>My Profile</h1>
        <p className={styles.subtitle}>Manage your own account details and password.</p>
      </div>

      {profile ? (
        <div className={styles.stack}>
          <SectionCard icon={<UserIcon />} accent="navy" title="Profile details">
            <ProfileDetailsForm profile={profile} onSave={handleSaveDetails} />
          </SectionCard>

          <SectionCard icon={<LockIcon />} accent="gold" title="Change password">
            <ChangePasswordForm onSave={handleChangePassword} />
          </SectionCard>
        </div>
      ) : (
        <p className={styles.loading}>Loading...</p>
      )}
    </div>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 018 0v4" />
    </svg>
  );
}
