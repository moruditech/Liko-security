import styles from './RegistrationFeeExplainer.module.css';

export function RegistrationFeeExplainer({ psiraFee }: { psiraFee: number }) {
  return (
    <div className={styles.box}>
      <h3>PSIRA registration fee</h3>
      <p>
        In addition to your course fee, a compulsory PSIRA registration fee of{' '}
        <strong className="mono">R{psiraFee.toLocaleString('en-ZA')}</strong> applies to every applicant, regardless
        of which grade you enrol in.
      </p>
    </div>
  );
}
