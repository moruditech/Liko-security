'use client';

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { AnalyticsDashboard } from '@/types/api';
import { CHART_TOOLTIP_STYLE, chartPalette } from '@/lib/constants/chartPalette';
import { ChartPanel } from './ChartPanel';

interface ApplicationsByGradeChartProps {
  data: AnalyticsDashboard['pies']['applicationsByGrade'];
  loading?: boolean;
}

export function ApplicationsByGradeChart({ data, loading }: ApplicationsByGradeChartProps) {
  const colors = chartPalette(data.length);
  const chartData = data.map((d, i) => ({ name: `Grade ${d.grade}`, value: d.count, color: colors[i] }));

  return (
    <ChartPanel title="Applications by grade" loading={loading} empty={!loading && chartData.length === 0}>
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
