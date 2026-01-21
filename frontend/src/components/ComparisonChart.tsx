"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: any[];
}

export default function ComparisonChart({ data }: Props) {
  if (!data || data.length < 2) return null;

  const chartData = [
    { metric: "Cost", Open: data[0].cost, Closed: data[1].cost },
    { metric: "Latency", Open: data[0].latency, Closed: data[1].latency },
    { metric: "Privacy", Open: data[0].privacy, Closed: data[1].privacy },
    { metric: "Control", Open: data[0].control, Closed: data[1].control },
    {
      metric: "Customization",
      Open: data[0].customization,
      Closed: data[1].customization,
    },
  ];

  return (
    <div className="w-full h-[420px]">
      <ResponsiveContainer>
        <RadarChart data={chartData} outerRadius="80%">
          {/* Grid */}
          <PolarGrid stroke="rgba(255,255,255,0.08)" />

          {/* Axes */}
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fill: "#cbd5f5", fontSize: 12, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 5]}
            tick={{ fill: "#94a3b8", fontSize: 10 }}
            axisLine={false}
          />

          {/* Tooltip */}
          <Tooltip
            contentStyle={{
              backgroundColor: "#020617",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: "#e5e7eb" }}
          />

          {/* Open Source */}
          <Radar
            name="Open Source"
            dataKey="Open"
            stroke="#22c55e"
            fill="#22c55e"
            fillOpacity={0.25}
            strokeWidth={2}
          />

          {/* Closed Source */}
          <Radar
            name="Closed Source"
            dataKey="Closed"
            stroke="#f43f5e"
            fill="#f43f5e"
            fillOpacity={0.25}
            strokeWidth={2}
          />

          {/* Legend */}
          <Legend
            iconType="circle"
            wrapperStyle={{
              color: "#e5e7eb",
              fontSize: 12,
              paddingTop: 12,
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
