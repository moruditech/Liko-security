'use client';

import { useEffect, useRef, useState } from 'react';
import type { Course } from '@/types/api';
import styles from './CourseManagementTable.module.css';

interface CourseManagementTableProps {
  courses: Course[];
  onEdit: (course: Course) => void;
  onToggleActive: (course: Course) => void;
  onDuplicate: (course: Course) => void;
}

const PAGE_SIZE = 8;

// Cycles through the existing brand tokens (no new hues added, per
// DESIGN.md §3.2/§3.4's restraint on the color palette) so each grade
// still reads as visually distinct.
const GRADE_ACCENTS = [styles.grade_navy, styles.grade_success, styles.grade_gold, styles.grade_mixed];

export function CourseManagementTable({ courses, onEdit, onToggleActive, onDuplicate }: CourseManagementTableProps) {
  const [page, setPage] = useState(1);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setPage(1);
    setShowAll(false);
  }, [courses]);

  const total = courses.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = showAll ? 0 : (currentPage - 1) * PAGE_SIZE;
  const end = showAll ? total : Math.min(start + PAGE_SIZE, total);
  const visible = courses.slice(start, end);

  // Stable accent per grade letter, not per row index, so the same grade
  // always gets the same color across pages.
  const grades = Array.from(new Set(courses.map((c) => c.grade))).sort();
  function accentFor(grade: string) {
    const idx = grades.indexOf(grade);
    return GRADE_ACCENTS[idx % GRADE_ACCENTS.length] ?? styles.grade_navy;
  }

  if (total === 0) {
    return (
      <div className={styles.card}>
        <p className={styles.empty}>No courses match your filters.</p>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Course</th>
            <th>Grade</th>
            <th>Duration</th>
            <th>Fee (ZAR)</th>
            <th>Active</th>
            <th className={styles.actionsHeader}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((course) => (
            <tr key={course.id}>
              <td className={styles.titleCell}>{course.title}</td>
              <td>
                <span className={`${styles.gradeBadge} ${accentFor(course.grade)}`}>{course.grade}</span>
              </td>
              <td>{course.duration}</td>
              <td className="mono">R{course.fee.toLocaleString('en-ZA')}</td>
              <td>
                <span className={course.isActive ? styles.pillYes : styles.pillNo}>{course.isActive ? 'Yes' : 'No'}</span>
              </td>
              <td>
                <RowActions
                  course={course}
                  onEdit={() => onEdit(course)}
                  onToggleActive={() => onToggleActive(course)}
                  onDuplicate={() => onDuplicate(course)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className={styles.cardList}>
        {visible.map((course) => (
          <li key={course.id} className={styles.rowCard}>
            <div className={styles.rowCardTop}>
              <span className={`${styles.gradeBadge} ${accentFor(course.grade)}`}>{course.grade}</span>
              <span className={styles.rowCardTitle}>{course.title}</span>
              <RowActions
                course={course}
                onEdit={() => onEdit(course)}
                onToggleActive={() => onToggleActive(course)}
                onDuplicate={() => onDuplicate(course)}
              />
            </div>
            <div className={styles.rowCardMeta}>
              <span>{course.duration}</span>
              <span aria-hidden="true">&middot;</span>
              <span className="mono">R{course.fee.toLocaleString('en-ZA')}</span>
              <span aria-hidden="true">&middot;</span>
              <span className={course.isActive ? styles.pillYes : styles.pillNo}>{course.isActive ? 'Active' : 'Inactive'}</span>
            </div>
          </li>
        ))}
      </ul>

      <div className={styles.footer}>
        <p className={styles.footerText}>
          {showAll ? (
            <>Showing all {total} courses</>
          ) : (
            <>
              Showing {start + 1} to {end} of {total} courses
            </>
          )}
        </p>

        {!showAll && totalPages > 1 && (
          <nav className={styles.pager} aria-label="Course list pages">
            <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} aria-label="Previous page">
              <ChevronLeftIcon />
            </button>
            {pageNumbers(currentPage, totalPages).map((n, i) =>
              n === '...' ? (
                <span key={`ellipsis-${i}`} className={styles.ellipsis}>
                  &hellip;
                </span>
              ) : (
                <button
                  key={n}
                  type="button"
                  className={n === currentPage ? styles.pageActive : undefined}
                  onClick={() => setPage(n as number)}
                >
                  {n}
                </button>
              )
            )}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <ChevronRightIcon />
            </button>
          </nav>
        )}

        {!showAll && total > PAGE_SIZE && (
          <button type="button" className={styles.viewAll} onClick={() => setShowAll(true)}>
            View all
          </button>
        )}
        {showAll && (
          <button type="button" className={styles.viewAll} onClick={() => setShowAll(false)}>
            Show paginated
          </button>
        )}
      </div>
    </div>
  );
}

function pageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, 2, total - 1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const result: (number | '...')[] = [];
  let prev = 0;
  for (const n of sorted) {
    if (prev && n - prev > 1) result.push('...');
    result.push(n);
    prev = n;
  }
  return result;
}

interface RowActionsProps {
  course: Course;
  onEdit: () => void;
  onToggleActive: () => void;
  onDuplicate: () => void;
}

function RowActions({ course, onEdit, onToggleActive, onDuplicate }: RowActionsProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className={styles.actionsCell} ref={ref}>
      <button type="button" className={styles.iconButton} onClick={onEdit} aria-label={`Edit ${course.title}`}>
        <PencilIcon />
      </button>
      <div className={styles.menuWrap}>
        <button
          type="button"
          className={styles.iconButton}
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={`More actions for ${course.title}`}
        >
          <KebabIcon />
        </button>
        {open && (
          <div className={styles.menu} role="menu">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onToggleActive();
              }}
            >
              {course.isActive ? 'Mark inactive' : 'Mark active'}
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onDuplicate();
              }}
            >
              Duplicate
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function KebabIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="5" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="12" cy="19" r="1.6" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
