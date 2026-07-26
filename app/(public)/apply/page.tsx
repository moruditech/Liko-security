import type { Metadata } from 'next';
import { coursesApi } from '@/lib/api/courses';
import { settingsApi } from '@/lib/api/settings';
import { ApplicationForm } from '@/components/public/ApplicationForm';
import styles from './page.module.css';

// TAD §4: SSR for /apply's initial course/intake list, not SSG+ISR, this
// data needs to be fresh at request time since it drives what an applicant
// can actually select.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Apply | Liko Security Training',
  description: 'Apply for PSIRA-accredited security training in Mount Frere.',
};

export default async function ApplyPage() {
  const [courses, intakes, settings] = await Promise.all([
    coursesApi.listPublic(),
    coursesApi.listIntakesPublic(),
    settingsApi.get(),
  ]);

  return (
    <main>
      <h1 className={styles.heading}>Apply now</h1>
      <ApplicationForm courses={courses} intakes={intakes} psiraFee={settings.psiraFee} />
    </main>
  );
}
