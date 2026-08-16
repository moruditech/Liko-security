'use client';

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import type { AnalyticsDashboard } from '@/types/api';
import { CHART_AXIS_STYLE, CHART_GRID_COLOR, CHART_TOOLTIP_STYLE } from '@/lib/constants/chartPalette';
import { ChartPanel } from './ChartPanel';

interface ApplicationsTrendChartProps {
  applications: AnalyticsDashboard['lines']['applications'];
  enrollments: AnalyticsDashboard['lines']['enrollments'];
  loading?: boolean;
}

export function ApplicationsTrendChart({ applications, enrollments, loading }: ApplicationsTrendChartProps) {
  const dates = Array.from(new Set([...applications.map((p) => p.date), ...enrollments.map((p) => p.date)])).sort();
  const applicationsByDate = new Map(applications.map((p) => [p.date, p.count]));
  const enrollmentsByDate = new Map(enrollments.map((p) => [p.date, p.count]));
  const data = dates.map((date) => ({
    date,
    Applications: applicationsByDate.get(date) ?? 0,
    Enrollments: enrollmentsByDate.get(date) ?? 0,
  }));

  return (
    <ChartPanel
      title="Applications & enrollments"
      subtitle="New applications submitted vs. learners enrolled, over time"
      loading={loading}
      empty={!loading && data.length === 0}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={CHART_GRID_COLOR} vertical={false} />
          <XAxis dataKey="date" tick={CHART_AXIS_STYLE} tickLine={false} axisLine={{ stroke: CHART_GRID_COLOR }} />
          <YAxis tick={CHART_AXIS_STYLE} tickLine={false} axisLine={false} allowDecimals={false} width={32} />
          <Tooltip {...CHART_TOOLTIP_STYLE} />
          <Legend wrapperStyle={{ fontFamily: 'var(--font-body)', fontSize: 'var(--step-caption)' }} />
          <Line type="monotone" dataKey="Applications" stroke="var(--liko-navy)" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Enrollments" stroke="var(--liko-success)" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
}
