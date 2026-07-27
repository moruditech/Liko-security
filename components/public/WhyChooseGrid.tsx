import styles from './WhyChooseGrid.module.css';

const ITEMS = [
  { title: 'PSIRA Accredited', description: 'All our courses are accredited by PSIRA and meet national standards.', icon: <ShieldIcon /> },
  { title: 'Experienced Instructors', description: 'Learn from industry professionals with real-world experience.', icon: <PeopleIcon /> },
  { title: 'Practical Learning', description: 'Hands-on training that builds confidence and job-ready skills.', icon: <BookIcon /> },
  { title: 'Local & Accessible', description: 'Based in Mount Frere, making quality training close to home.', icon: <PinIcon /> },
  { title: 'Clear & Affordable', description: 'Upfront course information and transparent pricing.', icon: <PriceTagIcon /> },
  { title: 'Career Focused', description: 'We equip you with skills that open doors to opportunities.', icon: <BriefcaseIcon /> },
];

export function WhyChooseGrid() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Why Choose Liko</p>
        <h2>Training That Sets You Apart</h2>
        <div className={styles.underline} />
      </div>

      <div className={styles.grid}>
        {ITEMS.map((item) => (
          <div key={item.title} className={styles.item}>
            <span className={styles.iconBadge}>{item.icon}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 2l7 3v6c0 5-3 9.2-7 10-4-.8-7-5-7-10V5z" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 5c3 0 6 1 8 3 2-2 5-3 8-3v13c-3 0-6 1-8 3-2-2-5-3-8-3z" />
      <path d="M12 8v13" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 21s7-6.5 7-11.5A7 7 0 105 9.5C5 14.5 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.3" />
    </svg>
  );
}

function PriceTagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18M8 15h2" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  );
}
