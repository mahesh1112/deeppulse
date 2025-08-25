// src/components/Dashboard.jsx
import { useState, useEffect } from "react";
import { format, subDays, subMonths, subQuarters } from "date-fns";
import { Users, TrendingUp, Smile, Star } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState({
    from: new Date(),
    to: new Date(),
  });

  const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"]; // Green, Amber, Red


  // Sample org-level data 
  const orgData = {
    overall_mood: { happy: 58, okay: 27, unhappy: 15 },
    participation: { total_responses: 240, response_rate_percent: 68 },
    by_team: [
      { team: "Engineering", responses: 90 },
      { team: "Sales", responses: 65 },
      { team: "HR", responses: 20 },
      { team: "Support", responses: 40 },
      { team: "Marketing", responses: 25 },
    ],
    what_people_liked: ["Good teamwork", "Helpful managers", "Learning opportunities"],
    what_people_struggled_with: ["Heavy workload", "Unclear roles", "Access to tools"],
    avg_rating: 42,
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

  function StatCard({ icon: Icon, label, value}) {
    const [count, setCount] = useState(0);
  
    // Animate number count-up
    useEffect(() => {
      let start = 0;
      const end = value;
      if (start === end) return;
  
      let increment = end / 50; // speed
      let timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          start = end;
          clearInterval(timer);
        }
        setCount(Math.round(start));
      }, 30);
  
      return () => clearInterval(timer);
    }, [value]);

    return (
        // <div
        //   style={{ backgroundImage: `linear-gradient(to bottom right, ${gradientFrom}, ${gradientTo})` }}
        //   className="flex flex-col items-center justify-center p-4 rounded-2xl shadow-md text-white transition transform hover:scale-105"
        // >
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl shadow-sm border border-gray-300 text-gray-700 transition transform hover:scale-105 bg-white">
          <Icon className="w-8 h-8 mb-3" />
          <h3 className="text-sm opacity-80">{label}</h3>
          <p className="text-3xl font-bold">{count}</p>
        </div>
      );
    }

    // Chart data
  const moodData = [
    { name: "Happy", value: orgData.overall_mood.happy },
    { name: "Okay", value: orgData.overall_mood.okay },
    { name: "Unhappy", value: orgData.overall_mood.unhappy },
  ];
    
  
  return (
    <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

        {/* Date Filter Button */}
        <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 shadow-sm"
        >
            {format(range.from, "MMM d, yyyy")} - {format(range.to, "MMM d, yyyy")}
        </button>

        {/* Modal (simple) */}
        {open && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-200/40 backdrop-blur-sm z-50">
            <div className="bg-white/100 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg w-full max-w-md p-6">
                <h3 className="text-lg font-semibold mb-4">Select Date Range</h3>

                {/* Presets */}
                <div className="flex flex-wrap gap-2 mb-4">
                {presets.map((p, i) => (
                    <button
                    key={i}
                    onClick={() => applyRange(p.range)}
                    className="px-3 py-2 border rounded-lg hover:bg-gray-100 transition">
                    {p.label}
                    </button>
                ))}
                </div>

                {/* Custom range */}
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


      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
        <StatCard icon={Users} label="Total Responses" value={orgData.participation.total_responses}/>
        <StatCard icon={TrendingUp} label="Participation Rate" value={orgData.participation.response_rate_percent}/>
        <StatCard icon={Smile} label="% Happy Employees" value={orgData.overall_mood.happy}/>
        <StatCard icon={Star} label="Recommendation Score" value={orgData.recommendation_score}/>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mood Breakdown Pie Chart */}
            <div className="p-4 bg-white rounded-xl border shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Mood Breakdown</h3>
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                <Pie
                    data={moodData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                >
                    {moodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
                </PieChart>
            </ResponsiveContainer>
            </div>
        </div>


    </div>
  );
}
