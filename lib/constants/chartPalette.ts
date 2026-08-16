import type { ApplicationStatus } from '@/types/api';

/**
 * Chart colors reference the same CSS custom properties as everything else
 * in app/globals.css (DESIGN.md's single source of truth for color), passed
 * straight through as SVG fill/stroke attribute values, which resolve CSS
 * custom properties and color-mix() the same way a stylesheet would. No hex
 * value is duplicated here, and no new hue is introduced beyond the five
 * tokens the rest of the app already uses (navy, gold, success, error, plus
 * the navy/gold blend already established in CourseManagementTable and
 * ApplicationsStatsRow for a fourth accent).
 */
const BASE_COLORS = [
  'var(--liko-navy)',
  'var(--liko-gold)',
  'var(--liko-success)',
  'var(--liko-error)',
  'color-mix(in srgb, var(--liko-navy) 60%, var(--liko-gold) 40%)',
];

function tint(color: string, whitePercent: number) {
  return `color-mix(in srgb, ${color} ${100 - whitePercent}%, var(--liko-paper) ${whitePercent}%)`;
}

/** Cycles the base palette, tinting lighter on each repeat pass so a chart with more categories than base colors (e.g. all 9 provinces) still reads as distinct. */
export function chartPalette(count: number): string[] {
  const colors: string[] = [];
  let pass = 0;
  while (colors.length < count) {
    // noUncheckedIndexedAccess means this index read is typed
    // `string | undefined` even though the modulo guarantees it's always
    // in bounds; the fallbacks are unreachable in practice, just satisfying
    // the type.
    const source = BASE_COLORS[colors.length % BASE_COLORS.length] ?? BASE_COLORS[0] ?? 'var(--liko-navy)';
    colors.push(pass === 0 ? source : tint(source, pass * 30));
    if (colors.length % BASE_COLORS.length === 0) pass += 1;
  }
  return colors;
}

// Fixed, semantic, reused everywhere an application status needs a color
// (charts here, and matches the status chip tones already established in
// StatusChip.tsx / DESIGN.md §5.3 as closely as the chip system allows).
export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  new: 'var(--liko-gold)',
  under_review: 'color-mix(in srgb, var(--liko-navy) 60%, var(--liko-gold) 40%)',
  payment_verified: 'var(--liko-navy)',
  enrolled: 'var(--liko-success)',
  rejected: 'var(--liko-error)',
};

// Matches StatusChip.tsx's label casing exactly for visual consistency
// between the chip system and these chart legends/tooltips.
export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  new: 'New',
  under_review: 'Under Review',
  payment_verified: 'Payment Verified',
  enrolled: 'Enrolled',
  rejected: 'Rejected',
};

// Shared recharts styling so every chart on the dashboard looks like one
// system rather than each panel improvising its own tooltip/axis look.
export const CHART_TOOLTIP_STYLE = {
  contentStyle: {
    background: 'var(--liko-paper)',
    border: '1px solid var(--liko-panel)',
    borderRadius: 'var(--radius-md)',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--step-caption)',
    color: 'var(--liko-ink)',
  },
  labelStyle: {
    color: 'var(--liko-navy)',
    fontWeight: 600,
    marginBottom: '0.25rem',
  },
};

export const CHART_AXIS_STYLE = {
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--step-caption)',
  fill: 'var(--liko-ink)',
};

export const CHART_GRID_COLOR = 'var(--liko-panel)';
