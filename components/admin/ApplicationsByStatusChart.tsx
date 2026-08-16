'use client';

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { AnalyticsDashboard } from '@/types/api';
import { CHART_TOOLTIP_STYLE, STATUS_COLORS, STATUS_LABELS } from '@/lib/constants/chartPalette';
import { ChartPanel } from './ChartPanel';

interface ApplicationsByStatusChartProps {
  data: AnalyticsDashboard['pies']['applicationsByStatus'];
  loading?: boolean;
}

export function ApplicationsByStatusChart({ data, loading }: ApplicationsByStatusChartProps) {
  const chartData = data.map((d) => ({ name: STATUS_LABELS[d.status] ?? d.status, value: d.count, color: STATUS_COLORS[d.status] }));

  return (
    <ChartPanel title="Applications by status" loading={loading} empty={!loading && chartData.length === 0}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="80%" paddingAngle={2}>
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} stroke="var(--liko-paper)" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip {...CHART_TOOLTIP_STYLE} />
          <Legend wrapperStyle={{ fontFamily: 'var(--font-body)', fontSize: 'var(--step-caption)' }} />
        </PieChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
}
