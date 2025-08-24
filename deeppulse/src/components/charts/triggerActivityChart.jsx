// src/components/charts/TriggerActivityChart.jsx
import React from 'react';
import { BarChart3 } from 'lucide-react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
  } from 'recharts';

export default function TriggerActivityChart({ triggerData }) {

  const chartData = triggerData.map(t => ({
    triggerType: t.trigger_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    Positive: t.positive,
    Neutral: t.neutral,
    Negative: t.negative,
  }));
  const colors = {
    Positive: '#10B981', // green
    Neutral: '#F59E0B',  // amber
    Negative: '#EF4444', // red
  };


  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-gray-500" />
        <h3 className="text-xl font-semibold">Sentiment by Trigger Activity</h3>
      </div>
      
      <div className="flex-1">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="triggerType" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Positive" stackId="a" fill={colors.Positive} />
            <Bar dataKey="Neutral" stackId="a" fill={colors.Neutral} />
            <Bar dataKey="Negative" stackId="a" fill={colors.Negative} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}