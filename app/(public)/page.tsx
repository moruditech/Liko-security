import type { Metadata } from 'next';
import { coursesApi } from '@/lib/api/courses';
import { testimonialsApi } from '@/lib/api/testimonials';
import { faqsApi } from '@/lib/api/faqs';
import { announcementsApi } from '@/lib/api/announcements';
import { settingsApi } from '@/lib/api/settings';
import { Hero } from '@/components/public/Hero';
import { CoursePreviewGrid } from '@/components/public/CoursePreviewGrid';
import { AnnouncementBanner } from '@/components/public/AnnouncementBanner';
import { FaqAccordion } from '@/components/public/FaqAccordion';
import { TestimonialSlider } from '@/components/public/TestimonialSlider';
import { WhatsAppFloatingButton } from '@/components/public/WhatsAppFloatingButton';
import { COMPANY } from '@/lib/constants/company';
import styles from './page.module.css';

// TAD §4: SSG + ISR, revalidate every 300s.
export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Liko Security Training | PSIRA-Accredited Courses in Mount Frere',
  description:
    'PSIRA-accredited security training courses in Mount Frere. Apply online, calculate your course fees, and view upcoming intakes.',
};

export default async function HomePage() {
  const [courses, testimonials, faqs, announcements, settings] = await Promise.all([
    coursesApi.listPublic(),
    testimonialsApi.listPublic(),
    faqsApi.listPublic(),
    announcementsApi.listPublic(),
    settingsApi.get(),
  ]);

  return (
    <main>
      {/*
        JSON-LD LocalBusiness per TAD §9. Values beyond name/address are
        placeholders pending confirmation, see lib/constants/company.ts's
        own flag about verifying PSIRA/registration numbers against the
        real certificate before this ships.
      */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: COMPANY.name,
            address: {
              '@type': 'PostalAddress',
              streetAddress: COMPANY.address.line1,
              addressLocality: COMPANY.address.city,
              addressCountry: 'ZA',
            },
          }),
        }}
      />

      <Hero courses={courses} psiraFee={settings.psiraFee} />
      <AnnouncementBanner announcements={announcements} />

      <section className={styles.accreditation}>
        <h2>Accredited &amp; recognised</h2>
        <p>
          Registered with PSIRA (No. {COMPANY.psiraNumber}) and based at Centre No. {COMPANY.centreNumber} in{' '}
          {COMPANY.address.city}.
        </p>
      </section>

      <CoursePreviewGrid courses={courses} />

      <section className={styles.whyChoose}>
        <h2>Why choose Liko</h2>
        <ul>
          <li>PSIRA-accredited courses at every grade</li>
          <li>Local campus in Mount Frere, no travel to a distant city required</li>
          <li>Clear, upfront course and registration fees</li>
        </ul>
      </section>

      <FaqAccordion faqs={faqs} />
      <TestimonialSlider testimonials={testimonials} />
      <WhatsAppFloatingButton whatsappNumber={settings.whatsappNumber} />
    </main>
  );
}
