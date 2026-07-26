import styles from './PrerequisitesChecklist.module.css';

/**
 * FLAG: none of the provided documents (TAD, DESIGN.md, backend source)
 * specify Liko's actual enrollment prerequisites. The items below are
 * commonly-required PSIRA basics, included as a structural placeholder so
 * the page isn't empty, not content that's been confirmed against Liko's
 * real requirements. Get the real list from the client before this ships,
 * the same way TAD §11.8/§11.9 defer legal copy to counsel.
 */
const PREREQUISITES = [
  'South African ID or valid passport',
  'Minimum age 18',
  'Certified copy of ID document for the application',
  'Basic literacy in English or the language of instruction',
];

export function PrerequisitesChecklist() {
  return (
    <div className={styles.box}>
      <h3>Before you apply</h3>
      <ul>
        {PREREQUISITES.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
