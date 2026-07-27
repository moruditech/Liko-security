import type { Metadata } from 'next';
import { coursesApi } from '@/lib/api/courses';
import { testimonialsApi } from '@/lib/api/testimonials';
import { faqsApi } from '@/lib/api/faqs';
import { announcementsApi } from '@/lib/api/announcements';
import { settingsApi } from '@/lib/api/settings';
import { Hero } from '@/components/public/Hero';
import { AnnouncementBanner } from '@/components/public/AnnouncementBanner';
import { AccreditationBadges } from '@/components/public/AccreditationBadges';
import { CoursePreviewGrid } from '@/components/public/CoursePreviewGrid';
import { ImpactStats } from '@/components/public/ImpactStats';
import { WhyChooseGrid } from '@/components/public/WhyChooseGrid';
import { FaqAccordion } from '@/components/public/FaqAccordion';
import { TestimonialSlider } from '@/components/public/TestimonialSlider';
import { BottomCta } from '@/components/public/BottomCta';
import { WhatsAppFloatingButton } from '@/components/public/WhatsAppFloatingButton';
import { COMPANY } from '@/lib/constants/company';
import type { Settings } from '@/types/api';

// TAD §4: SSG + ISR, revalidate every 300s.
export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Liko Security Training | PSIRA-Accredited Courses in Mount Frere',
  description:
    'PSIRA-accredited security training courses in Mount Frere. Apply online, calculate your course fees, and view upcoming intakes.',
};

const FALLBACK_SETTINGS: Settings = { bankAccounts: [], psiraFee: 0, whatsappNumber: '', contactPhone: '' };

export default async function HomePage() {
  // Each call falls back independently rather than failing the whole page,
  // since this fetch runs at BUILD time (SSG). If the backend is briefly
  // unreachable from the build environment, the build must not hard-fail,
  // ISR's 300s revalidation window will pick up real data as soon as the
  // backend responds again.
  const [courses, testimonials, faqs, announcements] = await Promise.all([
    coursesApi.listPublic().catch(() => []),
    testimonialsApi.listPublic().catch(() => []),
    faqsApi.listPublic().catch(() => []),
    announcementsApi.listPublic().catch(() => []),
  ]);
  const settings = await settingsApi.get().catch(() => FALLBACK_SETTINGS);

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

      <Hero />
      <AnnouncementBanner announcements={announcements} />
      <AccreditationBadges />
      <CoursePreviewGrid courses={courses} />
      <ImpactStats />
      <WhyChooseGrid />
      <FaqAccordion faqs={faqs} />
      <TestimonialSlider testimonials={testimonials} />
      <BottomCta />
      <WhatsAppFloatingButton whatsappNumber={settings.whatsappNumber} />
    </main>
  );
}
