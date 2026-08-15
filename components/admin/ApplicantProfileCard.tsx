import type { Application } from '@/types/api';
import styles from './ApplicantProfileCard.module.css';

export function ApplicantProfileCard({ application }: { application: Application }) {
  return (
    <div className={styles.card}>
      <h2>{application.firstName} {application.lastName}</h2>
      <dl className={styles.facts}>
        <div>
          <dt>{application.idType === 'sa_id' ? 'SA ID number' : 'Passport number'}</dt>
          <dd className="mono">{application.idNumber}</dd>
        </div>
        <div>
          <dt>Phone</dt>
          <dd>{application.phone}</dd>
        </div>
        {application.whatsapp && (
          <div>
            <dt>WhatsApp</dt>
            <dd>{application.whatsapp}</dd>
          </div>
        )}
        <div>
          <dt>Email</dt>
          <dd>{application.email}</dd>
        </div>
        <div>
          <dt>Address</dt>
          <dd>
            {[application.address.street, application.address.suburb, application.address.city, application.address.province, application.address.postalCode]
              .filter(Boolean)
              .join(', ')}
          </dd>
        </div>
        <div>
          <dt>Courses</dt>
          <dd>
            {application.coursesSelected.map((c) => `Grade ${c.grade}: ${c.title}`).join('; ')}
          </dd>
        </div>
        <div>
          <dt>Intake</dt>
          <dd>
            {application.preferredIntake.title} ({new Date(application.preferredIntake.startDate).toLocaleDateString('en-ZA')})
          </dd>
        </div>
        <div>
          <dt>Consent given</dt>
          <dd>{new Date(application.consentGivenAt).toLocaleString('en-ZA')}</dd>
        </div>
      </dl>
    </div>
  );
}
