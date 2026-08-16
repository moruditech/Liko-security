'use client';

import { useEffect, useState } from 'react';
import { settingsApi } from '@/lib/api/settings';
import { SettingsForm } from '@/components/admin/SettingsForm';
import { useToast } from '@/lib/context/ToastContext';
import { ApiClientError, ApiNetworkError } from '@/lib/fetcher';
import type { Settings } from '@/types/api';
import styles from './page.module.css';

export default function SettingsAdminPage() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    settingsApi
      .get()
      .then(setSettings)
      .catch((err) => {
        if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSave(input: Settings) {
    try {
      const updated = await settingsApi.update(input);
      setSettings(updated);
      showToast('Settings saved.', 'success');
    } catch (err) {
      if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
    }
  }

  return (
    <div>
      <div className={styles.header}>
        <h1>Settings</h1>
        <p className={styles.subtitle}>Configure site-wide settings used across applications and invoices.</p>
      </div>

      {settings ? <SettingsForm settings={settings} onSave={handleSave} /> : <p className={styles.loading}>Loading...</p>}
    </div>
  );
}
