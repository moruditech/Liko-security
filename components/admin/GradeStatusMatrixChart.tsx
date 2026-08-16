'use client';

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { AnalyticsDashboard, ApplicationStatus } from '@/types/api';
import { CHART_AXIS_STYLE, CHART_GRID_COLOR, CHART_TOOLTIP_STYLE, STATUS_COLORS, STATUS_LABELS } from '@/lib/constants/chartPalette';
import { ChartPanel } from './ChartPanel';

const STATUS_ORDER: ApplicationStatus[] = ['new', 'under_review', 'payment_verified', 'enrolled', 'rejected'];

interface GradeStatusMatrixChartProps {
  matrix: AnalyticsDashboard['gradeStatusMatrix'];
  loading?: boolean;
}

export function GradeStatusMatrixChart({ matrix, loading }: GradeStatusMatrixChartProps) {
  const grades = Object.keys(matrix).sort();
  const data = grades.map((grade) => {
    const row: Record<string, string | number> = { grade: `Grade ${grade}` };
    for (const status of STATUS_ORDER) row[STATUS_LABELS[status]] = matrix[grade]?.[status] ?? 0;
    return row;
  });

  return (
    <ChartPanel
      title="Applications by grade and status"
      subtitle="Every application, broken down by the grade applied for and its current status"
      loading={loading}
      empty={!loading && grades.length === 0}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={CHART_GRID_COLOR} vertical={false} />
          <XAxis dataKey="grade" tick={CHART_AXIS_STYLE} tickLine={false} axisLine={{ stroke: CHART_GRID_COLOR }} />
          <YAxis tick={CHART_AXIS_STYLE} tickLine={false} axisLine={false} allowDecimals={false} width={32} />
          <Tooltip {...CHART_TOOLTIP_STYLE} />
          <Legend wrapperStyle={{ fontFamily: 'var(--font-body)', fontSize: 'var(--step-caption)' }} />
          {STATUS_ORDER.map((status) => (
            <Bar key={status} dataKey={STATUS_LABELS[status]} stackId="grade" fill={STATUS_COLORS[status]} radius={0} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
}
