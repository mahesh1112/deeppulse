// src/components/KPIs.jsx
import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Users, BarChart3, Smile, Meh, Frown } from "lucide-react";
import {Card, CardContent} from "../ui/Card"

export default function KPIs({ dataToUse, totalEmployees = 500 }) {
  function StatCard({ icon: Icon, label, value, color, suffix = "", delta = null, trend = null }) {
    const [count, setCount] = useState(0);
    
    // Animate number count-up
    useEffect(() => {
      let start = 0;
      const end = typeof value === 'string' ? 0 : value;
      if (start === end || typeof value === 'string') {
        setCount(end);
        return;
      }
      
      let increment = Math.abs(end) / 30;
      let timer = setInterval(() => {
        start += increment;
        if (start >= Math.abs(end)) {
          start = end;
          clearInterval(timer);
        }
        setCount(Math.round(start));
      }, 50);
      
      return () => clearInterval(timer);
    }, [value]);

    const getTrendIcon = () => {
      if (!trend) return null;
      return trend > 0 ? (
        <TrendingUp className="w-4 h-4 text-green-400" />
      ) : (
        <TrendingDown className="w-4 h-4 text-red-400" />
      );
    };

    const getTrendColor = () => {
      if (!trend) return 'text-gray-400';
      return trend > 0 ? 'text-green-400' : 'text-red-400';
    };

    return (
      <div
        className={`group relative overflow-hidden p-6 rounded-2xl shadow-md bg-gradient-to-br ${color} text-white transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer`}
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 -mr-4 -mt-4 w-10 h-10 bg-white/10 rounded-full transform group-hover:scale-110 transition-transform duration-300" />
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className="w-8 h-8 opacity-90 group-hover:opacity-100 transition-opacity" />
            {getTrendIcon()}
          </div>
          
          <h3 className="text-sm font-medium opacity-90 mb-2">{label}</h3>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold tracking-tight">
              {typeof value === 'string' ? value : count}
              {suffix}
            </p>
            {delta !== null && (
              <span className={`text-sm font-medium ${getTrendColor()}`}>
                {delta > 0 ? '+' : ''}{delta}%
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Calculate KPI values
   // Use the departments object from dataToUse, which is the aggregated data
   const departments = dataToUse.departments;
  
   // Calculate aggregated values
   const totalResponses = Object.values(departments).reduce((sum, dept) => sum + dept.responses, 0);
   const totalPositive = Object.values(departments).reduce((sum, dept) => sum + dept.positive, 0);
   const totalNegative = Object.values(departments).reduce((sum, dept) => sum + dept.negative, 0);
   
   const positivePercentage = totalResponses > 0 ? Math.round((totalPositive / totalResponses) * 100) : 0;
   
   // Note: The previousData and triggerActivity data are not provided by Dashboard.jsx based on your previous code.
   // The trigger activity data is not aggregated in the Dashboard component.
   // The sentiment delta calculation requires previousData, which is also not provided.
   // I will show you how to calculate these values but the `delta` and `mostDiscussedBucket`
   // will always be based on the currently filtered data without a previous period comparison.
   
   // Placeholder for previous period's data to avoid errors. You'd need to add this logic to Dashboard.jsx.
   const previousData = null; // This should be calculated and passed from Dashboard.jsx
   
   const sentimentDelta = 0; // Set to 0 since previousData is not available
   
   // The trigger activity data is not filtered and aggregated in Dashboard.jsx,
   // so this will show 'N/A' as the value.
   const mostDiscussedBucket = "N/A";
 
   return (
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
       <StatCard
         icon={BarChart3}
         label="Overall Sentiment"
         value={positivePercentage}
         suffix="%"
         color="from-emerald-500 via-emerald-600 to-emerald-700"
         delta={sentimentDelta}
         trend={sentimentDelta}
       />
       
       <StatCard
         icon={Users}
         label="Engagement Coverage"
         value={totalEmployees > 0 ? Math.round((totalResponses / totalEmployees) * 100) : 0}
         suffix="%"
         color="from-blue-500 via-blue-600 to-blue-700"
       />
       
       {/* <StatCard
         icon={MessageCircle}
         label="Most Discussed"
         value={mostDiscussedBucket}
         color="from-violet-500 via-violet-600 to-violet-700"
       /> */}
     </div>
   );
}