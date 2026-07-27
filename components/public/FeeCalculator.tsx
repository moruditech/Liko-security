'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useFeeCalculation } from '@/lib/hooks/useFeeCalculation';
import type { Course } from '@/types/api';
import styles from './FeeCalculator.module.css';

interface FeeCalculatorProps {
  courses: Course[];
  psiraFee: number;
}

export function FeeCalculator({ courses, psiraFee }: FeeCalculatorProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const { total } = useFeeCalculation(courses, selected, psiraFee);

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.icon}>
          <CalculatorIcon />
        </span>
        <h2>Fee Calculator</h2>
      </div>

      <ul className={styles.list}>
        {courses.map((course) => (
          <li key={course.id}>
            <label>
              <input type="checkbox" checked={selected.includes(course.id)} onChange={() => toggle(course.id)} />
              Grade {course.grade}
            </label>
            <span className="mono">R{course.fee.toLocaleString('en-ZA')}</span>
          </li>
        ))}
        {selected.length > 0 && (
          <li className={styles.psiraRow}>
            <span>+ PSIRA fee</span>
            <span className="mono">R{psiraFee.toLocaleString('en-ZA')}</span>
          </li>
        )}
      </ul>

      <div className={styles.total}>
        <div className={styles.totalRow}>
          <span>Total</span>
          {/*
            FLAG: DESIGN.md §5.1's own mockup shows "Total: R, " using an em
            dash as the empty-state placeholder. The project's copy rule bans
            em dashes with no exceptions, so this uses "Select a course" text
            instead rather than silently keeping the em dash. Worth a quick
            confirmation from whoever owns DESIGN.md that this substitution
            reads fine in the real layout.
          */}
          <span className="mono">{selected.length > 0 ? `R${total.toLocaleString('en-ZA')}` : 'R0.00'}</span>
        </div>
        <p className={styles.totalCaption}>
          {selected.length > 0 ? 'Includes PSIRA registration fee' : 'Select a course to calculate the fee'}
        </p>
      </div>

      {/*
        FLAG: the reference image shows a single course dropdown plus a
        "Number of learners" +/- stepper multiplying a per-learner fee. The
        real data model (Course.fee) and the shared useFeeCalculation hook
        (also used by /apply's CourseSelectionGrid, see that hook's own
        comment about staying in sync) support multi-course checkbox
        selection with a flat PSIRA fee added once, not a per-learner
        multiplier. Building the dropdown+stepper UI as shown would mean
        either faking a calculation that doesn't reflect real pricing, or
        forking the shared hook so this surface and /apply's total can drift
        apart, so the checkbox list is kept and just restyled instead. Get
        Quote continues to /apply, where the same selections carry through
        via the shared hook.
      */}
      <Link href="/apply" className={styles.quoteBtn}>
        Get Quote
        <ArrowIcon />
      </Link>
    </div>
  );
}

function CalculatorIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--liko-navy)" strokeWidth="1.8" aria-hidden="true">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M8 6h8M8 10h2M12 10h2M16 10h0M8 14h2M12 14h2M16 14h0M8 18h2M12 18h2" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
