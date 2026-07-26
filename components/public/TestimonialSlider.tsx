'use client';

import { useState } from 'react';
import type { Testimonial } from '@/types/api';
import styles from './TestimonialSlider.module.css';

export function TestimonialSlider({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);

  if (testimonials.length === 0) return null;

  const current = testimonials[index];
  if (!current) return null;

  return (
    <section className={styles.section} aria-label="Testimonials">
      <h2>What our graduates say</h2>
      <blockquote className={styles.quote}>
        <p>&ldquo;{current.quote}&rdquo;</p>
        <footer>
          {current.name}, Grade {current.grade}
        </footer>
      </blockquote>
      {testimonials.length > 1 && (
        <div className={styles.controls}>
          <button
            type="button"
            onClick={() => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)}
            aria-label="Previous testimonial"
          >
            ‹
          </button>
          <span>
            {index + 1} of {testimonials.length}
          </span>
          <button
            type="button"
            onClick={() => setIndex((i) => (i + 1) % testimonials.length)}
            aria-label="Next testimonial"
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}
