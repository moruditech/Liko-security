'use client';

import { useFeeCalculation } from '@/lib/hooks/useFeeCalculation';
import type { Course } from '@/types/api';
import styles from './CourseSelectionGrid.module.css';

interface CourseSelectionGridProps {
  courses: Course[];
  selected: string[];
  onChange: (selected: string[]) => void;
  psiraFee: number;
}

export function CourseSelectionGrid({ courses, selected, onChange, psiraFee }: CourseSelectionGridProps) {
  const { total } = useFeeCalculation(courses, selected, psiraFee);

  function toggle(id: string) {
    onChange(selected.includes(id) ? selected.filter((c) => c !== id) : [...selected, id]);
  }

  return (
    <div>
      <div className={styles.grid}>
        {courses.map((course) => (
          <label key={course.id} className={styles.card}>
            <input type="checkbox" checked={selected.includes(course.id)} onChange={() => toggle(course.id)} />
            <span>
              Grade {course.grade}: {course.title}
            </span>
            <span className="mono">R{course.fee.toLocaleString('en-ZA')}</span>
          </label>
        ))}
      </div>
      <div className={styles.total}>
        <span>Total (incl. PSIRA fee)</span>
        <span className="mono">{selected.length > 0 ? `R${total.toLocaleString('en-ZA')}` : 'Select a course'}</span>
      </div>
    </div>
  );
}
