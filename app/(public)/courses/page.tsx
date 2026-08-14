import type { Metadata } from 'next';
import Link from 'next/link';
import { coursesApi } from '@/lib/api/courses';
import { settingsApi } from '@/lib/api/settings';
import { CourseTable } from '@/components/public/CourseTable';
import { RegistrationFeeExplainer } from '@/components/public/RegistrationFeeExplainer';
import { PrerequisitesChecklist } from '@/components/public/PrerequisitesChecklist';
import type { Settings } from '@/types/api';
import styles from './page.module.css';

// TAD §4: SSG + ISR, revalidate every 60s (shorter than other public pages
// since fee/intake data here changes more often).
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Courses | Liko Security Training',
  description: 'PSIRA-accredited security grade courses, fees, and upcoming intakes in Mount Frere.',
};

const FALLBACK_SETTINGS: Settings = { bankAccounts: [], psiraRegistrationFee: 0, whatsappNumber: '', contactPhone: '' };

export default async function CoursesPage() {
  // Same reasoning as the home page: this runs at BUILD time (SSG), so a
  // backend that's briefly unreachable from the build environment must not
  // fail the whole build. ISR's 60s revalidation window catches up once the
  // backend responds again.
  const [courses, intakes, settings] = await Promise.all([
    coursesApi.listPublic().catch(() => []),
    coursesApi.listIntakesPublic().catch(() => []),
    settingsApi.get().catch(() => FALLBACK_SETTINGS),
  ]);

  return (
    <main className={styles.main}>
      <h1>Our courses</h1>

      {/*
        TAD §9: JSON-LD Course schema per grade.
      */}
      {courses.map((course) => (
        <script
          key={course.id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Course',
              name: course.title,
              provider: { '@type': 'Organization', name: 'Liko Security Training' },
            }),
          }}
        />
      ))}

      <CourseTable courses={courses} intakes={intakes} />

      <RegistrationFeeExplainer psiraFee={settings.psiraRegistrationFee} />

      <PrerequisitesChecklist />

      <Link href="/apply" className={styles.cta}>
        Apply Now
      </Link>
    </main>
  );
}
