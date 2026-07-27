'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Testimonial } from '@/types/api';
import styles from './TestimonialSlider.module.css';

export function TestimonialSlider({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);

  if (testimonials.length === 0) return null;

  const current = testimonials[index];
  if (!current) return null;

  return (
    <section className={styles.section} aria-label="Testimonials">
      <div className={styles.grid}>
        <div className={styles.copy}>
          <div className={styles.header}>
            <p className={styles.eyebrow}>Success Stories</p>
            <h2>What Our Students Say</h2>
            <div className={styles.underline} />
          </div>

          <div className={styles.quoteMark} aria-hidden="true">
            &ldquo;
          </div>
          <p className={styles.quote}>{current.quote}</p>

          <div className={styles.person}>
            <div className={styles.avatar}>
              {current.photoUrl && (
                <Image src={current.photoUrl} alt="" width={48} height={48} style={{ objectFit: 'cover' }} />
              )}
            </div>
            <div>
              <strong>{current.name}</strong>
              <span>Grade {current.grade} Graduate</span>
            </div>
          </div>

          {testimonials.length > 1 && (
            <div className={styles.dots} role="tablist" aria-label="Choose testimonial">
              {testimonials.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Show testimonial ${i + 1} of ${testimonials.length}`}
                  className={i === index ? styles.dotActive : styles.dot}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
          )}
        </div>

        <div className={styles.photoWrap}>
          <div className={styles.photo}>
            Photo placeholder
            <br />
            add a licensed image at
            <br />
            <code>public/testimonial-classroom.jpg</code>
          </div>
        </div>
      </div>
    </section>
  );
}
