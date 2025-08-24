// SentimentGauge.jsx
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { Smile, Meh, Frown } from "lucide-react";
import {Card, CardContent} from "../ui/Card"


export default function SentimentGauge({ dataToUse }) {
  const departments = dataToUse.departments;

  // handle array OR object case
  const deptArray = Array.isArray(departments) ? departments : Object.values(departments);

  const totalResponses = deptArray.reduce((sum, dept) => sum + dept.responses, 0);
  const totalPositive = deptArray.reduce((sum, dept) => sum + dept.positive, 0);

  const positivePercentage =
    totalResponses > 0 ? Math.round((totalPositive / totalResponses) * 100) : 0;

  const chartData = [{ name: "Positive", value: positivePercentage, fill: "#10b981" }];


  // Pick emoji
  const getEmoji = () => {
    if (positivePercentage > 65) return <Smile className="w-6 h-6 text-green-500" />;
    if (positivePercentage >= 45) return <Meh className="w-6 h-6 text-yellow-500" />;
    return <Frown className="w-6 h-6 text-red-500" />;
  };

  return (
    <Card className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 text-white">
      <CardContent className="flex flex-col items-center justify-center p-6 h-full">
        <h3 className="text-md font-medium opacity-90 mb-2">Sentiment Balance</h3>

        <RadialBarChart
          width={200}
          height={120}
          cx={100}
          cy={120}
          innerRadius="70%"
          outerRadius="100%"
          startAngle={180}
          endAngle={0}
          data={chartData}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar background dataKey="value" cornerRadius={10} />
        </RadialBarChart>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-3xl">{getEmoji()}</span>
          <span className="text-2xl font-semibold">{positivePercentage}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
