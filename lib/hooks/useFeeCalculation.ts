import { useMemo } from 'react';
import type { Course } from '@/types/api';

/**
 * Single shared calculation used by both Home's FeeCalculator and /apply's
 * CourseSelectionGrid running total (TAD §13's shared-hook note), so the
 * two surfaces can never quietly drift out of sync on how the total is
 * computed.
 */
export function useFeeCalculation(courses: Course[], selectedCourseIds: string[], psiraFee: number) {
  return useMemo(() => {
    const selected = courses.filter((c) => selectedCourseIds.includes(c.id));
    const coursesSubtotal = selected.reduce((sum, c) => sum + c.fee, 0);
    const total = coursesSubtotal + (selected.length > 0 ? psiraFee : 0);
    return { selected, coursesSubtotal, psiraFee, total };
  }, [courses, selectedCourseIds, psiraFee]);
}
