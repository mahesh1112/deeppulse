// src/components/charts/SentimentTrendChart.jsx
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

export default function SentimentTrendChart({ weeks, selectedDept }) {
  // Transform weeks into % values
  const chartData = weeks.map((week) => {
    // If "All", sum across depts
    const depts = selectedDept === "All"
      ? week.departments
      : week.departments.filter((d) => d.department === selectedDept);

    const totals = depts.reduce(
      (acc, d) => {
        acc.responses += d.responses;
        acc.positive += d.positive;
        acc.neutral += d.neutral;
        acc.negative += d.negative;
        return acc;
      },
      { responses: 0, positive: 0, neutral: 0, negative: 0 }
    );

    return {
      week: week.week,
      Positive: totals.responses ? (totals.positive / totals.responses) * 100 : 0,
      Neutral: totals.responses ? (totals.neutral / totals.responses) * 100 : 0,
      Negative: totals.responses ? (totals.negative / totals.responses) * 100 : 0,
    };
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-gray-500" />
        <h3 className="text-xl font-semibold">Overall Sentiment Trend</h3>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Sentiment percentages over time ({selectedDept === "All" ? "All Departments" : selectedDept}).
      </p>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
            <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
            <Legend />
            <Line type="monotone" dataKey="Positive" stroke="#10B981" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Neutral" stroke="#F59E0B" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Negative" stroke="#EF4444" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
