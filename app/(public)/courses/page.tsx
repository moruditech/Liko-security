import type { Metadata } from 'next';
import Link from 'next/link';
import { coursesApi } from '@/lib/api/courses';
import { settingsApi } from '@/lib/api/settings';
import { CourseTable } from '@/components/public/CourseTable';
import { RegistrationFeeExplainer } from '@/components/public/RegistrationFeeExplainer';
import { PrerequisitesChecklist } from '@/components/public/PrerequisitesChecklist';
import styles from './page.module.css';

// TAD §4: SSG + ISR, revalidate every 60s (shorter than other public pages
// since fee/intake data here changes more often).
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Courses | Liko Security Training',
  description: 'PSIRA-accredited security grade courses, fees, and upcoming intakes in Mount Frere.',
};

export default async function CoursesPage() {
  const [courses, intakes, settings] = await Promise.all([
    coursesApi.listPublic(),
    coursesApi.listIntakesPublic(),
    settingsApi.get(),
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

      <RegistrationFeeExplainer psiraFee={settings.psiraFee} />

      <PrerequisitesChecklist />

      <Link href="/apply" className={styles.cta}>
        Apply Now
      </Link>
    </main>
  );
}
