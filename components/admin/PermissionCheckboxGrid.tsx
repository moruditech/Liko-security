import type { Permission } from '@/types/api';
import styles from './PermissionCheckboxGrid.module.css';

const ALL_PERMISSIONS: Permission[] = [
  'applications:read',
  'applications:write',
  'invoices:issue',
  'courses:manage',
  'gallery:manage',
  'testimonials:manage',
  'faqs:manage',
  'inquiries:manage',
  'content:manage',
  'users:manage',
];

interface PermissionCheckboxGridProps {
  selected: Permission[];
  onChange: (permissions: Permission[]) => void;
}

export function PermissionCheckboxGrid({ selected, onChange }: PermissionCheckboxGridProps) {
  function toggle(permission: Permission) {
    onChange(selected.includes(permission) ? selected.filter((p) => p !== permission) : [...selected, permission]);
  }

  return (
    <div className={styles.grid}>
      {ALL_PERMISSIONS.map((permission) => (
        <label key={permission} className={styles.item}>
          <input type="checkbox" checked={selected.includes(permission)} onChange={() => toggle(permission)} />
          {permission}
        </label>
      ))}
    </div>
  );
}
