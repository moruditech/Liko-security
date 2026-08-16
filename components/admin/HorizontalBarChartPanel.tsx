'use client';

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CHART_AXIS_STYLE, CHART_TOOLTIP_STYLE, chartPalette } from '@/lib/constants/chartPalette';
import { ChartPanel } from './ChartPanel';

interface HorizontalBarChartPanelProps {
  title: string;
  subtitle?: string;
  data: { name: string; count: number }[];
  loading?: boolean;
}

/**
 * Shared horizontal bar chart for any "category -> count" breakdown
 * (province, audit-log category, and similar). Vertical layout reads
 * better than a pie once there are more than five or six categories with
 * long labels, per applicationsByProvince/auditByCategory's shapes.
 */
export function HorizontalBarChartPanel({ title, subtitle, data, loading }: HorizontalBarChartPanelProps) {
  const sorted = [...data].sort((a, b) => b.count - a.count);
  const colors = chartPalette(sorted.length);

  return (
    <ChartPanel title={title} subtitle={subtitle} loading={loading} empty={!loading && sorted.length === 0}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sorted} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
          <XAxis type="number" tick={CHART_AXIS_STYLE} tickLine={false} axisLine={false} allowDecimals={false} />
          <YAxis type="category" dataKey="name" tick={CHART_AXIS_STYLE} tickLine={false} axisLine={false} width={110} />
          <Tooltip {...CHART_TOOLTIP_STYLE} cursor={{ fill: 'var(--liko-panel)' }} />
          <Bar dataKey="count" radius={4} barSize={16}>
            {sorted.map((entry, i) => (
              // chartPalette(sorted.length) guarantees enough colors, this fallback is unreachable (see chartPalette.ts).
              <Cell key={entry.name} fill={colors[i] ?? 'var(--liko-navy)'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
}
