import { FeeCalculator } from './FeeCalculator';
import { COMPANY } from '@/lib/constants/company';
import type { Course } from '@/types/api';
import styles from './Hero.module.css';

interface HeroProps {
  courses: Course[];
  psiraFee: number;
}

export function Hero({ courses, psiraFee }: HeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.left}>
        <h1>PSIRA-accredited security training in Mount Frere</h1>
        <dl className={styles.facts}>
          <div>
            <dt>PSIRA No.</dt>
            <dd className="mono">{COMPANY.psiraNumber}</dd>
          </div>
          <div>
            <dt>Centre No.</dt>
            <dd className="mono">{COMPANY.centreNumber}</dd>
          </div>
          <div>
            <dt>Address</dt>
            <dd>
              {COMPANY.address.line1}, {COMPANY.address.city}
            </dd>
          </div>
        </dl>
      </div>
      <div className={styles.right}>
        <FeeCalculator courses={courses} psiraFee={psiraFee} />
      </div>
    </section>
  );
}
