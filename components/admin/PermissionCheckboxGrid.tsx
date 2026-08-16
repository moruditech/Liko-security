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
      {ALL_PERMISSIONS.map((permission) => {
        const checked = selected.includes(permission);
        return (
          <label key={permission} className={`${styles.item} ${checked ? styles.checked : ''}`}>
            <input type="checkbox" checked={checked} onChange={() => toggle(permission)} />
            <span className="mono">{permission}</span>
          </label>
        );
      })}
    </div>
  );
}
