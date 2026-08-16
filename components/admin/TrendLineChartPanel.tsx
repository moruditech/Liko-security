'use client';

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CHART_AXIS_STYLE, CHART_GRID_COLOR, CHART_TOOLTIP_STYLE } from '@/lib/constants/chartPalette';
import { ChartPanel } from './ChartPanel';

interface TrendLineChartPanelProps {
  title: string;
  subtitle?: string;
  data: Record<string, string | number>[];
  dataKey: string;
  color: string;
  valueFormatter?: (value: number) => string;
  loading?: boolean;
}

/** Shared single-series trend line for smaller, secondary metrics (inquiry response time, failed logins). */
export function TrendLineChartPanel({ title, subtitle, data, dataKey, color, valueFormatter, loading }: TrendLineChartPanelProps) {
  return (
    <ChartPanel title={title} subtitle={subtitle} loading={loading} empty={!loading && data.length === 0}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={CHART_GRID_COLOR} vertical={false} />
          <XAxis dataKey="date" tick={CHART_AXIS_STYLE} tickLine={false} axisLine={{ stroke: CHART_GRID_COLOR }} />
          <YAxis tick={CHART_AXIS_STYLE} tickLine={false} axisLine={false} width={40} tickFormatter={valueFormatter} />
          <Tooltip {...CHART_TOOLTIP_STYLE} formatter={valueFormatter ? (value: number) => valueFormatter(value) : undefined} />
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
}
