// src/components/SummaryInsights.jsx
import React from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "../ui/Card";

export default function SummaryInsights({ summaries }) {
  // Flatten summaries across filtered weeks
  const goingWell = summaries.flatMap(s => s?.what_is_going_well || []);
  const needsAttention = summaries.flatMap(s => s?.what_needs_attention || []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Going Well */}
      <Card className="bg-green-50 border-green-200">
        <h3 className="flex items-center gap-2 text-green-700 font-semibold">
          <CheckCircle2 className="w-5 h-5" />
          What’s Going Well
        </h3>
        <CardContent>
          {goingWell.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {goingWell.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No positive highlights for this period.</p>
          )}
        </CardContent>
      </Card>

      {/* Needs Attention */}
      <Card className="bg-red-50 border-red-200">
        <h3 className="flex items-center gap-2 text-red-700 font-semibold">
          <AlertTriangle className="w-5 h-5" />
          What Needs Attention
        </h3>
        <CardContent>
          {needsAttention.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {needsAttention.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No risks identified for this period.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}