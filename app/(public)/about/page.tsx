import type { Metadata } from 'next';
import { settingsApi } from '@/lib/api/settings';
import { LocationMap } from '@/components/public/LocationMap';
import { COMPANY } from '@/lib/constants/company';
import styles from './page.module.css';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'About | Liko Security Training',
  description: 'PSIRA-accredited security training in Mount Frere. Our accreditation, campus, and facilities.',
};

export default async function AboutPage() {
  const settings = await settingsApi.get().catch(() => null);

  return (
    <main className={styles.main}>
      <section>
        <h1>About Liko Security Training</h1>
        <p>
          Liko Security Training is a PSIRA-accredited training provider based in Mount Frere, offering security
          grade courses from Grade E through Grade B.
        </p>
      </section>

      <section>
        <h2>Accreditation &amp; compliance</h2>
        <dl className={styles.facts}>
          <div>
            <dt>PSIRA registration number</dt>
            <dd className="mono">{COMPANY.psiraNumber}</dd>
          </div>
          <div>
            <dt>Training centre number</dt>
            <dd className="mono">{COMPANY.centreNumber}</dd>
          </div>
        </dl>
      </section>

      <section>
        <h2>Our campus</h2>
        <p>
          {COMPANY.address.line1}, {COMPANY.address.city}
        </p>
        {settings?.contactPhone && <p>{settings.contactPhone}</p>}
        <LocationMap />
      </section>
    </main>
  );
}
