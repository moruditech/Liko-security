'use client';

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { AnalyticsDashboard } from '@/types/api';
import { CHART_AXIS_STYLE, CHART_GRID_COLOR, CHART_TOOLTIP_STYLE } from '@/lib/constants/chartPalette';
import { ChartPanel } from './ChartPanel';

interface RevenueTrendChartProps {
  revenue: AnalyticsDashboard['lines']['revenue'];
  loading?: boolean;
}

function formatRand(value: number) {
  return `R${value.toLocaleString('en-ZA')}`;
}

export function RevenueTrendChart({ revenue, loading }: RevenueTrendChartProps) {
  return (
    <ChartPanel
      title="Revenue"
      subtitle="Proforma vs. official invoices issued, over time"
      loading={loading}
      empty={!loading && revenue.length === 0}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={revenue} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={CHART_GRID_COLOR} vertical={false} />
          <XAxis dataKey="date" tick={CHART_AXIS_STYLE} tickLine={false} axisLine={{ stroke: CHART_GRID_COLOR }} />
          <YAxis tick={CHART_AXIS_STYLE} tickLine={false} axisLine={false} width={56} tickFormatter={formatRand} />
          <Tooltip {...CHART_TOOLTIP_STYLE} formatter={(value: number) => formatRand(value)} />
          <Legend wrapperStyle={{ fontFamily: 'var(--font-body)', fontSize: 'var(--step-caption)' }} />
          <Line type="monotone" dataKey="proforma" name="Proforma" stroke="var(--liko-gold)" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="official" name="Official" stroke="var(--liko-navy)" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
}
