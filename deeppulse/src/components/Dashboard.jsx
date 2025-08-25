// src/components/Dashboard.jsx
import { useState, useEffect } from "react";
import { format, subDays, subMonths, subQuarters } from "date-fns";
import {ChevronDown } from "lucide-react";

//KPIs
import KPIs from "./charts/KPIs";
import SentimentGauge from "./charts/SentimentGuage";
// data
import orgData from "../data/outputs_v02.json";
import TriggerActivityChart from "./charts/triggerActivityChart";
import SentimentTrendChart from "./charts/SentimentTrendChart";
import SummaryCharts from "./charts/SummaryCharts";

export default function Dashboard() {
  const [open, setOpen] = useState(false);

  // trigger based filtering (only show data from selected trigger)
  const [selectedTrigger, setSelectedTrigger] = useState("All");

  const [range, setRange] = useState({
    from: subDays(new Date(), 7),  // default last 7 days
    to: new Date(),
  });

  // const [timeRange, setTimeRange] = useState("last7");
  const [selectedDept, setSelectedDept] = useState("All");

  const depts = ["All", ...new Set(orgData.weeks.flatMap(w => w.departments.map(d => d.department)))];


  // Filter weeks by selected date range
  const filteredWeeks = orgData.weeks.filter((w) => {
    const weekDate = new Date(w.week);
    return weekDate >= range.from && weekDate <= range.to;
  });

  // Aggregate data over filtered weeks
  const aggregatedData = filteredWeeks.reduce((acc, week) => {
    week.departments.forEach((dept) => {
      const existing = acc.departments.find(d => d.department === dept.department);
      if (existing) {
        existing.responses += dept.responses;
        existing.positive += dept.positive;
        existing.neutral += dept.neutral;
        existing.negative += dept.negative;
      } else {
        acc.departments.push({ ...dept });
      }
    });

    // Aggregate teh trigger activity
    week.trigger_activity.forEach((trigger) => {
      const existing = acc.trigger_activity.find(t => t.trigger_type === trigger.trigger_type);
      if (existing) {
        existing.responses += trigger.responses;
        existing.positive += trigger.positive;
        existing.neutral += trigger.neutral;
        existing.negative += trigger.negative;
      } else {
        acc.trigger_activity.push({ ...trigger });
      }
    });

    return acc;
  }, {departments:[], trigger_activity: []}
);



  const dataToUse = 
    selectedDept === "All"
    ? aggregatedData
    : { 
      departments: aggregatedData.departments.filter(d => d.department === selectedDept),
      trigger_activity: aggregatedData.trigger_activity,
    };
  

  const presets = [
    { label: "Last 7 days", range: { from: subDays(new Date(), 7), to: new Date() } },
    { label: "Last Month", range: { from: subMonths(new Date(), 1), to: new Date() } },
    { label: "Last Quarter", range: { from: subQuarters(new Date(), 1), to: new Date() } },
  ];

  const applyRange = (r) => {
    setRange(r);
    setOpen(false);
  };
  

  return (
    <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

        {/* Filters */}
        <div className="flex gap-4 mb-8">
          {/* Time filter */}
          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 shadow-sm"
          >
            <span className="font-medium">
              {format(range.from, "MMM d")} - {format(range.to, "MMM d, yyyy")}
            </span>

          </button>

          {/* Department Filter */}
          <select 
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-white shadow-sm"
          >
            {depts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          
          {/* Trigger Filter - future feature */}
          {/* <select 
            value={selectedTrigger}
            onChange={(e) => setSelectedTrigger(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-white shadow-sm"
          >
            <option value="All">All Triggers</option>
            {Object.keys(orgData.triggers).map((t) => (
              <option key={t} value={t}> {t.replaceAll("_", " ")} </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y" /> */}
        </div>

        {/* Modal for the date filter */}
        {open && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-200/40 backdrop-blur-sm z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
              <h3 className="text-lg font-semibold mb-4">Select Date Range</h3>

              {/* Presets */}
              <div className="flex flex-wrap gap-2 mb-4">
                {presets.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => applyRange(p.range)}
                    className="px-3 py-2 border rounded-lg hover:bg-gray-100 transition"
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Custom Date Pickers */}
              <div className="flex flex-col gap-3">
                <label className="flex flex-col">
                  <span className="text-sm text-gray-600">Start Date</span>
                  <input
                    type="date"
                    className="border rounded-lg px-3 py-2"
                    value={format(range.from, "yyyy-MM-dd")}
                    onChange={(e) =>
                      setRange((prev) => ({ ...prev, from: new Date(e.target.value) }))
                    }
                  />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm text-gray-600">End Date</span>
                  <input
                    type="date"
                    className="border rounded-lg px-3 py-2"
                    value={format(range.to, "yyyy-MM-dd")}
                    onChange={(e) =>
                      setRange((prev) => ({ ...prev, to: new Date(e.target.value) }))
                    }
                  />
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* KPI Cards Row */}
        <KPIs dataToUse={dataToUse} orgData={orgData} />
        <SentimentGauge dataToUse = {dataToUse} />

      {/* Charts placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 rounded-lg shadow bg-white border">
          <TriggerActivityChart triggerData={dataToUse.trigger_activity} />
        </div>
        <div className="p-4 rounded-lg shadow bg-white border">
          <SentimentTrendChart weeks={filteredWeeks} selectedDept={selectedDept} />
        </div>
        <div className="p-4 rounded-lg shadow bg-white border">
          <SummaryCharts summaries={filteredWeeks.map(w => w.summary)} />
        </div>
        {/* <div className="p-4 rounded-lg shadow bg-white border">MoodBreakdown</div>
        <div className="p-4 rounded-lg shadow bg-white border">TrendOverTime</div>
        <div className="p-4 rounded-lg shadow bg-white border">DepartmentBreakdown</div>
        <div className="p-4 rounded-lg shadow bg-white border">TriggerActivity</div> */}
      </div>
    </div>
  );
}
        