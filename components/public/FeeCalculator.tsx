'use client';

import { useState } from 'react';
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
      <h2>Fee Calculator</h2>
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
        <span>Total</span>
        {/*
          FLAG: DESIGN.md §5.1's own mockup shows "Total: R, " using an em
          dash as the empty-state placeholder. The project's copy rule bans
          em dashes with no exceptions, so this uses "Select a course" text
          instead rather than silently keeping the em dash. Worth a quick
          confirmation from whoever owns DESIGN.md that this substitution
          reads fine in the real layout.
        */}
        <span className="mono">{selected.length > 0 ? `R${total.toLocaleString('en-ZA')}` : 'Select a course'}</span>
      </div>
    </div>
  );
}
